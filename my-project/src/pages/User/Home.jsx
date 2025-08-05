// import { AlertTriangle, Phone, ArrowRight, Info, Bell, Shield, Heart, Users, Lock, CheckCircle, Star } from 'lucide-react';
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {  API_BASE_URL } from './apiConfig';

// export default function HomeScreen({ isLoggedIn }) {
//   const [latestUpdates, setLatestUpdates] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchLatestUpdates = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/public/updates/?ordering=-created_at`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch updates');
//         }
//         const data = await response.json();
//         setLatestUpdates(data.slice(0, 3));
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchLatestUpdates();
//   }, []);

//   const formatDate = (dateString) => {
//     const options = { day: 'numeric', month: 'short', year: 'numeric' };
//     return new Date(dateString).toLocaleDateString('en-US', options);
//   };

//   return (
//     <div className="max-w-4xl mx-auto px-2 sm:px-6 py-0 sm:py-0 gap-6">

//       {/* Hero Section */}
//       <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-xl p-6 sm:p-8 text-white shadow-lg mb-6 sm:mb-8 relative overflow-hidden">
//         <div className="absolute inset-0 bg-blue-500 opacity-10 rounded-full scale-150 translate-x-1/2 -translate-y-1/4"></div>
//         <div className="relative z-10">
//           <div className="flex items-center mb-3 sm:mb-4">
//             <div className="bg-white/20 p-2 sm:p-3 rounded-full">
//               <Shield size={20} className="text-white" />
//             </div>
//             <h2 className="text-xl sm:text-2xl font-bold ml-3">Your Safety is Our Priority</h2>
//           </div>
//           <p className="text-base sm:text-lg mb-4 sm:mb-6 opacity-90">
//             SafeSpace provides a secure platform to report and address sexual and gender-based violence. 
//             Every report is handled with complete confidentiality and compassion.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-3">
//             <button 
//               onClick={() => navigate('/report')}
//               className="bg-white text-blue-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
//             >
//               <Shield size={16} />
//               <span>{isLoggedIn ? 'Report an Incident' : 'Learn How to Report'}</span>
//               <ArrowRight size={16} />
//             </button>
//             <button 
//               onClick={() => navigate('/about')}
//               className="bg-white/10 text-white border border-white/30 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-white/20 transition duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
//             >
//               <Info size={16} />
//               <span>Learn About SGBV</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Trust Indicators */}
//       <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
//         <div className="flex items-center mb-4 sm:mb-5">
//           <div className="bg-green-50 p-2 sm:p-3 rounded-full">
//             <CheckCircle size={20} className="text-green-700" />
//           </div>
//           <h3 className="text-lg sm:text-xl font-semibold ml-3">Why Choose SafeSpace?</h3>
//         </div>
        
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
//           <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center mb-2 sm:mb-3">
//               <div className="bg-blue-200 p-1.5 sm:p-2 rounded-full">
//                 <Lock size={16} className="text-blue-700" />
//               </div>
//               <h4 className="font-medium ml-2 sm:ml-3 text-blue-800 text-sm sm:text-base">100% Confidential</h4>
//             </div>
//             <p className="text-gray-700 text-xs sm:text-sm">Your identity and information are protected with the highest security standards.</p>
//           </div>
          
//           <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center mb-2 sm:mb-3">
//               <div className="bg-green-200 p-1.5 sm:p-2 rounded-full">
//                 <Heart size={16} className="text-green-700" />
//               </div>
//               <h4 className="font-medium ml-2 sm:ml-3 text-green-800 text-sm sm:text-base">Compassionate Support</h4>
//             </div>
//             <p className="text-gray-700 text-xs sm:text-sm">Our trained professionals provide empathetic support throughout your journey.</p>
//           </div>
          
//           <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center mb-2 sm:mb-3">
//               <div className="bg-purple-200 p-1.5 sm:p-2 rounded-full">
//                 <Users size={16} className="text-purple-700" />
//               </div>
//               <h4 className="font-medium ml-2 sm:ml-3 text-purple-800 text-sm sm:text-base">Community Focused</h4>
//             </div>
//             <p className="text-gray-700 text-xs sm:text-sm">Together, we're building a safer environment for everyone in our community.</p>
//           </div>
//         </div>

