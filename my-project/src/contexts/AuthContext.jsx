
// src/context/AuthContext.jsx
import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // No token verification = no initial loading
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login/', { email, password });
      const { user_id, email: userEmail, is_staff, account_status } = response.data;

      if (account_status !== 'active') {
        throw new Error('Account is not active. Please contact support.');
      }

      setUser({
        id: user_id,
        email: userEmail,
        username: userEmail.split('@')[0],
        is_staff,
        account_status,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
