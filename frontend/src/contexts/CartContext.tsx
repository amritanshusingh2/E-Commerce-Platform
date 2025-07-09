import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

interface CartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token, isAuthenticated } = useAuth();

  const API_BASE_URL = 'http://localhost:8020';

  useEffect(() => {
    if (isAuthenticated && token) {
      refreshCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, token]);

  const refreshCart = async () => {
    if (!isAuthenticated || !token) return;

    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/cart/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart items');
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`${API_BASE_URL}/cart/add`, {
        productId,
        quantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await refreshCart();
      toast.success('Item added to cart!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      setIsLoading(true);
      await axios.delete(`${API_BASE_URL}/cart/remove/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await refreshCart();
      toast.success('Item removed from cart');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    try {
      setIsLoading(true);
      await axios.put(`${API_BASE_URL}/cart/update/${cartItemId}?quantity=${quantity}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await refreshCart();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`${API_BASE_URL}/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCartItems([]);
      toast.success('Cart cleared');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };

  const getCartTotal = (): number => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = (): number => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isLoading,
    refreshCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 