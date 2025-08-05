// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { User, Globe, Award, Calendar as CalendarIcon, Clock, Phone, Mail, ArrowLeft, CheckCircle, XCircle, Shield } from 'lucide-react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { format, parseISO } from 'date-fns';
// import api from '../../utils/api';

// export default function PsychologistProfile() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [psychologist, setPsychologist] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [availability, setAvailability] = useState([]);
//   const [showBookingForm, setShowBookingForm] = useState(false);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [clientEmail, setClientEmail] = useState('');
//   const [clientPhone, setClientPhone] = useState('');
//   const [isBooking, setIsBooking] = useState(false);
//   const [isRefreshingAvailability, setIsRefreshingAvailability] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await api.get(`/psychologists/${id}/`);
//         setPsychologist(response.data);

//         if (response.data.availability) {
//           setAvailability(
//             response.data.availability.map((avail) => ({
//               id: avail.id,
//               start: parseISO(avail.start),
//               end: parseISO(avail.end),
//               status: avail.status,
//             }))
//           );
//         }
//       } catch (err) {
//         console.error('Error fetching psychologist data:', err);
//         setError(err.response?.data?.error || err.message);
//         toast.error(err.response?.data?.error || err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   const formatDate = (date) => {
//     return format(date, 'EEEE, MMMM d, yyyy');
//   };

//   const formatTime = (date) => {
//     return format(date, 'h:mm a');
//   };

//   const getGenderIcon = (gender) => {
//     if (!gender) return '👤';
//     switch (gender.toLowerCase()) {
//       case 'male':
//         return '👨';
//       case 'female':
//         return '👩';
//       default:
//         return '👤';
//     }
//   };

//   const handleBookAppointment = async (e) => {
//     e.preventDefault();

//     if (!clientEmail) {
//       toast.error('Email is required');
//       return;
//     }

//     try {
//       setIsBooking(true);

//      await api.post(`/psychologists/${id}/bookings/`, {
//   client_email: clientEmail,
//   client_phone: clientPhone,
//   availability_id: selectedSlot.id,
//   start: selectedSlot.start.toISOString(),
//   end: selectedSlot.end.toISOString(),
// });

//       toast.success('Appointment booked successfully!');

//       setIsRefreshingAvailability(true);
//       try {
//         const updatedResponse = await api.get(`/psychologists/${id}/`);
//         if (updatedResponse.data.availability) {
//           setAvailability(
//             updatedResponse.data.availability.map((avail) => ({
//               id: avail.id,
//               start: parseISO(avail.start),
//               end: parseISO(avail.end),
//               status: avail.status,
//             }))
//           );
//         }
//       } finally {
//         setIsRefreshingAvailability(false);
//       }

