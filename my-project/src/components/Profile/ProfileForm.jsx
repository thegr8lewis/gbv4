// // src/components/Profile/ProfileForm.jsx
// import { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
// import Select from 'react-select';
// import api from '../../utils/api';

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

// export default function ProfileForm() {
//   const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
//   const [loading, setLoading] = useState(true);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedLanguages, setSelectedLanguages] = useState([]);
//   const [selectedGender, setSelectedGender] = useState(null);
//   const [profileData, setProfileData] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('auth_token');
//     const accountStatus = localStorage.getItem('account_status');
//     if (!token || accountStatus !== 'active') {
//       navigate('/login');
//     } else {
//       fetchProfile();
//     }
//   }, [navigate]);

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get('/profile/');
//       const data = response.data;
//       setProfileData(data);

//       setValue('username', data.username);
//       setValue('bio', data.bio);
//       setValue('specializations', data.specializations);
//       setValue('phoneNumber', data.phone_number);
//       setValue('licenseNumber', data.license_number);

//       if (data.languages && Array.isArray(data.languages)) {
//         const langs = languageOptions.filter((opt) =>
//           data.languages.includes(opt.value)
//         );
//         setSelectedLanguages(langs);
//       }

//       if (data.gender) {
//         const gender = genderOptions.find((opt) => opt.value === data.gender);
//         setSelectedGender(gender || null);
//       }
//     } catch (err) {
//       console.error('Error fetching profile:', err);
//       setError('Failed to load profile data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onSubmit = async (data) => {
//     setError(null);
//     setLoading(true);
//     try {
//       await api.put('/profile/', {
//         username: data.username,
//         gender: selectedGender?.value,
//         bio: data.bio,
//         specializations: data.specializations,
//         languages: selectedLanguages.map((lang) => lang.value),
//         phone_number: data.phoneNumber,
//         license_number: data.licenseNumber,
//       });

//       setProfileData({
//         ...profileData,
//         username: data.username,
//         gender: selectedGender?.value,
//         bio: data.bio,
//         specializations: data.specializations,
//         languages: selectedLanguages.map((lang) => lang.value),
//         phone_number: data.phoneNumber,
//         license_number: data.licenseNumber,
//       });

//       setSuccess(true);
//       setIsEditing(false);
//       setTimeout(() => setSuccess(false), 3000);
//     } catch (err) {
//       console.error('Error updating profile:', err);
//       setError(err.response?.data?.detail || 'An error occurred while saving');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     setError(null);
//     setSuccess(false);
//   };

//   if (loading) {
//     return <div className="text-center py-10">Loading profile...</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold">Profile Management</h2>
//         {!isEditing && (
//           <button
//             onClick={() => setIsEditing(true)}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             Update Profile
//           </button>
//         )}
//       </div>

//       {error && (
//         <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
//           Profile updated successfully!
//         </div>
//       )}

