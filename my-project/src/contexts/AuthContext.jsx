
// // src/context/AuthContext.jsx
// import { createContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../utils/api';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false); // No token verification = no initial loading
//   const navigate = useNavigate();

//   const login = async (email, password) => {
//     try {
//       const response = await api.post('/auth/login/', { email, password });
//       const { user_id, email: userEmail, is_staff, account_status } = response.data;

//       if (account_status !== 'active') {
//         throw new Error('Account is not active. Please contact support.');
//       }

//       setUser({
//         id: user_id,
//         email: userEmail,
//         username: userEmail.split('@')[0],
//         is_staff,
//         account_status,
//       });

//       navigate('/dashboard');
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await api.post('/auth/logout/');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading while checking localStorage
  const navigate = useNavigate();

  // Hydrate user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const user_id = localStorage.getItem('user_id');
    const user_email = localStorage.getItem('user_email');
    const is_staff = localStorage.getItem('is_staff');
    const account_status = localStorage.getItem('account_status');

    if (token) {
      setUser({
        id: user_id,
        email: user_email,
        username: user_email.split('@')[0],
        is_staff,
        account_status,
      });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login/', { email, password });
      const { token, user_id, email: userEmail, is_staff, account_status } = response.data;

      // Removed account_status check here

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('user_email', userEmail);
      localStorage.setItem('is_staff', is_staff);
      localStorage.setItem('account_status', account_status);

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
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
