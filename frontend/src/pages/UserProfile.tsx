import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEdit, FaSave, FaTimes, FaKey } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const ProfileContainer = styled.div`
  padding: 2rem 0;
  background: #f8f9fa;
  min-height: 80vh;
`;

const ProfileContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
`;

const ProfileTitle = styled.h1`
  font-size: 3rem;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

const ProfileTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 12px 24px;
  background: ${props => props.$active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
  color: ${props => props.$active ? 'white' : '#333'};
  border: 2px solid ${props => props.$active ? 'transparent' : '#e1e5e9'};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
  }
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f8f9fa;

  .avatar {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2rem;
  }

  .user-info {
    flex: 1;

    h2 {
      color: #333;
      margin-bottom: 0.5rem;
    }

    p {
      color: #666;
      margin: 0;
    }
  }
`;

const FormSection = styled.div`
  margin-bottom: 2rem;

  h3 {
    color: #333;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-bottom: 2px solid #667eea;
    padding-bottom: 0.5rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 600;
  }

  input, textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    &:disabled {
      background: #f8f9fa;
      cursor: not-allowed;
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  background: ${props => {
    switch (props.$variant) {
      case 'primary': return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'secondary': return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      case 'danger': return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
      default: return '#e9ecef';
    }
  }};
  color: ${props => props.$variant === 'danger' ? '#333' : 'white'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ForgotPasswordForm = styled.div`
  background:rgb(23, 70, 116);
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid #e9ecef;
  margin-top: 1rem;

  h4 {
    color: #333;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    color: #666;
    margin-bottom: 1rem;
    font-size: 14px;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: #667eea;
  font-weight: 600;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  svg {
    font-size: 4rem;
    color: #667eea;
    margin-bottom: 1rem;
  }

  h2 {
    color: #333;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    margin-bottom: 2rem;
  }
`;

const UserProfile: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'forgot'>('profile');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    resetToken: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showResetForm, setShowResetForm] = useState(false);
  const { user, token, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:8020';

  useEffect(() => {
    if (isAuthenticated && user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        username: user.username || ''
      });
    }
  }, [isAuthenticated, user]);



  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'forgot' || tab === 'password' || tab === 'profile') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      await axios.put(`${API_BASE_URL}/auth/profile/${user?.username}`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      // Note: This endpoint might need to be implemented in the backend
      await axios.post(`${API_BASE_URL}/auth/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password?email=${forgotPasswordData.email}`);
      toast.success('Password reset instructions sent to your email');
      setShowResetForm(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (forgotPasswordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/auth/reset-password?resetToken=${encodeURIComponent(forgotPasswordData.resetToken)}&newPassword=${encodeURIComponent(forgotPasswordData.newPassword)}`);
      toast.success('Password reset successfully. Please login with your new password.');
      setForgotPasswordData({
        email: '',
        resetToken: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowResetForm(false);
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <ProfileContainer>
        <ProfileContent>
          <EmptyState>
            <FaUser />
            <h2>Please Login</h2>
            <p>You need to be logged in to view your profile.</p>
            <ActionButton $variant="primary" onClick={() => navigate('/login')}>
              Login
            </ActionButton>
          </EmptyState>
        </ProfileContent>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileContent>
        <ProfileTitle>{isAdmin ? 'Admin Profile' : 'User Profile'}</ProfileTitle>

        <ProfileTabs>
          <TabButton $active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
            <FaUser /> Profile
          </TabButton>
          <TabButton $active={activeTab === 'password'} onClick={() => setActiveTab('password')}>
            <FaLock /> Change Password
          </TabButton>
        </ProfileTabs>

        {activeTab === 'profile' && (
          <ProfileCard>
            <ProfileHeader>
              <div className="avatar">
                <FaUser />
              </div>
              <div className="user-info">
                <h2>{user?.firstName} {user?.lastName}</h2>
                <p>{user?.email}</p>
                <p>Username: {user?.username}</p>
              </div>
            </ProfileHeader>

            <FormSection>
              <h3><FaUser /> Personal Information</h3>
              <FormGrid>
                <FormGroup>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    disabled={!editing}
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    disabled={!editing}
                  />
                </FormGroup>
              </FormGrid>
              <FormGroup>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  disabled={!editing}
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  value={profileData.username}
                  disabled
                />
              </FormGroup>

              <ButtonGroup>
                {editing ? (
                  <>
                    <ActionButton $variant="primary" onClick={handleProfileUpdate} disabled={loading}>
                      <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                    </ActionButton>
                    <ActionButton $variant="secondary" onClick={() => setEditing(false)}>
                      <FaTimes /> Cancel
                    </ActionButton>
                  </>
                ) : (
                  <ActionButton $variant="primary" onClick={() => setEditing(true)}>
                    <FaEdit /> Edit Profile
                  </ActionButton>
                )}
              </ButtonGroup>
            </FormSection>
          </ProfileCard>
        )}

        {activeTab === 'password' && (
          <ProfileCard>
            <FormSection>
              <h3><FaLock /> Change Password</h3>
              <FormGroup>
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  placeholder="Enter your current password"
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder="Enter your new password"
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder="Confirm your new password"
                />
              </FormGroup>

              <ActionButton $variant="primary" onClick={handlePasswordChange} disabled={loading}>
                <FaLock /> {loading ? 'Changing...' : 'Change Password'}
              </ActionButton>
            </FormSection>
          </ProfileCard>
        )}

        <ProfileCard>
          <FormSection>
            <h3>Account Actions</h3>
            <ButtonGroup>
              <ActionButton $variant="danger" onClick={handleLogout}>
                Logout
              </ActionButton>
            </ButtonGroup>
          </FormSection>
        </ProfileCard>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default UserProfile; 