//       {!isEditing ? (
//         <div className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
//               <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">
//                 {profileData?.username || 'Not set'}
//               </p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
//               <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">
//                 {profileData?.gender || 'Not specified'}
//               </p>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
//             <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md border min-h-[100px]">
//               {profileData?.bio || 'No bio provided'}
//             </p>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Specializations</label>
//             <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">
//               {profileData?.specializations || 'No specializations listed'}
//             </p>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken</label>
//             <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">
//               {profileData?.languages && profileData.languages.length > 0
//                 ? profileData.languages.join(', ')
//                 : 'No languages specified'}
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
//               <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">
//                 {profileData?.phone_number || 'Not provided'}
//               </p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
//               <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">
//                 {profileData?.license_number || 'Not provided'}
//               </p>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Username*</label>
//               <input
//                 {...register('username', {
//                   required: 'Username is required',
//                   minLength: {
//                     value: 3,
//                     message: 'Username must be at least 3 characters',
//                   },
//                 })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="Choose a username"
//               />
//               {errors.username && (
//                 <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
//               <Select
//                 options={genderOptions}
//                 value={selectedGender}
//                 onChange={setSelectedGender}
//                 className="basic-single"
//                 classNamePrefix="select"
//                 placeholder="Select gender"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Bio (max 500 chars)
//             </label>
//             <textarea
//               {...register('bio', {
//                 maxLength: {
//                   value: 500,
//                   message: 'Bio cannot exceed 500 characters',
//                 },
//               })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               rows={4}
//               placeholder="Tell clients about yourself..."
//             />
//             {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
//             <p className="text-xs text-gray-500 mt-1">
//               {watch('bio')?.length || 0}/500 characters
//             </p>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Specializations
//             </label>
//             <input
//               {...register('specializations')}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Child Therapy, PTSD, Marriage Counseling (comma separated)"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Languages Spoken
//             </label>
//             <Select
//               isMulti
//               options={languageOptions}
//               value={selectedLanguages}
//               onChange={setSelectedLanguages}
//               className="basic-multi-select"
//               classNamePrefix="select"
//               placeholder="Select languages"
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Phone Number
//               </label>
//               <input
//                 {...register('phoneNumber', {
//                   pattern: {
//                     value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
//                     message: 'Please enter a valid phone number',
//                   },
//                 })}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="Optional phone number"
//               />
//               {errors.phoneNumber && (
//                 <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 License Number
//               </label>
//               <input
//                 {...register('licenseNumber')}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                 placeholder="Optional license number"
//               />
//             </div>
//           </div>

//           <div className="flex items-center justify-between">
//             <button
//               type="button"
//               onClick={handleCancelEdit}
//               className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               disabled={loading}
//             >
//               {loading ? 'Saving...' : 'Save Profile'}
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { User, Shield, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import api from '../../utils/api';

const languageOptions = [
  { value: 'English', label: 'English' },
  { value: 'Kiswahili', label: 'Kiswahili' },
  { value: 'French', label: 'French' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'Arabic', label: 'Arabic' },
];

const genderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Non-binary', label: 'Non-binary' },
  { value: 'Other', label: 'Other' },
];