//         {/* New Psychologist Support Section */}
//         <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-indigo-100">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
//             <div className="flex items-start mb-4 sm:mb-0">
//               <div className="bg-indigo-100 p-2 sm:p-3 rounded-full mr-3">
//                 <Heart size={20} className="text-indigo-700" />
//               </div>
//               <div>
//                 <h3 className="text-lg sm:text-xl font-semibold text-indigo-800">Professional Psychological Support</h3>
//                 <p className="text-gray-600 text-sm sm:text-base mt-1">
//                   Connect with licensed psychologists specializing in trauma and recovery.
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={() => navigate('/psychologists')}
//               className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors flex items-center justify-center text-sm sm:text-base"
//             >
//               <Users size={16} className="mr-2" />
//               Book Psychologist
//             </button>
//           </div>
//         </div>
//       </div>


//        {/* Latest Updates Section */}
//       <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-xl font-semibold text-gray-900">Recent Updates</h3>
//           <button 
//             onClick={() => navigate('/updates')}
//             className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors flex items-center"
//           >
//             <ArrowRight size={8} className="mr-2" />
//             View All Updates
//           </button>
//         </div>
                
//         {isLoading ? (
//           <div className="space-y-4">
//             {[...Array(3)].map((_, i) => (
//               <div key={i} className="bg-gray-50 p-4 rounded-lg animate-pulse">
//                 <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
//                 <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//               </div>
//             ))}
//           </div>
//         ) : error ? (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//             <div className="flex items-center text-red-700">
//               <span className="text-sm font-medium">Unable to load updates</span>
//             </div>
//             <p className="text-red-600 text-sm mt-1">{error}</p>
//           </div>
//         ) : latestUpdates.length > 0 ? (
//           <div className="space-y-3">
//             {latestUpdates.map((update) => (
//               <div key={update.id} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors border-l-4 ">
//                 <div className="flex justify-between items-start">
//                   <div className="flex-1">
//                     <h4 className="font-sm text-gray-500 mb-1 leading-tight">{update.title}</h4>
//                     <p className="text-sm text-gray-500">{formatDate(update.created_at)}</p>
//                   </div>
//                   <button
//                     onClick={() => navigate('/updates')}
//                     className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors flex items-center ml-4 flex-shrink-0"
//                   >
//                     <ArrowRight size={8} className="mr-1" />
//                     Read More
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="bg-gray-50 p-8 rounded-lg text-center">
//             <h4 className="text-gray-700 font-medium mb-1">No Updates Available</h4>
//             <p className="text-gray-500 text-sm">Check back later for the latest information and announcements.</p>
//           </div>
//         )}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//           <div className="flex items-center mb-4">
//             <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mr-3">
//               <Phone size={20} className="text-red-600" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900">Emergency Protocols</h3>
//           </div>
//           <p className="text-gray-600 mb-6">
//             Immediate crisis intervention and safety planning with trained responders.
//           </p>
//           <div className="space-y-4">
//             <div className="flex items-start">
//               <span className="text-red-500 font-medium mr-3">24/7</span>
//               <div>
//                 <h4 className="font-medium text-gray-900">Crisis Hotline</h4>
//                 <p className="text-sm text-gray-600">Immediate support from trained specialists</p>
//               </div>
//             </div>
//             <div className="flex items-start">
//               <span className="text-red-500 font-medium mr-3">1hr</span>
//               <div>
//                 <h4 className="font-medium text-gray-900">Response Guarantee</h4>
//                 <p className="text-sm text-gray-600">Critical situations prioritized</p>
//               </div>
//             </div>
//           </div>
//           <button 
//             onClick={() => navigate('/emergency')}
//             className="mt-6 w-full text-white bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium transition-colors"
//           >
//             Access Emergency Resources
//           </button>
//         </div>

//         <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//           <div className="flex items-center mb-4">
//             <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
//               <Info size={20} className="text-blue-600" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900">Resource Center</h3>
//           </div>
//           <p className="text-gray-600 mb-6">
//             Evidence-based materials on prevention, recovery, and legal rights.
//           </p>
//           <div className="grid grid-cols-2 gap-4 mb-6">
//             <div className="bg-blue-50 p-3 rounded-lg">
//               <h4 className="font-medium text-blue-800 text-sm">Legal Guidance</h4>
//             </div>
//             <div className="bg-blue-50 p-3 rounded-lg">
//               <h4 className="font-medium text-blue-800 text-sm">Recovery Plans</h4>
//             </div>
//             <div className="bg-blue-50 p-3 rounded-lg">
//               <h4 className="font-medium text-blue-800 text-sm">Prevention Tools</h4>
//             </div>
//             <div className="bg-blue-50 p-3 rounded-lg">
//               <h4 className="font-medium text-blue-800 text-sm">Support Networks</h4>
//             </div>
//           </div>
//           <button 
//             onClick={() => navigate('/about')}
//             className="w-full text-blue-700 border border-blue-300 hover:bg-blue-50 py-3 rounded-lg font-medium"
//           >
//             Explore Educational Materials
//           </button>
//         </div>
//       </div>
      

