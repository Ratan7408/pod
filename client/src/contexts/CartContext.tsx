import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

interface CartItem {
  _id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  imageUrl?: string;
}

interface Cart {
  _id?: string;
  userId?: string;
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { itemId: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  fetchCart: () => Promise<void>;
  addToCart: (item: Omit<CartItem, '_id'>) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
} | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload, error: null };
    case 'ADD_ITEM':
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: [...state.cart.items, action.payload],
        },
      };
    case 'UPDATE_ITEM':
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.map(item =>
            item._id === action.payload.itemId
              ? { ...item, quantity: action.payload.quantity }
              : item
          ),
        },
      };
    case 'REMOVE_ITEM':
      if (!state.cart) return state;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.filter(item => item._id !== action.payload),
        },
      };
    case 'CLEAR_CART':
      if (!state.cart) return state;
      return {
        ...state,
        cart: { ...state.cart, items: [] },
      };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, {
    cart: null,
    loading: false,
    error: null,
  });

  const fetchCart = async () => {
    if (!user) {
      console.log('❌ No user found, skipping cart fetch');
      return;
    }
    
    console.log('🛒 Fetching cart for user:', user.email);
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      if (!token) {
        console.error('❌ No auth token found');
        throw new Error('Authentication token not found');
      }
      
      // Use dynamic API base URL
      const API_BASE = (() => {
        if (process.env.NODE_ENV === 'development') {
          return 'http://localhost:5000/api';
        }
        return 'https://your-aws-backend-url.com/api';
      })();
      
      console.log('🌐 Making request to:', `${API_BASE}/cart`);
      
      const response = await axios.get(`${API_BASE}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('✅ Cart fetch response:', response.data);
      
      if (response.data.success) {
        dispatch({ type: 'SET_CART', payload: response.data.data });
      } else {
        throw new Error(response.data.message || 'Failed to fetch cart');
      }
    } catch (error) {
      console.error('❌ Error fetching cart:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
      }
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to fetch cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = async (item: Omit<CartItem, '_id'>) => {
    if (!user) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      // Use dynamic API base URL
      const API_BASE = (() => {
        if (process.env.NODE_ENV === 'development') {
          return 'http://localhost:5000/api';
        }
        return 'https://your-aws-backend-url.com/api';
      })();
      
      const response = await axios.post(`${API_BASE}/cart/add`, item, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.data.success) {
        dispatch({ type: 'SET_CART', payload: response.data.data });
      } else {
        throw new Error(response.data.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to add item to cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    if (!user) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      // Use dynamic API base URL
      const API_BASE = (() => {
        if (process.env.NODE_ENV === 'development') {
          return 'http://localhost:5000/api';
        }
        return 'https://your-aws-backend-url.com/api';
      })();
      
      const response = await axios.put(`${API_BASE}/cart/update`, 
        { itemId, quantity },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.success) {
        dispatch({ type: 'SET_CART', payload: response.data.data });
      } else {
        throw new Error(response.data.message || 'Failed to update cart item');
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update cart item' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      // Use dynamic API base URL
      const API_BASE = (() => {
        if (process.env.NODE_ENV === 'development') {
          return 'http://localhost:5000/api';
        }
        return 'https://your-aws-backend-url.com/api';
      })();
      
      const response = await axios.delete(`${API_BASE}/cart/remove`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        data: { itemId },
      });
      
      if (response.data.success) {
        dispatch({ type: 'SET_CART', payload: response.data.data });
      } else {
        throw new Error(response.data.message || 'Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to remove item from cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearCart = async () => {
    if (!user) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      
      // Use dynamic API base URL
      const API_BASE = (() => {
        if (process.env.NODE_ENV === 'development') {
          return 'http://localhost:5000/api';
        }
        return 'https://your-aws-backend-url.com/api';
      })();
      
      const response = await axios.delete(`${API_BASE}/cart/clear`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.data.success) {
        dispatch({ type: 'SET_CART', payload: response.data.data });
      } else {
        throw new Error(response.data.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to clear cart' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      dispatch({ type: 'SET_CART', payload: { items: [], totalAmount: 0, itemCount: 0 } });
    }
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        state,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 