export default function ProfileForm() {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedGender, setSelectedGender] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const accountStatus = localStorage.getItem('account_status');
    if (!token || accountStatus !== 'active') {
      navigate('/login');
    } else {
      fetchProfile();
    }
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/profile/');
      const data = response.data;
      setProfileData(data);

      setValue('username', data.username);
      setValue('bio', data.bio);
      setValue('specializations', data.specializations);
      setValue('phoneNumber', data.phone_number);
      setValue('licenseNumber', data.license_number);

      if (data.languages && Array.isArray(data.languages)) {
        const langs = languageOptions.filter((opt) =>
          data.languages.includes(opt.value)
        );
        setSelectedLanguages(langs);
      }

      if (data.gender) {
        const gender = genderOptions.find((opt) => opt.value === data.gender);
        setSelectedGender(gender || null);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setError(null);
    setLoading(true);
    try {
      await api.put('/profile/', {
        username: data.username,
        gender: selectedGender?.value,
        bio: data.bio,
        specializations: data.specializations,
        languages: selectedLanguages.map((lang) => lang.value),
        phone_number: data.phoneNumber,
        license_number: data.licenseNumber,
      });

      setProfileData({
        ...profileData,
        username: data.username,
        gender: selectedGender?.value,
        bio: data.bio,
        specializations: data.specializations,
        languages: selectedLanguages.map((lang) => lang.value),
        phone_number: data.phoneNumber,
        license_number: data.licenseNumber,
      });

      setSuccess(true);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.detail || 'Failed to save profile. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(false);
    // Reset form values to original data
    if (profileData) {
      setValue('username', profileData.username);
      setValue('bio', profileData.bio);
      setValue('specializations', profileData.specializations);
      setValue('phoneNumber', profileData.phone_number);
      setValue('licenseNumber', profileData.license_number);
      
      if (profileData.languages) {
        const langs = languageOptions.filter((opt) =>
          profileData.languages.includes(opt.value)
        );
        setSelectedLanguages(langs);
      }

      if (profileData.gender) {
        const gender = genderOptions.find((opt) => opt.value === profileData.gender);
        setSelectedGender(gender || null);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="text-center py-12">
          <div className="relative inline-block">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium text-sm sm:text-base">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="text-center">
          <div className="bg-white border border-red-200 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <XCircle className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <h2 className="text-red-800 font-bold text-lg sm:text-xl mb-1 sm:mb-2">
              Error Loading Profile
            </h2>
            <p className="text-red-600 mb-4 sm:mb-6 text-sm sm:text-base">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl hover:bg-red-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      <div className="flex items-center justify-between mb-4 sm:mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-1 sm:p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
        </button>
        <div className="text-center flex-1">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 flex items-center justify-center">
            <Shield className="h-5 w-5 sm:h-8 sm:w-8 mr-1 sm:mr-2 text-blue-600" />
            Profile Management
          </h1>
        </div>
        <div className="w-8 sm:w-10"></div>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
          <div>
            <h3 className="font-medium text-green-800">Profile updated successfully!</h3>
            <p className="text-green-600 text-sm">Your changes have been saved.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <XCircle className="h-5 w-5 text-red-600 mr-3" />
          <div>
            <h3 className="font-medium text-red-800">Error saving profile</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {!isEditing ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-6">
          <div className="flex items-start mb-6">
            <div className="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
                    {profileData?.username}
                  </h2>
                  {profileData?.gender && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full font-medium">
                      {profileData.gender}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium text-sm sm:text-base"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">About</h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed bg-gray-50 p-4 rounded-lg">
                {profileData?.bio || 'No bio provided'}
              </p>
            </div>

            {profileData?.specializations && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.specializations.split(',').map((spec, i) => (
                    <span
                      key={i}
                      className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium"
                    >
                      {spec.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profileData?.languages?.length > 0 && (
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.languages.map((lang, i) => (
                    <span
                      key={i}
                      className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Contact</h3>
                <div className="space-y-2">
                  {profileData?.phone_number && (
                    <div className="flex items-center space-x-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm sm:text-base">{profileData.phone_number}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Professional</h3>
                <div className="space-y-2">
                  {profileData?.license_number && (
                    <div className="flex items-center space-x-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm sm:text-base">{profileData.license_number}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username*</label>
                <input
                  {...register('username', {
                    required: 'Username is required',
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters',
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder="Choose a username"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <Select
                  options={genderOptions}
                  value={selectedGender}
                  onChange={setSelectedGender}
                  className="basic-single"
                  classNamePrefix="select"
                  placeholder="Select gender"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: '42px',
                      borderColor: '#e5e7eb',
                      '&:hover': {
                        borderColor: '#e5e7eb',
                      },
                    }),
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio (max 500 chars)
              </label>
              <textarea
                {...register('bio', {
                  maxLength: {
                    value: 500,
                    message: 'Bio cannot exceed 500 characters',
                  },
                })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                rows={4}
                placeholder="Tell clients about yourself..."
              />
              {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
              <p className="text-xs text-gray-500 mt-1">
                {watch('bio')?.length || 0}/500 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specializations
              </label>
              <input
                {...register('specializations')}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                placeholder="Child Therapy, PTSD, Marriage Counseling (comma separated)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages Spoken
              </label>
              <Select
                isMulti
                options={languageOptions}
                value={selectedLanguages}
                onChange={setSelectedLanguages}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select languages"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: '42px',
                    borderColor: '#e5e7eb',
                    '&:hover': {
                      borderColor: '#e5e7eb',
                    },
                  }),
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  {...register('phoneNumber', {
                    pattern: {
                      value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
                      message: 'Please enter a valid phone number',
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder="Optional phone number"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Number
                </label>
                <input
                  {...register('licenseNumber')}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder="Optional license number"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : 'Save Profile'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}