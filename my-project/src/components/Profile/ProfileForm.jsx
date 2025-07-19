import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { auth } from '/src/firebase';
import {  API_BASE_URL } from './apiConfig';

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

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const token = await user.getIdToken();
          const response = await fetch(`${API_BASE_URL}/profile/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          setProfileData(data);
          
          // Set form values
          setValue('username', data.username);
          setValue('bio', data.bio);
          setValue('specializations', data.specializations);
          setValue('phoneNumber', data.phone_number);
          setValue('licenseNumber', data.license_number);
          
          if (data.languages && Array.isArray(data.languages)) {
            const langs = languageOptions.filter(opt => 
              data.languages.includes(opt.value)
            );
            setSelectedLanguages(langs);
          }
          
          if (data.gender) {
            const gender = genderOptions.find(opt => opt.value === data.gender);
            setSelectedGender(gender || null);
          }
        } catch (err) {
          console.error("Error fetching profile: ", err);
          setError("Failed to load profile data");
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchProfile();
  }, [setValue]);

  const onSubmit = async (data) => {
    setError(null);
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/profile/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: data.username,
            gender: selectedGender?.value,
            bio: data.bio,
            specializations: data.specializations,
            languages: selectedLanguages.map(lang => lang.value),
            phone_number: data.phoneNumber,
            license_number: data.licenseNumber
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to update profile');
        }
        
        // Update local profile data
        const updatedData = {
          ...profileData,
          username: data.username,
          gender: selectedGender?.value,
          bio: data.bio,
          specializations: data.specializations,
          languages: selectedLanguages.map(lang => lang.value),
          phone_number: data.phoneNumber,
          license_number: data.licenseNumber
        };
        setProfileData(updatedData);
        
        setSuccess(true);
        setIsEditing(false);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error updating profile: ", err);
      setError(err.message || "An error occurred while saving");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(false);
  };

  if (loading) return <div className="text-center py-10">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Profile Management</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Profile
          </button>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Profile updated successfully!
        </div>
      )}

      {!isEditing ? (
        // Profile Display View
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">
                {profileData?.username || 'Not set'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">
                {profileData?.gender || 'Not specified'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md border min-h-[100px]">
              {profileData?.bio || 'No bio provided'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specializations</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">
              {profileData?.specializations || 'No specializations listed'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken</label>
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">
              {profileData?.languages && profileData.languages.length > 0 
                ? profileData.languages.join(', ') 
                : 'No languages specified'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">
                {profileData?.phone_number || 'Not provided'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md border">
                {profileData?.license_number || 'Not provided'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Profile Edit Form
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username*</label>
              <input
                {...register('username', { 
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters'
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Choose a username"
              />
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <Select
                options={genderOptions}
                value={selectedGender}
                onChange={setSelectedGender}
                className="basic-single"
                classNamePrefix="select"
                placeholder="Select gender"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio (max 500 chars)</label>
            <textarea
              {...register('bio', { 
                maxLength: {
                  value: 500,
                  message: 'Bio cannot exceed 500 characters'
                } 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              rows={4}
              placeholder="Tell clients about yourself..."
            />
            {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
            <p className="text-xs text-gray-500 mt-1">
              {watch('bio')?.length || 0}/500 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specializations</label>
            <input
              {...register('specializations')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Child Therapy, PTSD, Marriage Counseling (comma separated)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken</label>
            <Select
              isMulti
              options={languageOptions}
              value={selectedLanguages}
              onChange={setSelectedLanguages}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Select languages"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                {...register('phoneNumber', {
                  pattern: {
                    value: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
                    message: 'Please enter a valid phone number'
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Optional phone number"
              />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
              <input
                {...register('licenseNumber')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Optional license number"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}