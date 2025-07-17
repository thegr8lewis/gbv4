// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Search, Calendar, Clock, MapPin, Star, User, Mail, Phone, ArrowRight } from 'lucide-react';

// const API_BASE_URL = 'http://localhost:8000';

// function ClientInterface() {
//   const [psychologists, setPsychologists] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filters, setFilters] = useState({ 
//     location: '', 
//     specialization: '', 
//     price: '' 
//   });
//   const [selectedPsychologist, setSelectedPsychologist] = useState(null);
//   const [bookingForm, setBookingForm] = useState({ 
//     contact_email: '', 
//     contact_phone: '' 
//   });
//   const [reviewForm, setReviewForm] = useState({ 
//     rating: 5, 
//     comment: '' 
//   });

//   useEffect(() => {
//     const fetchPsychologists = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${API_BASE_URL}/api/psychologists/`);
//         setPsychologists(response.data);
//       } catch (err) {
//         setError(err.message);
//         console.error('Error fetching psychologists:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPsychologists();
//   }, []);

//   const handleFilterChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   const handleBookingSubmit = async (availabilityId) => {
//     try {
//       await axios.post(`${API_BASE_URL}/api/bookings/`, {
//         ...bookingForm,
//         psychologist: selectedPsychologist.id,
//         availability: availabilityId,
//       }, {
//         headers: {
//           'Authorization': `Token ${localStorage.getItem('auth_token')}`
//         }
//       });
//       alert('Booking confirmed! Check your email for the Google Meet link.');
//     } catch (err) {
//       console.error('Booking error:', err);
//       alert('Booking failed. Please try again.');
//     }
//   };

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${API_BASE_URL}/api/reviews/`, {
//         ...reviewForm,
//         psychologist: selectedPsychologist.id,
//       }, {
//         headers: {
//           'Authorization': `Token ${localStorage.getItem('auth_token')}`
//         }
//       });
//       alert('Review submitted successfully!');
//       setReviewForm({ rating: 5, comment: '' });
//     } catch (err) {
//       console.error('Review submission error:', err);
//       alert('Failed to submit review.');
//     }
//   };

//   const filteredPsychologists = Array.isArray(psychologists) ? psychologists.filter(p => 
//     p.location?.toLowerCase().includes(filters.location.toLowerCase()) &&
//     p.specialization?.toLowerCase().includes(filters.specialization.toLowerCase()) &&
//     (filters.price === '' || p.rate_cards?.some(r => r.price <= parseFloat(filters.price)))
//   ) : [];

//   if (loading) {
//     return (
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//           <p>Error loading psychologists: {error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
//       <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Find a Psychologist</h1>
        
//         {/* Filters */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search size={18} className="text-gray-400" />
//             </div>
//             <input
//               name="location"
//               value={filters.location}
//               onChange={handleFilterChange}
//               placeholder="Location"
//               className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
          
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <User size={18} className="text-gray-400" />
//             </div>
//             <input
//               name="specialization"
//               value={filters.specialization}
//               onChange={handleFilterChange}
//               placeholder="Specialization"
//               className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
          
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <span className="text-gray-400">$</span>
//             </div>
//             <input
//               name="price"
//               value={filters.price}
//               onChange={handleFilterChange}
//               placeholder="Max price"
//               type="number"
//               className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//         </div>

//         {/* Psychologist List */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredPsychologists.length > 0 ? (
//             filteredPsychologists.map(p => (
//               <div 
//                 key={p.id} 
//                 className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
//                 onClick={() => setSelectedPsychologist(p)}
//               >
//                 <div className="flex items-center mb-4">
//                   <div className="bg-blue-100 p-2 rounded-full mr-3">
//                     <User size={20} className="text-blue-600" />
//                   </div>
//                   <h2 className="text-lg font-semibold text-gray-800">
//                     {p.user?.first_name} {p.user?.last_name}
//                   </h2>
//                 </div>
//                 <div className="flex items-center text-sm text-gray-600 mb-2">
//                   <MapPin size={14} className="mr-2 text-gray-500" />
//                   <span>{p.location}</span>
//                 </div>
//                 <div className="flex items-center text-sm text-gray-600 mb-3">
//                   <Star size={14} className="mr-2 text-gray-500" />
//                   <span>{p.specialization}</span>
//                 </div>
//                 <p className="text-gray-600 text-sm mb-4 line-clamp-3">{p.bio}</p>
//                 <button 
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
//                 >
//                   View Profile
//                   <ArrowRight size={14} className="ml-2" />
//                 </button>
//               </div>
//             ))
//           ) : (
//             <div className="col-span-full text-center py-8">
//               <p className="text-gray-500">No psychologists found matching your criteria</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Psychologist Details Modal */}
//       {selectedPsychologist && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-start mb-6">
//                 <div>
//                   <h2 className="text-2xl font-bold text-gray-800">
//                     {selectedPsychologist.user?.first_name} {selectedPsychologist.user?.last_name}
//                   </h2>
//                   <div className="flex items-center mt-1">
//                     <MapPin size={16} className="text-gray-500 mr-2" />
//                     <span className="text-gray-600">{selectedPsychologist.location}</span>
//                   </div>
//                 </div>
//                 <button 
//                   onClick={() => setSelectedPsychologist(null)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-3">About</h3>
//                 <p className="text-gray-600">{selectedPsychologist.bio}</p>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                     <Star size={18} className="mr-2 text-blue-500" />
//                     Specialization
//                   </h3>
//                   <p className="text-gray-600">{selectedPsychologist.specialization}</p>
//                 </div>

//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                     <Clock size={18} className="mr-2 text-blue-500" />
//                     Session Rates
//                   </h3>
//                   <div className="space-y-2">
//                     {selectedPsychologist.rate_cards?.map(r => (
//                       <div key={r.id} className="bg-blue-50 p-3 rounded-lg">
//                         <p className="font-medium text-blue-700">{r.session_type}</p>
//                         <p className="text-gray-600">${r.price} for {r.duration_minutes} minutes</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                   <Calendar size={18} className="mr-2 text-blue-500" />
//                   Available Time Slots
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   {selectedPsychologist.availabilities?.filter(a => !a.is_booked).map(a => (
//                     <div key={a.id} className="border border-gray-200 rounded-lg p-3">
//                       <p className="font-medium text-gray-800">
//                         {new Date(a.start_time).toLocaleDateString('en-US', { 
//                           weekday: 'short', 
//                           month: 'short', 
//                           day: 'numeric' 
//                         })}
//                       </p>
//                       <p className="text-gray-600">
//                         {new Date(a.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
//                         {new Date(a.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                       </p>
//                       <div className="mt-3 space-y-3">
//                         <input
//                           type="email"
//                           placeholder="Your email"
//                           value={bookingForm.contact_email}
//                           onChange={(e) => setBookingForm({...bookingForm, contact_email: e.target.value})}
//                           className="w-full p-2 border border-gray-300 rounded"
//                           required
//                         />
//                         <input
//                           type="tel"
//                           placeholder="Phone number"
//                           value={bookingForm.contact_phone}
//                           onChange={(e) => setBookingForm({...bookingForm, contact_phone: e.target.value})}
//                           className="w-full p-2 border border-gray-300 rounded"
//                         />
//                         <button
//                           onClick={() => handleBookingSubmit(a.id)}
//                           className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
//                         >
//                           Book This Slot
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                   <Star size={18} className="mr-2 text-blue-500" />
//                   Qualifications
//                 </h3>
//                 <div className="space-y-3">
//                   {selectedPsychologist.qualifications?.map(q => (
//                     <div key={q.id} className="bg-gray-50 p-3 rounded-lg">
//                       <p className="font-medium text-gray-800">{q.title}</p>
//                       <p className="text-gray-600">{q.institution} ({q.year_obtained})</p>
//                       {q.document && (
//                         <a 
//                           href={q.document} 
//                           target="_blank" 
//                           rel="noopener noreferrer"
//                           className="text-blue-600 text-sm hover:underline"
//                         >
//                           View Document
//                         </a>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
//                   <Star size={18} className="mr-2 text-blue-500" />
//                   Reviews
//                 </h3>
//                 {selectedPsychologist.reviews?.length > 0 ? (
//                   <div className="space-y-4">
//                     {selectedPsychologist.reviews.map(r => (
//                       <div key={r.id} className="border-b border-gray-200 pb-4">
//                         <div className="flex items-center mb-1">
//                           {[...Array(5)].map((_, i) => (
//                             <Star 
//                               key={i} 
//                               size={16} 
//                               className={i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
//                             />
//                           ))}
//                         </div>
//                         <p className="text-gray-600">{r.comment}</p>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-gray-500">No reviews yet</p>
//                 )}
//               </div>

//               <div>
//                 <h3 className="text-lg font-semibold text-gray-800 mb-3">Leave a Review</h3>
//                 <form onSubmit={handleReviewSubmit} className="space-y-4">
//                   <div className="flex items-center">
//                     {[1, 2, 3, 4, 5].map(star => (
//                       <button
//                         key={star}
//                         type="button"
//                         onClick={() => setReviewForm({...reviewForm, rating: star})}
//                         className="mr-1"
//                       >
//                         <Star 
//                           size={20} 
//                           className={star <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
//                         />
//                       </button>
//                     ))}
//                     <span className="ml-2 text-gray-600">{reviewForm.rating} stars</span>
//                   </div>
//                   <textarea
//                     value={reviewForm.comment}
//                     onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
//                     placeholder="Share your experience..."
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     rows="4"
//                     required
//                   />
//                   <button
//                     type="submit"
//                     className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
//                   >
//                     Submit Review
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, User, ArrowRight, Grid, List } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

function PsychologistList() {
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ 
    location: '', 
    specialization: '', 
    price: '' 
  });
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/psychologists/`);
        if (!response.ok) {
          throw new Error('Failed to fetch psychologists');
        }
        const data = await response.json();
        setPsychologists(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching psychologists:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologists();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ location: '', specialization: '', price: '' });
  };

  const handleViewProfile = (psychologist) => {
    navigate(`/psychologist/${psychologist.id}`);
  };

  const filteredPsychologists = psychologists.filter(p => 
    p.location?.toLowerCase().includes(filters.location.toLowerCase()) &&
    p.specialization?.toLowerCase().includes(filters.specialization.toLowerCase()) &&
    (filters.price === '' || p.rate_cards?.some(r => r.price <= parseFloat(filters.price)))
  );

  const hasActiveFilters = filters.location || filters.specialization || filters.price;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <span className="text-red-600">⚠</span>
            </div>
            <div>
              <h3 className="font-semibold">Error loading psychologists</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center">
          <User className="h-6 w-6 sm:h-8 sm:w-8 mr-2 text-blue-600" />
          Find Your Psychologist
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
          Connect with qualified mental health professionals who understand your needs
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-xs sm:shadow-sm mb-6 sm:mb-8 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Search by location..."
                className="w-full pl-10 pr-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm sm:text-base"
              />
            </div>
            
            <div className="relative flex-1">
              <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                name="specialization"
                value={filters.specialization}
                onChange={handleFilterChange}
                placeholder="Specialization..."
                className="w-full pl-10 pr-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm sm:text-base"
              />
            </div>
            
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
              <input
                name="price"
                value={filters.price}
                onChange={handleFilterChange}
                placeholder="Max price..."
                type="number"
                className="w-full pl-8 pr-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-sm sm:text-base"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear all
              </button>
            )}
            
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 sm:p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 sm:p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-xs text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
        <p className="text-gray-600 text-sm sm:text-base">
          {filteredPsychologists.length} psychologist{filteredPsychologists.length !== 1 ? 's' : ''} found
        </p>
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-500">Active filters:</span>
            {filters.location && (
              <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm">
                {filters.location}
              </span>
            )}
            {filters.specialization && (
              <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm">
                {filters.specialization}
              </span>
            )}
            {filters.price && (
              <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm">
                Under ${filters.price}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Psychologist Grid/List */}
      {filteredPsychologists.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" 
          : "space-y-4"
        }>
          {filteredPsychologists.map(p => (
            <div 
              key={p.id} 
              className={`bg-white rounded-xl p-4 shadow-xs hover:shadow-sm transition-all duration-300 cursor-pointer group border border-gray-100 ${
                viewMode === 'list' ? 'flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6' : ''
              }`}
              onClick={() => handleViewProfile(p)}
            >
              <div className={`${viewMode === 'list' ? 'flex-shrink-0' : ''}`}>
                <div className="relative mb-3 sm:mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl w-fit">
                    <User size={20} className="text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </div>
              
              <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors">
                  {p.user?.first_name} {p.user?.last_name}
                </h3>
                
                <div className="flex items-center text-gray-600 mb-1 sm:mb-2 text-xs sm:text-sm">
                  <MapPin size={14} className="mr-1 sm:mr-2 text-gray-400" />
                  <span>{p.location}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2 sm:mb-3 text-xs sm:text-sm">
                  <Star size={14} className="mr-1 sm:mr-2 text-gray-400" />
                  <span>{p.specialization}</span>
                </div>
                
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 leading-relaxed">
                  {p.bio}
                </p>
                
                {p.rate_cards?.length > 0 && (
                  <div className="mb-3 sm:mb-4">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-700">From:</span>
                      <span className="text-base sm:text-lg font-bold text-blue-600">
                        ${Math.min(...p.rate_cards.map(r => r.price))}
                      </span>
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProfile(p);
                  }}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 sm:py-2 sm:px-5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center text-xs sm:text-sm"
                >
                  View Profile
                  <ArrowRight size={14} className="ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-xs border border-gray-100">
            <div className="bg-gray-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">No psychologists found</h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
              Try adjusting your search criteria or clear filters to see all available psychologists
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PsychologistList;