import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Verify token and get user info
          const response = await api.get(`/auth/profile/${localStorage.getItem('username')}`);
          
          // Convert roles to string array if they come as objects
          const userData = response.data;
          let roles: string[] = [];
          
          if (userData.roles) {
            if (Array.isArray(userData.roles)) {
              roles = userData.roles.map((role: any) => 
                typeof role === 'string' ? role : role.name || role
              );
            } else {
              roles = [typeof userData.roles === 'string' ? userData.roles : userData.roles.name || userData.roles];
            }
          } else {
            // Fallback: try to get roles from localStorage
            const storedRoles = localStorage.getItem('userRoles');
            if (storedRoles) {
              try {
                roles = JSON.parse(storedRoles);
              } catch {}
            }
          }
          
          const user: User = {
            id: userData.id || 0,
            username: userData.username,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            roles: roles
          };
          
          setUser(user);
          setToken(storedToken);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/login', {
        usernameOrEmail: username,
        password: password
      });

      const { token: authToken, userId, username: responseUsername, email, firstName, lastName, roles } = response.data;
      
      // Create user object from response data
      const userData: User = {
        id: userId || 0,
        username: responseUsername,
        email,
        firstName,
        lastName,
        roles: Array.isArray(roles) ? roles : [roles]
      };
      
      localStorage.setItem('token', authToken);
      localStorage.setItem('username', userData.username);
      localStorage.setItem('userRoles', JSON.stringify(userData.roles));
      
      setToken(authToken);
      setUser(userData);
      
      toast.success('Login successful!');
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/login', {
        usernameOrEmail: username,
        password: password
      });

      const { token: authToken, userId, username: responseUsername, email, firstName, lastName, roles } = response.data;
      
      // Create user object from response data
      const userData: User = {
        id: userId || 0,
        username: responseUsername,
        email,
        firstName,
        lastName,
        roles: Array.isArray(roles) ? roles : [roles]
      };
      
      if (!userData.roles.includes('ROLE_ADMIN')) {
        toast.error('Access denied. Admin privileges required.');
        return false;
      }
      
      localStorage.setItem('token', authToken);
      localStorage.setItem('username', userData.username);
      localStorage.setItem('userRoles', JSON.stringify(userData.roles));
      
      setToken(authToken);
      setUser(userData);
      
      toast.success('Admin login successful!');
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Admin login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      await api.post('/auth/register', userData);
      
      toast.success('Registration successful! Please login.');
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUser(null);
    toast.info('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    adminLogin,
    register,
    logout,
    isLoading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.roles?.includes('ROLE_ADMIN') ?? false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 