//       setShowBookingForm(false);
//       setClientEmail('');
//       setClientPhone('');
//     } catch (err) {
//       console.error('Booking error:', err);
//       toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to book appointment');
//     } finally {
//       setIsBooking(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
//         <div className="text-center py-12">
//           <div className="relative inline-block">
//             <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
//             <div className="absolute inset-0 flex items-center justify-center">
//               <User className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
//             </div>
//           </div>
//           <p className="mt-4 text-gray-600 font-medium text-sm sm:text-base">
//             Loading profile...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
//         <div className="text-center">
//           <div className="bg-white border border-red-200 rounded-xl p-4 sm:p-6 shadow-sm">
//             <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
//               <XCircle className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
//             </div>
//             <h2 className="text-red-800 font-bold text-lg sm:text-xl mb-1 sm:mb-2">
//               Error
//             </h2>
//             <p className="text-red-600 mb-4 sm:mb-6 text-sm sm:text-base">{error}</p>
//             <button
//               onClick={() => navigate(-1)}
//               className="bg-red-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl hover:bg-red-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md text-sm sm:text-base"
//             >
//               Go Back
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!psychologist) {
//     return (
//       <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
//         <div className="text-center bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
//           <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
//             <User className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
//           </div>
//           <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
//             Profile not found
//           </h3>
//           <p className="text-gray-500 text-sm sm:text-base">
//             The psychologist profile you're looking for doesn't exist.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
//       <div className="flex items-center justify-between mb-4 sm:mb-8">
//         <button
//           onClick={() => navigate(-1)}
//           className="p-1 sm:p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200"
//         >
//           <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
//         </button>
//         <div className="text-center flex-1">
//           <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 flex items-center justify-center">
//             <Shield className="h-5 w-5 sm:h-8 sm:w-8 mr-1 sm:mr-2 text-blue-600" />
//             Psychologist Profile
//           </h1>
//           <p className="text-gray-600 text-xs sm:text-base">
//             Book your appointment with {psychologist.username}
//           </p>
//         </div>
//         <div className="w-8 sm:w-10"></div>
//       </div>

//       <div className="grid gap-4 sm:gap-8">
//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-6">
//           <div className="flex items-start mb-3 sm:mb-6">
//             <div className="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
//               <span className="text-xl sm:text-3xl">{getGenderIcon(psychologist.gender)}</span>
//             </div>
//             <div>
//               <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
//                 {psychologist.username}
//               </h2>
//               <div className="flex flex-wrap gap-1 sm:gap-2">
//                 <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full font-medium">
//                   {psychologist.gender
//                     ? psychologist.gender.charAt(0).toUpperCase() + psychologist.gender.slice(1)
//                     : 'Not specified'}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {psychologist.bio && (
//             <div className="mb-4 sm:mb-6">
//               <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
//                 About
//               </h3>
//               <p className="text-gray-600 text-xs sm:text-base leading-relaxed bg-gray-50 p-3 sm:p-4 rounded-lg">
//                 {psychologist.bio}
//               </p>
//             </div>
//           )}

//           {psychologist.specializations && (
//             <div className="mb-4 sm:mb-6">
//               <div className="flex items-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
//                 <Award className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
//                 <h3 className="text-base sm:text-lg font-semibold text-gray-900">
//                   Specializations
//                 </h3>
//               </div>
//               <div className="flex flex-wrap gap-1 sm:gap-2">
//                 {psychologist.specializations.split(',').map((spec, i) => (
//                   <span
//                     key={i}
//                     className="text-xs bg-green-100 text-green-800 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full font-medium"
//                   >
//                     {spec.trim()}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {psychologist.languages?.length > 0 && (
//             <div className="mb-4 sm:mb-6">
//               <div className="flex items-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
//                 <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
//                 <h3 className="text-base sm:text-lg font-semibold text-gray-900">
//                   Languages
//                 </h3>
//               </div>
//               <div className="flex flex-wrap gap-1 sm:gap-2">
//                 {psychologist.languages.map((lang, i) => (
//                   <span
//                     key={i}
//                     className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full font-medium"
//                   >
//                     {lang}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="space-y-2 sm:space-y-3">
//             <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
//               Contact Information
//             </h3>
//             {psychologist.phone_number && (
//               <div className="flex items-center space-x-2 sm:space-x-3 text-gray-600 bg-gray-50 p-2 sm:p-3 rounded-lg">
//                 <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
//                 <span className="text-xs sm:text-base">{psychologist.phone_number}</span>
//               </div>
//             )}
//             {psychologist.email && (
//               <div className="flex items-center space-x-2 sm:space-x-3 text-gray-600 bg-gray-50 p-2 sm:p-3 rounded-lg">
//                 <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
//                 <span className="text-xs sm:text-base">{psychologist.email}</span>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-6">
//           <div className="flex items-center space-x-1 sm:space-x-2 mb-4 sm:mb-6">
//             <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
//             <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
//               Available Appointments
//             </h2>
//           </div>

//           {isRefreshingAvailability ? (
//             <div className="text-center py-6 sm:py-8">
//               <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mb-3 sm:mb-4"></div>
//               <p className="text-gray-600 text-sm sm:text-base">Updating availability...</p>
//             </div>
//           ) : (
//             <div className="grid gap-2 sm:gap-4">
//               {availability.length === 0 ? (
//                 <div className="text-center py-6 sm:py-8">
//                   <p className="text-gray-500 text-sm sm:text-base">
//                     No available appointments at this time.
//                   </p>
//                 </div>
//               ) : (
//                 availability.map((slot) => (
//                   <div
//                     key={slot.id}
//                     className={`p-2 sm:p-4 rounded-lg border transition-all duration-200 ${
//                       slot.status === 'available'
//                         ? 'border-green-200 bg-green-50 hover:bg-green-100 cursor-pointer'
//                         : 'border-red-200 bg-red-50 cursor-not-allowed'
//                     }`}
//                     onClick={() => {
//                       if (slot.status !== 'available') return;
//                       setSelectedSlot(slot);
//                       setClientEmail('');
//                       setClientPhone('');
//                       setShowBookingForm(true);
//                     }}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-2 sm:space-x-3">
//                         <div
//                           className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
//                             slot.status === 'available' ? 'bg-green-500' : 'bg-red-500'
//                           }`}
//                         ></div>
//                         <div>
//                           <p
//                             className={`font-medium text-sm sm:text-base ${
//                               slot.status === 'available'
//                                 ? 'text-gray-900'
//                                 : 'text-gray-600 line-through'
//                             }`}
//                           >
//                             {formatDate(slot.start)}
//                           </p>
//                           <div
//                             className={`flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm ${
//                               slot.status === 'available' ? 'text-gray-600' : 'text-gray-500'
//                             }`}
//                           >
//                             <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
//                             <span>
//                               {formatTime(slot.start)} - {formatTime(slot.end)}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                       <div
//                         className={`flex items-center space-x-1 sm:space-x-2 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
//                           slot.status === 'available'
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}
//                       >
//                         {slot.status === 'available' ? (
//                           <>
//                             <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
//                             <span>Available</span>
//                           </>
//                         ) : (
//                           <>
//                             <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
//                             <span>Booked</span>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                     {slot.status !== 'available' && (
//                       <div className="mt-1 text-xs text-red-500 italic">
//                         This slot has already been booked by another client
//                       </div>
//                     )}
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {showBookingForm && selectedSlot && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
//           <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 max-w-md w-full border border-gray-100">
//             <div className="text-center mb-4 sm:mb-6">
//               <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
//                 <CalendarIcon className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
//               </div>
//               <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
//                 Book Appointment
//               </h2>
//               <div className="bg-blue-50 p-2 sm:p-4 rounded-lg">
//                 <p className="text-blue-800 font-medium text-xs sm:text-base">
//                   {formatDate(selectedSlot.start)}
//                 </p>
//                 <p className="text-blue-600 text-xs sm:text-sm">
//                   {formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)}
//                 </p>
//               </div>
//             </div>

//             <form onSubmit={handleBookAppointment}>
//               <div className="space-y-3 sm:space-y-4">
//                 <div>
//                   <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
//                     Email Address *
//                   </label>
//                   <input
//                     type="email"
//                     required
//                     className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
//                     placeholder="your@email.com"
//                     value={clientEmail}
//                     onChange={(e) => setClientEmail(e.target.value)}
//                     disabled={isBooking}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
//                     Phone Number (Optional)
//                   </label>
//                   <input
//                     type="tel"
//                     className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
//                     placeholder="+1 (555) 123-4567"
//                     value={clientPhone}
//                     onChange={(e) => setClientPhone(e.target.value)}
//                     disabled={isBooking}
//                   />
//                 </div>
//                 <div className="flex space-x-2 sm:space-x-3 pt-3 sm:pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowBookingForm(false)}
//                     className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium disabled:opacity-50 text-sm sm:text-base"
//                     disabled={isBooking}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 text-sm sm:text-base"
//                     disabled={isBooking}
//                   >
//                     {isBooking ? 'Booking...' : 'Confirm Booking'}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         toastClassName="text-sm sm:text-base"
//       />
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Globe, Award, Calendar as CalendarIcon, Clock, Phone, Mail, ArrowLeft, CheckCircle, XCircle, Shield } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format, parseISO, isAfter } from 'date-fns';
import api from '../../utils/api';