//       {/* Support Message */}
//       <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl mt-6 sm:mt-8 border border-green-100">
//         <div className="text-center ">
//           <div className="bg-green-100 p-2 sm:p-3 rounded-full w-fit mx-auto mb-3 sm:mb-4">
//             <Heart size={20} className="text-green-700" />
//           </div>
//           <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">Remember: You Are Not Alone</h3>
//           <p className="text-gray-600 text-xs sm:text-sm">
//             Our community is here to support you every step of the way. Your courage in speaking up helps create a safer environment for everyone.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { AlertTriangle, Phone, ArrowRight, Info, Bell, Shield, Heart, Users, Lock, CheckCircle, Star } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {  API_BASE_URL } from './apiConfig';

// Cache object to store updates data
const updatesCache = {
  data: null,
  timestamp: null,
  isValid: function(maxAge = 5 * 60 * 1000) { // Default 5 minutes
    return this.data && this.timestamp && (Date.now() - this.timestamp < maxAge);
  },
  set: function(data) {
    this.data = data;
    this.timestamp = Date.now();
  },
  get: function() {
    return this.data;
  },
  clear: function() {
    this.data = null;
    this.timestamp = null;
  }
};

export default function HomeScreen({ isLoggedIn }) {
  const [latestUpdates, setLatestUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  const REFRESH_INTERVAL = 2 * 60 * 1000; // Check every 2 minutes

  const fetchLatestUpdates = async (skipCache = false) => {
    try {
      // Check cache first if not skipping cache
      if (!skipCache && updatesCache.isValid(CACHE_DURATION)) {
        setLatestUpdates(updatesCache.get());
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/public/updates/?ordering=-created_at`);
      if (!response.ok) {
        throw new Error('Failed to fetch updates');
      }
      const data = await response.json();
      const updates = data.slice(0, 3);
      
      // Update cache
      updatesCache.set(updates);
      setLatestUpdates(updates);
      setError(null);
    } catch (err) {
      setError(err.message);
      // If we have cached data and there's an error, use cached data
      if (updatesCache.data) {
        setLatestUpdates(updatesCache.get());
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchLatestUpdates();

    // Set up interval to periodically check for updates
    intervalRef.current = setInterval(() => {
      fetchLatestUpdates(true); // Skip cache to get fresh data
    }, REFRESH_INTERVAL);

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Clear cache when component unmounts (optional)
  useEffect(() => {
    return () => {
      // Uncomment the line below if you want to clear cache on unmount
      // updatesCache.clear();
    };
  }, []);

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-6 py-0 sm:py-0 gap-6">

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-xl p-6 sm:p-8 text-white shadow-lg mb-6 sm:mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500 opacity-10 rounded-full scale-150 translate-x-1/2 -translate-y-1/4"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="bg-white/20 p-2 sm:p-3 rounded-full">
              <Shield size={20} className="text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold ml-3">Your Safety is Our Priority</h2>
          </div>
          <p className="text-base sm:text-lg mb-4 sm:mb-6 opacity-90">
            SafeSpace provides a secure platform to report and address sexual and gender-based violence. 
            Every report is handled with complete confidentiality and compassion.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => navigate('/report')}
              className="bg-white text-blue-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <Shield size={16} />
              <span>{isLoggedIn ? 'Report an Incident' : 'Learn How to Report'}</span>
              <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="bg-white/10 text-white border border-white/30 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-white/20 transition duration-300 flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <Info size={16} />
              <span>Learn About SGBV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center mb-4 sm:mb-5">
          <div className="bg-green-50 p-2 sm:p-3 rounded-full">
            <CheckCircle size={20} className="text-green-700" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold ml-3">Why Choose SafeSpace?</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2 sm:mb-3">
              <div className="bg-blue-200 p-1.5 sm:p-2 rounded-full">
                <Lock size={16} className="text-blue-700" />
              </div>
              <h4 className="font-medium ml-2 sm:ml-3 text-blue-800 text-sm sm:text-base">100% Confidential</h4>
            </div>
            <p className="text-gray-700 text-xs sm:text-sm">Your identity and information are protected with the highest security standards.</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2 sm:mb-3">
              <div className="bg-green-200 p-1.5 sm:p-2 rounded-full">
                <Heart size={16} className="text-green-700" />
              </div>
              <h4 className="font-medium ml-2 sm:ml-3 text-green-800 text-sm sm:text-base">Compassionate Support</h4>
            </div>
            <p className="text-gray-700 text-xs sm:text-sm">Our trained professionals provide empathetic support throughout your journey.</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-2 sm:mb-3">
              <div className="bg-purple-200 p-1.5 sm:p-2 rounded-full">
                <Users size={16} className="text-purple-700" />
              </div>
              <h4 className="font-medium ml-2 sm:ml-3 text-purple-800 text-sm sm:text-base">Community Focused</h4>
            </div>
            <p className="text-gray-700 text-xs sm:text-sm">Together, we're building a safer environment for everyone in our community.</p>
          </div>
        </div>

        {/* New Psychologist Support Section */}
        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-indigo-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-start mb-4 sm:mb-0">
              <div className="bg-indigo-100 p-2 sm:p-3 rounded-full mr-3">
                <Heart size={20} className="text-indigo-700" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-indigo-800">Professional Psychological Support</h3>
                <p className="text-gray-600 text-sm sm:text-base mt-1">
                  Connect with licensed psychologists specializing in trauma and recovery.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/psychologists')}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors flex items-center justify-center text-sm sm:text-base"
            >
              <Users size={16} className="mr-2" />
              Book Psychologist
            </button>
          </div>
        </div>
      </div>


       {/* Latest Updates Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Recent Updates</h3>
          <button 
            onClick={() => navigate('/updates')}
            className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors flex items-center"
          >
            <ArrowRight size={8} className="mr-2" />
            View All Updates
          </button>
        </div>
                
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-lg animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center text-red-700">
              <span className="text-sm font-medium">Unable to load updates</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        ) : latestUpdates.length > 0 ? (
          <div className="space-y-3">
            {latestUpdates.map((update) => (
              <div key={update.id} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors border-l-4 ">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-sm text-gray-500 mb-1 leading-tight">{update.title}</h4>
                    <p className="text-sm text-gray-500">{formatDate(update.created_at)}</p>
                  </div>
                  <button
                    onClick={() => navigate('/updates')}
                    className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors flex items-center ml-4 flex-shrink-0"
                  >
                    <ArrowRight size={8} className="mr-1" />
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <h4 className="text-gray-700 font-medium mb-1">No Updates Available</h4>
            <p className="text-gray-500 text-sm">Check back later for the latest information and announcements.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mr-3">
              <Phone size={20} className="text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Emergency Protocols</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Immediate crisis intervention and safety planning with trained responders.
          </p>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-red-500 font-medium mr-3">24/7</span>
              <div>
                <h4 className="font-medium text-gray-900">Crisis Hotline</h4>
                <p className="text-sm text-gray-600">Immediate support from trained specialists</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-red-500 font-medium mr-3">1hr</span>
              <div>
                <h4 className="font-medium text-gray-900">Response Guarantee</h4>
                <p className="text-sm text-gray-600">Critical situations prioritized</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/emergency')}
            className="mt-6 w-full text-white bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium transition-colors"
          >
            Access Emergency Resources
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
              <Info size={20} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Resource Center</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Evidence-based materials on prevention, recovery, and legal rights.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-800 text-sm">Legal Guidance</h4>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-800 text-sm">Recovery Plans</h4>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-800 text-sm">Prevention Tools</h4>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-800 text-sm">Support Networks</h4>
            </div>
          </div>
          <button 
            onClick={() => navigate('/about')}
            className="w-full text-blue-700 border border-blue-300 hover:bg-blue-50 py-3 rounded-lg font-medium"
          >
            Explore Educational Materials
          </button>
        </div>
      </div>
      

      {/* Support Message */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl mt-6 sm:mt-8 border border-green-100">
        <div className="text-center ">
          <div className="bg-green-100 p-2 sm:p-3 rounded-full w-fit mx-auto mb-3 sm:mb-4">
            <Heart size={20} className="text-green-700" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">Remember: You Are Not Alone</h3>
          <p className="text-gray-600 text-xs sm:text-sm">
            Our community is here to support you every step of the way. Your courage in speaking up helps create a safer environment for everyone.
          </p>
        </div>
      </div>
    </div>
  );
}