

// // src/components/Auth/Login.jsx
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://safespacekenya.onrender.com/api';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
//         email,
//         password,
//       });
//       console.log('Login response:', response.data); // Debug
//       const { token, user_id, email: userEmail, is_staff, account_status } = response.data;

//       if (account_status === 'suspended') {
//         setError('Your account is suspended. Please contact support.');
//         setLoading(false);
//         return;
//       }

//       localStorage.setItem('auth_token', token);
//       localStorage.setItem('user_id', user_id);
//       localStorage.setItem('user_email', userEmail);
//       localStorage.setItem('is_staff', is_staff);
//       localStorage.setItem('account_status', account_status);
//       console.log('localStorage after set:', {
//         auth_token: localStorage.getItem('auth_token'),
//         user_id: localStorage.getItem('user_id'),
//         user_email: localStorage.getItem('user_email'),
//         is_staff: localStorage.getItem('is_staff'),
//         account_status: localStorage.getItem('account_status'),
//       }); // Debug
//       navigate('/dashboard');
//     } catch (err) {
//       console.error('Login error:', err.response?.data); // Debug
//       setError(
//         err.response?.data?.detail || 'Login failed. Please check your credentials.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
//       <h2 className="text-2xl font-bold mb-6">Psychologist Login</h2>
//       {error && (
//         <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//           {error}
//         </div>
//       )}
//       <form onSubmit={handleLogin} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Enter your email"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Enter your password"
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           disabled={loading}
//         >
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//     </div>
//   );
// }
import { useState, useContext } from 'react';
import { AuthContext } from '/src/contexts/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      // navigation to /dashboard happens inside login function in AuthContext
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Psychologist Login</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