export default function PsychologistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [psychologist, setPsychologist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [isRefreshingAvailability, setIsRefreshingAvailability] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/psychologists/${id}/`);
        setPsychologist(response.data);

        if (response.data.availability) {
          const now = new Date();
          const filteredAvailability = response.data.availability
            .map((avail) => ({
              id: avail.id,
              start: parseISO(avail.start),
              end: parseISO(avail.end),
              status: avail.status,
            }))
            .filter(slot => isAfter(slot.end, now)); // Filter out past slots

          setAvailability(filteredAvailability);
        }
      } catch (err) {
        console.error('Error fetching psychologist data:', err);
        setError(err.response?.data?.error || err.message);
        toast.error(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (date) => {
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const formatTime = (date) => {
    return format(date, 'h:mm a');
  };

  const getGenderIcon = (gender) => {
    if (!gender) return '👤';
    switch (gender.toLowerCase()) {
      case 'male':
        return '👨';
      case 'female':
        return '👩';
      default:
        return '👤';
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    if (!clientEmail) {
      toast.error('Email is required');
      return;
    }

    try {
      setIsBooking(true);
      setBookingSuccess(false);

      await api.post(`/psychologists/${id}/bookings/`, {
        client_email: clientEmail,
        client_phone: clientPhone,
        availability_id: selectedSlot.id,
        start: selectedSlot.start.toISOString(),
        end: selectedSlot.end.toISOString(),
      });

      setBookingSuccess(true);

      setIsRefreshingAvailability(true);
      try {
        const updatedResponse = await api.get(`/psychologists/${id}/`);
        if (updatedResponse.data.availability) {
          const now = new Date();
          const filteredAvailability = updatedResponse.data.availability
            .map((avail) => ({
              id: avail.id,
              start: parseISO(avail.start),
              end: parseISO(avail.end),
              status: avail.status,
            }))
            .filter(slot => isAfter(slot.end, now));

          setAvailability(filteredAvailability);
        }
      } finally {
        setIsRefreshingAvailability(false);
      }

      // Clear form after successful booking
      setTimeout(() => {
        setShowBookingForm(false);
        setClientEmail('');
        setClientPhone('');
        setBookingSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Booking error:', err);
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setIsBooking(false);
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

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="text-center">
          <div className="bg-white border border-red-200 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <XCircle className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <h2 className="text-red-800 font-bold text-lg sm:text-xl mb-1 sm:mb-2">
              Error
            </h2>
            <p className="text-red-600 mb-4 sm:mb-6 text-sm sm:text-base">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-red-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl hover:bg-red-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md text-sm sm:text-base"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!psychologist) {
    return (
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="text-center bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <User className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
            Profile not found
          </h3>
          <p className="text-gray-500 text-sm sm:text-base">
            The psychologist profile you're looking for doesn't exist.
          </p>
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
            Psychologist Profile
          </h1>
          <p className="text-gray-600 text-xs sm:text-base">
            Book your appointment with {psychologist.username}
          </p>
        </div>
        <div className="w-8 sm:w-10"></div>
      </div>

      <div className="grid gap-4 sm:gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-6">
          <div className="flex items-start mb-3 sm:mb-6">
            <div className="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <span className="text-xl sm:text-3xl">{getGenderIcon(psychologist.gender)}</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
                {psychologist.username}
              </h2>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full font-medium">
                  {psychologist.gender
                    ? psychologist.gender.charAt(0).toUpperCase() + psychologist.gender.slice(1)
                    : 'Not specified'}
                </span>
              </div>
            </div>
          </div>

          {psychologist.bio && (
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                About
              </h3>
              <p className="text-gray-600 text-xs sm:text-base leading-relaxed bg-gray-50 p-3 sm:p-4 rounded-lg">
                {psychologist.bio}
              </p>
            </div>
          )}

          {psychologist.specializations && (
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Specializations
                </h3>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {psychologist.specializations.split(',').map((spec, i) => (
                  <span
                    key={i}
                    className="text-xs bg-green-100 text-green-800 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full font-medium"
                  >
                    {spec.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {psychologist.languages?.length > 0 && (
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Languages
                </h3>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {psychologist.languages.map((lang, i) => (
                  <span
                    key={i}
                    className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full font-medium"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
              Contact Information
            </h3>
            {psychologist.phone_number && (
              <div className="flex items-center space-x-2 sm:space-x-3 text-gray-600 bg-gray-50 p-2 sm:p-3 rounded-lg">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                <span className="text-xs sm:text-base">{psychologist.phone_number}</span>
              </div>
            )}
            {psychologist.email && (
              <div className="flex items-center space-x-2 sm:space-x-3 text-gray-600 bg-gray-50 p-2 sm:p-3 rounded-lg">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                <span className="text-xs sm:text-base">{psychologist.email}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-6">
          <div className="flex items-center space-x-1 sm:space-x-2 mb-4 sm:mb-6">
            <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
              Available Appointments
            </h2>
          </div>

          {isRefreshingAvailability ? (
            <div className="text-center py-6 sm:py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mb-3 sm:mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">Updating availability...</p>
            </div>
          ) : (
            <div className="grid gap-2 sm:gap-4">
              {availability.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <p className="text-gray-500 text-sm sm:text-base">
                    No available appointments at this time.
                  </p>
                </div>
              ) : (
                availability.map((slot) => (
                  <div
                    key={slot.id}
                    className={`p-2 sm:p-4 rounded-lg border transition-all duration-200 ${
                      slot.status === 'available'
                        ? 'border-green-200 bg-green-50 hover:bg-green-100 cursor-pointer'
                        : 'border-red-200 bg-red-50 cursor-not-allowed'
                    }`}
                    onClick={() => {
                      if (slot.status !== 'available') return;
                      setSelectedSlot(slot);
                      setClientEmail('');
                      setClientPhone('');
                      setShowBookingForm(true);
                      setBookingSuccess(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div
                          className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                            slot.status === 'available' ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        ></div>
                        <div>
                          <p
                            className={`font-medium text-sm sm:text-base ${
                              slot.status === 'available'
                                ? 'text-gray-900'
                                : 'text-gray-600 line-through'
                            }`}
                          >
                            {formatDate(slot.start)}
                          </p>
                          <div
                            className={`flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm ${
                              slot.status === 'available' ? 'text-gray-600' : 'text-gray-500'
                            }`}
                          >
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>
                              {formatTime(slot.start)} - {formatTime(slot.end)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`flex items-center space-x-1 sm:space-x-2 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                          slot.status === 'available'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {slot.status === 'available' ? (
                          <>
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>Available</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>Booked</span>
                          </>
                        )}
                      </div>
                    </div>
                    {slot.status !== 'available' && (
                      <div className="mt-1 text-xs text-red-500 italic">
                        This slot has already been booked by another client
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {showBookingForm && selectedSlot && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 max-w-md w-full border border-gray-100">
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CalendarIcon className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                {bookingSuccess ? 'Booking Confirmed!' : 'Book Appointment'}
              </h2>
              <div className="bg-blue-50 p-2 sm:p-4 rounded-lg">
                <p className="text-blue-800 font-medium text-xs sm:text-base">
                  {formatDate(selectedSlot.start)}
                </p>
                <p className="text-blue-600 text-xs sm:text-sm">
                  {formatTime(selectedSlot.start)} - {formatTime(selectedSlot.end)}
                </p>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-green-600 font-medium mb-4">
                  Your appointment has been successfully booked!
                </p>
                <p className="text-gray-600 text-sm mb-6">
                  A confirmation has been sent to your email.
                </p>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookAppointment}>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      placeholder="your@email.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      disabled={isBooking}
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      placeholder="+1 (555) 123-4567"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      disabled={isBooking}
                    />
                  </div>
                  <div className="flex space-x-2 sm:space-x-3 pt-3 sm:pt-4">
                    <button
                      type="button"
                      onClick={() => setShowBookingForm(false)}
                      className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium disabled:opacity-50 text-sm sm:text-base"
                      disabled={isBooking}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:opacity-50 text-sm sm:text-base"
                      disabled={isBooking}
                    >
                      {isBooking ? 'Booking...' : 'Confirm Booking'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="text-sm sm:text-base"
      />
    </div>
  );
}