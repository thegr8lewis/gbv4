// // LoginForm.jsx
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { EyeIcon, EyeOffIcon, Loader2 } from 'lucide-react';

// const LoginForm = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [loginError, setLoginError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Clear errors when user types
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//     if (loginError) setLoginError('');
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!emailRegex.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 0) {
//       newErrors.password = 'Password must be at least 8 characters';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
  
//     setIsLoading(true);
//     setLoginError('');
  
//     try {
//       const response = await axios.post('http://localhost:8000/api/login/', {
//         email: formData.email,
//         password: formData.password,
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       });
  
//       // Store token and user data
//       localStorage.setItem('auth_token', response.data.token);
//       localStorage.setItem('user_email', response.data.email);
//       localStorage.setItem('is_staff', response.data.is_staff);
  
//       // Redirect to dashboard
//       navigate('dashboard');
  
//     } catch (error) {
//       console.error('Login error:', error);
      
//       let errorMessage = 'Login failed. Please try again.';
//       if (error.response?.data?.detail) {
//         errorMessage = error.response.data.detail;
//       } else if (error.response?.status === 401) {
//         errorMessage = 'Invalid email or password';
//       }
      
//       setLoginError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        
//         <div className="p-6 sm:p-8">
//           <div className="text-center mb-6">
//             <h3 className="text-xl font-semibold text-gray-800">ADMIN PORTAL</h3>
//             <p className="text-gray-500 mt-1">Enter your credentials to continue</p>
//           </div>

//           {loginError && (
//             <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
//               <p>{loginError}</p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${
//                     errors.email 
//                       ? 'border-red-500 focus:ring-red-200' 
//                       : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
//                   }`}
//                   placeholder="your.email@example.com"
//                   disabled={isLoading}
//                 />
//               </div>
//               {errors.email && (
//                 <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
//               )}
//             </div>

//             <div>
//               <div className="flex justify-between mb-1">
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//               </div>
//               <div className="relative">
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   autoComplete="current-password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${
//                     errors.password 
//                       ? 'border-red-500 focus:ring-red-200' 
//                       : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
//                   }`}
//                   placeholder="••••••••"
//                   disabled={isLoading}
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
//                   disabled={isLoading}
//                 >
//                   {showPassword ? (
//                     <EyeOffIcon size={20} />
//                   ) : (
//                     <EyeIcon size={20} />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
//               )}
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className={`w-full flex justify-center items-center py-3 px-4 rounded-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
//                   isLoading
//                     ? 'bg-blue-400 cursor-not-allowed'
//                     : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
//                 }`}
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="animate-spin mr-2" size={18} />
//                     Signing in...
//                   </>
//                 ) : (
//                   'Sign in'
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginForm;


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie-player';
import psychologistLogin from '/src/assets/animations/psychologistLogin.json';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (loginError) setLoginError('');
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsLoading(true);
    setLoginError('');
  
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        email: formData.email,
        password: formData.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      // Store token and user data
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_email', response.data.email);
      localStorage.setItem('is_staff', response.data.is_staff);
  
      // Redirect to dashboard
      navigate('dashboard');
  
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please try again.';
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      }
      
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
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
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-gray-800">Admin Portal</h3>
            <p className="text-gray-500 mt-2">Enter your credentials to continue</p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg animate-fade-in">
              {loginError}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:outline-none transition-all duration-300 ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-200' 
                    : 'border-gray-200 focus:ring-indigo-500 focus:border-transparent'
                }`}
                placeholder="your.email@example.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:outline-none transition-all duration-300 ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-gray-200 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full px-4 py-3 bg-indigo-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                isLoading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'hover:bg-indigo-700 focus:ring-indigo-500'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
          <p className="mt-6 text-sm text-gray-600 text-center">
            Don't have an account?{' '}
            <a href="/register" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;