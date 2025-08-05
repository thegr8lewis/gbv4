// // src/components/Auth/Register.jsx
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Select from 'react-select';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://safespacekenya.onrender.com/api';

// const languageOptions = [
//   { value: 'English', label: 'English' },
//   { value: 'Kiswahili', label: 'Kiswahili' },
//   { value: 'French', label: 'French' },
//   { value: 'Spanish', label: 'Spanish' },
//   { value: 'Arabic', label: 'Arabic' },
// ];

// const genderOptions = [
//   { value: 'Male', label: 'Male' },
//   { value: 'Female', label: 'Female' },
//   { value: 'Non-binary', label: 'Non-binary' },
//   { value: 'Other', label: 'Other' },
// ];

// export default function Register() {
//   const [formData, setFormData] = useState({
//     email: '',
//     username: '',
//     password: '',
//     gender: null,
//     bio: '',
//     specializations: '',
//     languages: [],
//     phoneNumber: '',
//     licenseNumber: '',
//   });
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleGenderChange = (selectedOption) => {
//     setFormData((prev) => ({ ...prev, gender: selectedOption }));
//   };

//   const handleLanguagesChange = (selectedOptions) => {
//     setFormData((prev) => ({ ...prev, languages: selectedOptions }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       const response = await axios.post(`${API_BASE_URL}/auth/register/`, {
//         email: formData.email,
//         username: formData.username,
//         password: formData.password,
//         gender: formData.gender?.value || '',
//         bio: formData.bio,
//         specializations: formData.specializations,
//         languages: formData.languages.map((lang) => lang.value),
//         phone_number: formData.phoneNumber,
//         license_number: formData.licenseNumber,
//       });

//       const { token, user_id, email, is_staff, account_status } = response.data;

//       if (account_status === 'suspended') {
//         setError('Your account is suspended. Please contact support.');
//         setLoading(false);
//         return;
//       }

//       localStorage.setItem('auth_token', token);
//       localStorage.setItem('user_id', user_id);
//       localStorage.setItem('user_email', email);
//       localStorage.setItem('is_staff', is_staff);
//       localStorage.setItem('account_status', account_status);

//       navigate('/dashboard');
//     } catch (err) {
//       console.error('Registration error:', err);
//       setError(
//         err.response?.data?.non_field_errors?.[0] ||
//         err.response?.data?.email?.[0] ||
//         err.response?.data?.username?.[0] ||
//         'Registration failed. Please check your input.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
//       <h2 className="text-2xl font-bold mb-6">Psychologist Registration</h2>
//       {error && (
//         <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
//           {error}
//         </div>
//       )}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Enter your email"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Username*</label>
//           <input
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Choose a username"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Enter your password"
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
//           <Select
//             options={genderOptions}
//             value={formData.gender}
//             onChange={handleGenderChange}
//             className="basic-single"
//             classNamePrefix="select"
//             placeholder="Select gender"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Bio (max 500 chars)</label>
//           <textarea
//             name="bio"
//             value={formData.bio}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             rows={4}
//             placeholder="Tell clients about yourself..."
//             maxLength={500}
//           />
//           <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500 characters</p>
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Specializations</label>
//           <input
//             type="text"
//             name="specializations"
//             value={formData.specializations}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Child Therapy, PTSD, Marriage Counseling (comma separated)"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken</label>
//           <Select
//             isMulti
//             options={languageOptions}
//             value={formData.languages}
//             onChange={handleLanguagesChange}
//             className="basic-multi-select"
//             classNamePrefix="select"
//             placeholder="Select languages"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//           <input
//             type="tel"
//             name="phoneNumber"
//             value={formData.phoneNumber}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Optional phone number"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
//           <input
//             type="text"
//             name="licenseNumber"
//             value={formData.licenseNumber}
//             onChange={handleChange}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             placeholder="Optional license number"
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           disabled={loading}
//         >
//           {loading ? 'Registering...' : 'Register'}
//         </button>
//       </form>
//       <p className="mt-4 text-sm text-gray-600 text-center">
//         Already have an account?{' '}
//         <a href="/login" className="text-indigo-600 hover:underline">
//           Log in
//         </a>
//       </p>
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

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register/`, {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });

      const { token, user_id, email, is_staff, account_status } = response.data;

      if (account_status === 'suspended') {
        setError('Your account is suspended. Please contact support.');
        setLoading(false);
        return;
      }

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('user_email', email);
      localStorage.setItem('is_staff', is_staff);
      localStorage.setItem('account_status', account_status);

      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.username?.[0] ||
        'Registration failed. Please check your input.'
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
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Psychologist Registration</h2>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg animate-fade-in">
              {error}
            </div>
          )}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username*</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                placeholder="Choose a username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password*</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password*</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Registering...
                </div>
              ) : (
                'Register'
              )}
            </button>
          </div>
          <p className="mt-6 text-sm text-gray-600 text-center">
            Already have an account?{' '}
            <a href="/dashboard/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}