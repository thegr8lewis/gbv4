
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
      
//       console.log('Login response:', response.data);
      
//       const { token, user_id, email: userEmail, is_staff, account_status } = response.data;

//       // Handle missing account_status (default to 'active' if not provided)
//       const finalAccountStatus = account_status || 'active';

//       if (finalAccountStatus === 'suspended') {
//         setError('Your account is suspended. Please contact support.');
//         setLoading(false);
//         return;
//       }

//       // Store all auth data
//       localStorage.setItem('auth_token', token);
//       localStorage.setItem('user_id', user_id);
//       localStorage.setItem('user_email', userEmail);
//       localStorage.setItem('is_staff', is_staff);
//       localStorage.setItem('account_status', finalAccountStatus);
      
//       // Verify storage
//       console.log('Auth data stored:', {
//         auth_token: localStorage.getItem('auth_token'),
//         user_id: localStorage.getItem('user_id'),
//         user_email: localStorage.getItem('user_email'),
//         is_staff: localStorage.getItem('is_staff'),
//         account_status: localStorage.getItem('account_status'),
//       });

//       // Test the token immediately with a quick API call
//       try {
//         const testResponse = await axios.get(`${API_BASE_URL}/auth/me/`, {
//           headers: {
//             'Authorization': `Token ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });
//         console.log('Token validation successful:', testResponse.data);
//       } catch (testError) {
//         console.error('Token validation failed:', testError.response?.data);
//         // Try with Bearer format if Token fails
//         try {
//           const testResponse2 = await axios.get(`${API_BASE_URL}/auth/me/`, {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json',
//             },
//           });
//           console.log('Bearer token validation successful:', testResponse2.data);
//         } catch (testError2) {
//           console.error('Bearer token validation also failed:', testError2.response?.data);
//         }
//       }

//       // Navigate to dashboard
//       navigate('/dashboard');
      
//     } catch (err) {
//       console.error('Login error:', err.response?.data);
//       console.error('Full error object:', err);
      
//       setError(
//         err.response?.data?.detail || 
//         err.response?.data?.message || 
//         'Login failed. Please check your credentials.'
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
//           className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//           disabled={loading}
//         >
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//     </div>
//   );
// }



import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Lottie from 'react-lottie-player';
import psychologistLogin from '/src/assets/animations/psychologistLogin.json';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://safespacekenya.onrender.com/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
        email,
        password,
      });
      
      console.log('Login response:', response.data);
      
      const { token, user_id, email: userEmail, is_staff, account_status } = response.data;

      const finalAccountStatus = account_status || 'active';

      if (finalAccountStatus === 'suspended') {
        setError('Your account is suspended. Please contact support.');
        setLoading(false);
        return;
      }

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('user_email', userEmail);
      localStorage.setItem('is_staff', is_staff);
      localStorage.setItem('account_status', finalAccountStatus);
      
      console.log('Auth data stored:', {
        auth_token: localStorage.getItem('auth_token'),
        user_id: localStorage.getItem('user_id'),
        user_email: localStorage.getItem('user_email'),
        is_staff: localStorage.getItem('is_staff'),
        account_status: localStorage.getItem('account_status'),
      });

      try {
        const testResponse = await axios.get(`${API_BASE_URL}/auth/me/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('Token validation successful:', testResponse.data);
      } catch (testError) {
        console.error('Token validation failed:', testError.response?.data);
        try {
          const testResponse2 = await axios.get(`${API_BASE_URL}/auth/me/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          console.log('Bearer token validation successful:', testResponse2.data);
        } catch (testError2) {
          console.error('Bearer token validation also failed:', testError2.response?.data);
        }
      }

      navigate('/dashboard');
      
    } catch (err) {
      console.error('Login error:', err.response?.data);
      console.error('Full error object:', err);
      
      setError(
        err.response?.data?.detail || 
        err.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl flex overflow-hidden">
        <div className="w-1/2 p-8 hidden md:block">
          <Lottie
            loop
            animationData={psychologistLogin}
            play
            className="w-full h-full object-contain"
          />
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Psychologist Login</h2>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg animate-fade-in">
              {error}
            </div>
          )}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogin}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </div>
          <p className="mt-6 text-sm text-gray-600 text-center">
            Don't have an account?{' '}
            <a href="/dashboard/register" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}