
// // src/components/Calendar/AvailabilityCalendar.jsx
// import { useState, useCallback, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
// import format from 'date-fns/format';
// import parse from 'date-fns/parse';
// import startOfWeek from 'date-fns/startOfWeek';
// import getDay from 'date-fns/getDay';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import enUS from 'date-fns/locale/en-US';
// import api from '../../utils/api';

// const locales = {
//   'en-US': enUS,
// };

// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });

// export default function AvailabilityCalendar() {
//   const [events, setEvents] = useState([]);
//   const [selectedSlot, setSelectedSlot] = useState(null);
//   const [showMap, setShowMap] = useState(false);
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentView, setCurrentView] = useState(Views.WEEK);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('auth_token');
//     const accountStatus = localStorage.getItem('account_status');
//     if (!token || accountStatus !== 'active') {
//       navigate('/login');
//     }
//   }, [navigate]);

//   const fetchAvailability = async () => {
//     try {
//       setError(null);
//       setLoading(true);
//       const response = await api.get('/availabilities/');
//       const availabilityArray = Array.isArray(response.data)
//         ? response.data
//         : response.data.results || response.data.availabilities || [];

//       if (!Array.isArray(availabilityArray)) {
//         throw new Error('Expected array but got ' + typeof availabilityArray);
//       }

//       setEvents(
//         availabilityArray.map((avail) => ({
//           title: avail.status === 'available' ? 'Available' : 'Unavailable',
//           start: new Date(avail.start),
//           end: new Date(avail.end),
//           status: avail.status,
//         }))
//       );
//     } catch (error) {
//       console.error('Error fetching availability:', error);
//       setError('Failed to fetch availability. Please try refreshing the page.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchBookings = async () => {
//     try {
//       setError(null);
//       setLoading(true);
//       const response = await api.get('/bookings/upcoming/');
//       const bookingsArray = Array.isArray(response.data)
//         ? response.data
//         : response.data.results || response.data.bookings || [];

//       if (!Array.isArray(bookingsArray)) {
//         throw new Error('Expected array but got ' + typeof bookingsArray);
//       }

//       setBookings(bookingsArray);
//     } catch (error) {
//       console.error('Error fetching bookings:', error);
//       setError('Failed to fetch bookings. Please try refreshing the page.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAvailability();
//     fetchBookings();
//   }, []);

//   const handleSelectSlot = useCallback(({ start, end }) => {
//     // Always create 45-minute slots
//     const slotStart = new Date(start);
//     const slotEnd = new Date(slotStart.getTime() + 45 * 60 * 1000); // Add 45 minutes
//     setSelectedSlot({ start: slotStart, end: slotEnd });
//   }, []);

//   const handleSaveSlot = async (status) => {
//     if (!selectedSlot) return;

//     try {
//       setError(null);
//       setLoading(true);
//       const response = await api.get('/availabilities/');
//       const existingAvailabilities = Array.isArray(response.data)
//         ? response.data
//         : response.data.results || response.data.availabilities || [];

//       await updateAvailability(existingAvailabilities, status);
//     } catch (error) {
//       console.error('Error updating availability:', error);
//       setError('Failed to update availability. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateAvailability = async (existingAvailabilities, status) => {
//     const updatedAvailabilities = existingAvailabilities
//       .filter(
//         (avail) =>
//           !(
//             new Date(avail.start).getTime() === new Date(selectedSlot.start).getTime() &&
//             new Date(avail.end).getTime() === new Date(selectedSlot.end).getTime()
//           )
//       )
//       .map((avail) => ({
//         start: avail.start,
//         end: avail.end,
//         status: avail.status,
//       }));

//     updatedAvailabilities.push({
//       start: selectedSlot.start.toISOString(),
//       end: selectedSlot.end.toISOString(),
//       status,
//     });

//     const response = await api.post('/availabilities/bulk/', {
//       availabilities: updatedAvailabilities,
//     });

//     if (response.status >= 200 && response.status < 300) {
//       const newEvent = {
//         title: status === 'available' ? 'Available' : 'Unavailable',
//         start: selectedSlot.start,
//         end: selectedSlot.end,
//         status,
//       };

//       setEvents((prevEvents) => [
//         ...prevEvents.filter(
//           (event) =>
//             !(
//               event.start.getTime() === selectedSlot.start.getTime() &&
//               event.end.getTime() === selectedSlot.end.getTime()
//             )
//         ),
//         newEvent,
//       ]);

//       setSelectedSlot(null);
//     } else {
//       throw new Error('Failed to update availability');
//     }
//   };

//   const eventStyleGetter = (event) => {
//     const baseStyle = {
//       borderRadius: '8px',
//       border: 'none',
//       color: 'white',
//       fontSize: '12px',
//       fontWeight: '500',
//       padding: '2px 6px',
//       boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//       transition: 'all 0.2s ease',
//     };

//     switch (event.status) {
//       case 'available':
//         return {
//           style: {
//             ...baseStyle,
//             background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//           },
//         };
//       case 'booked':
//         return {
//           style: {
//             ...baseStyle,
//             background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
//           },
//         };
//       case 'unavailable':
//         return {
//           style: {
//             ...baseStyle,
//             background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
//           },
//         };
//       default:
//         return {
//           style: {
//             ...baseStyle,
//             background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
//           },
//         };
//     }
//   };

//   const handleRetry = () => {
//     fetchAvailability();
//     fetchBookings();
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//         <div className="flex items-center justify-center h-screen">
//           <div className="flex flex-col items-center space-y-4">
//             <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//             <div className="text-lg font-medium text-slate-600">Loading calendar...</div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const calendarStyle = `
//     .rbc-calendar {
//       background: white;
//       border-radius: 16px;
//       box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
//       border: 1px solid #e2e8f0;
//       overflow: hidden;
//     }
//     .rbc-header {
//       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//       color: white;
//       font-weight: 600;
//       padding: 12px 8px;
//       border: none;
//       font-size: 14px;
//     }
//     .rbc-today {
//       background-color: #f8fafc;
//     }
//     .rbc-time-view {
//       border: none;
//     }
//     .rbc-time-header {
//       border-bottom: 2px solid #e2e8f0;
//     }
//     .rbc-timeslot-group {
//       border-bottom: 1px solid #f1f5f9;
//     }
//     .rbc-time-slot {
//       border-top: 1px solid #f8fafc;
//     }
//     .rbc-current-time-indicator {
//       background-color: #ef4444;
//       height: 2px;
//     }
//     .rbc-toolbar {
//       background: white;
//       padding: 20px;
//       border-bottom: 1px solid #e2e8f0;
//       margin-bottom: 0;
//     }
//     .rbc-btn-group button {
//       background: white;
//       border: 1px solid #d1d5db;
//       color: #374151;
//       padding: 8px 16px;
//       font-weight: 500;
//       transition: all 0.2s ease;
//     }
//     .rbc-btn-group button:hover {
//       background: #f3f4f6;
//       border-color: #9ca3af;
//     }
//     .rbc-btn-group button.rbc-active {
//       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//       border-color: #667eea;
//       color: white;
//     }
//     .rbc-toolbar-label {
//       font-size: 24px;
//       font-weight: 700;
//       color: #1f2937;
//     }
//     .rbc-event {
//       border-radius: 8px !important;
//       border: none !important;
//     }
//     .rbc-event:hover {
//       transform: translateY(-1px);
//       box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//     }
//     .rbc-day-slot .rbc-events-container {
//       margin-right: 0;
//     }
//     .rbc-time-content {
//       border-top: none;
//     }
//     .rbc-time-gutter {
//       background: #f8fafc;
//       border-right: 1px solid #e2e8f0;
//     }
//     .rbc-time-gutter .rbc-timeslot-group {
//       border-bottom: 1px solid #e2e8f0;
//     }
//   `;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       <style dangerouslySetInnerHTML={{ __html: calendarStyle }} />
      
//       <div className="max-w-7xl mx-auto p-6 space-y-6">
//         {/* Header Section */}
//         <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                 Availability Calendar
//               </h1>
//               <p className="text-slate-500 mt-2 text-lg">
//                 Manage your schedule with precision and style
//               </p>
//             </div>
//             <div className="flex items-center space-x-3">
//               <div className="flex items-center space-x-2 text-sm text-slate-600">
//                 <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-600"></div>
//                 <span>Available</span>
//               </div>
//               <div className="flex items-center space-x-2 text-sm text-slate-600">
//                 <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
//                 <span>Booked</span>
//               </div>
//               <div className="flex items-center space-x-2 text-sm text-slate-600">
//                 <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-400 to-gray-600"></div>
//                 <span>Unavailable</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Error Display */}
//         {error && (
//           <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-lg">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-3">
//                 <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
//                   <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 <p className="text-red-800 font-medium">{error}</p>
//               </div>
//               <button
//                 onClick={handleRetry}
//                 className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors duration-200"
//               >
//                 Retry
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
//           <div className="flex flex-wrap gap-4 items-center justify-between">
//             <div className="flex flex-wrap gap-3">
//               <button
//                 onClick={() => handleSaveSlot('available')}
//                 disabled={!selectedSlot}
//                 className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
//                   selectedSlot
//                     ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
//                     : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                 }`}
//               >
//                 <span className="flex items-center space-x-2">
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                   </svg>
//                   <span>Mark Available</span>
//                 </span>
//               </button>
              
//               <button
//                 onClick={() => handleSaveSlot('unavailable')}
//                 disabled={!selectedSlot}
//                 className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
//                   selectedSlot
//                     ? 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
//                     : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                 }`}
//               >
//                 <span className="flex items-center space-x-2">
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                   <span>Mark Unavailable</span>
//                 </span>
//               </button>
//             </div>

//             <button
//               onClick={() => setShowMap(!showMap)}
//               className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
//             >
//               <span className="flex items-center space-x-2">
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
//                 </svg>
//                 <span>{showMap ? 'Hide Map' : 'Show Map'}</span>
//               </span>
//             </button>
//           </div>
//         </div>

//         {/* Selected Slot Info */}
//         {selectedSlot && (
//           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
//             <div className="flex items-center space-x-4">
//               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//                 <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div>
//                 <h3 className="text-lg font-semibold text-slate-800">Selected Time Slot</h3>
//                 <p className="text-blue-700 font-medium">
//                   {format(selectedSlot.start, 'PPp')} - {format(selectedSlot.end, 'p')}
//                 </p>
//                 <p className="text-sm text-slate-600">
//                   Status: {selectedSlot.status ? selectedSlot.status.charAt(0).toUpperCase() + selectedSlot.status.slice(1) : 'Not Set'}
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Map Section */}
//         {showMap && (
//           <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
//             <div className="p-6 border-b border-slate-200">
//               <h3 className="text-xl font-semibold text-slate-800">Location Overview</h3>
//               <p className="text-slate-600 mt-1">Your service area and coverage map</p>
//             </div>
//             <div className="h-80">
//               <iframe
//                 width="100%"
//                 height="100%"
//                 frameBorder="0"
//                 style={{ border: 0 }}
//                 src={`https://www.google.com/maps/embed/v1/view?key=${
//                   import.meta.env.VITE_GOOGLE_MAPS_API_KEY
//                 }&center=0,0&zoom=2`}
//                 allowFullScreen
//               ></iframe>
//             </div>
//           </div>
//         )}

//         {/* Calendar Section */}
//         <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
//           <div style={{ height: 800 }}>
//             <Calendar
//               localizer={localizer}
//               events={[
//                 ...events,
//                 ...(Array.isArray(bookings)
//                   ? bookings.map((booking) => ({
//                       title: `Booked with ${booking.client_email || 'client'}`,
//                       start: new Date(booking.start),
//                       end: new Date(booking.end),
//                       status: 'booked',
//                     }))
//                   : []),
//               ]}
//               startAccessor="start"
//               endAccessor="end"
//               defaultView={Views.WEEK}
//               view={currentView}
//               onView={setCurrentView}
//               selectable
//               onSelectSlot={handleSelectSlot}
//               onSelectEvent={(event) => {
//                 if (event.status !== 'booked') {
//                   setSelectedSlot({
//                     start: event.start,
//                     end: event.end,
//                     status: event.status,
//                   });
//                 }
//               }}
//               eventPropGetter={eventStyleGetter}
//               step={45}
//               timeslots={1}
//               popup
//               showMultiDayTimes
//               resizable
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import enUS from 'date-fns/locale/en-US';
import api from '../../utils/api';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function AvailabilityCalendar() {
  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState(Views.WEEK);
  const [showModal, setShowModal] = useState(false);
  const [modalStatus, setModalStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const accountStatus = localStorage.getItem('account_status');
    if (!token || accountStatus !== 'active') {
      navigate('/login');
    }
  }, [navigate]);

  const fetchAvailability = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.get('/availabilities/');
      const availabilityArray = Array.isArray(response.data)
        ? response.data
        : response.data.results || response.data.availabilities || [];

      if (!Array.isArray(availabilityArray)) {
        throw new Error('Expected array but got ' + typeof availabilityArray);
      }

      setEvents(
        availabilityArray.map((avail) => ({
          title: avail.status === 'available' ? 'Available' : 'Unavailable',
          start: new Date(avail.start),
          end: new Date(avail.end),
          status: avail.status,
        }))
      );
    } catch (error) {
      console.error('Error fetching availability:', error);
      setError('Failed to fetch availability. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.get('/bookings/upcoming/');
      const bookingsArray = Array.isArray(response.data)
        ? response.data
        : response.data.results || response.data.bookings || [];

      if (!Array.isArray(bookingsArray)) {
        throw new Error('Expected array but got ' + typeof bookingsArray);
      }

      setBookings(bookingsArray);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to fetch bookings. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
    fetchBookings();
  }, []);

  const handleSelectSlot = useCallback(({ start, end }) => {
    const slotStart = new Date(start);
    const slotEnd = new Date(slotStart.getTime() + 45 * 60 * 1000);
    setSelectedSlot({ start: slotStart, end: slotEnd });
    setShowModal(true);
  }, []);

  const handleSaveSlot = async (status) => {
    if (!selectedSlot) return;

    try {
      setError(null);
      setLoading(true);
      const response = await api.get('/availabilities/');
      const existingAvailabilities = Array.isArray(response.data)
        ? response.data
        : response.data.results || response.data.availabilities || [];

      await updateAvailability(existingAvailabilities, status);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating availability:', error);
      setError('Failed to update availability. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = async (existingAvailabilities, status) => {
    const updatedAvailabilities = existingAvailabilities
      .filter(
        (avail) =>
          !(
            new Date(avail.start).getTime() === new Date(selectedSlot.start).getTime() &&
            new Date(avail.end).getTime() === new Date(selectedSlot.end).getTime()
          )
      )
      .map((avail) => ({
        start: avail.start,
        end: avail.end,
        status: avail.status,
      }));

    updatedAvailabilities.push({
      start: selectedSlot.start.toISOString(),
      end: selectedSlot.end.toISOString(),
      status,
    });

    const response = await api.post('/availabilities/bulk/', {
      availabilities: updatedAvailabilities,
    });

    if (response.status >= 200 && response.status < 300) {
      const newEvent = {
        title: status === 'available' ? 'Available' : 'Unavailable',
        start: selectedSlot.start,
        end: selectedSlot.end,
        status,
      };

      setEvents((prevEvents) => [
        ...prevEvents.filter(
          (event) =>
            !(
              event.start.getTime() === selectedSlot.start.getTime() &&
              event.end.getTime() === selectedSlot.end.getTime()
            )
        ),
        newEvent,
      ]);

      setSelectedSlot(null);
    } else {
      throw new Error('Failed to update availability');
    }
  };

  const eventStyleGetter = (event) => {
    const baseStyle = {
      borderRadius: '8px',
      border: 'none',
      color: 'white',
      fontSize: '12px',
      fontWeight: '500',
      padding: '4px 8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'all 0.2s ease',
    };

    switch (event.status) {
      case 'available':
        return {
          style: {
            ...baseStyle,
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          },
        };
      case 'booked':
        return {
          style: {
            ...baseStyle,
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          },
        };
      case 'unavailable':
        return {
          style: {
            ...baseStyle,
            background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
          },
        };
      default:
        return {
          style: {
            ...baseStyle,
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          },
        };
    }
  };

  const handleRetry = () => {
    fetchAvailability();
    fetchBookings();
  };

  const calendarStyle = `
    .rbc-calendar {
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .rbc-header {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      color: white;
      font-weight: 600;
      padding: 12px;
      border: none;
      font-size: 14px;
    }
    .rbc-today {
      background-color: #f8fafc;
    }
    .rbc-time-view {
      border: none;
    }
    .rbc-time-header {
      border-bottom: 1px solid #e5e7eb;
    }
    .rbc-timeslot-group {
      border-bottom: 1px solid #f1f5f9;
    }
    .rbc-time-slot {
      border-top: 1px solid #f8fafc;
    }
    .rbc-current-time-indicator {
      background-color: #ef4444;
      height: 2px;
    }
    .rbc-toolbar {
      background: white;
      padding: 16px;
      border-bottom: 1px solid #e5e7eb;
      margin-bottom: 0;
    }
    .rbc-btn-group button {
      background: white;
      border: 1px solid #d1d5db;
      color: #1f2937;
      padding: 8px 16px;
      font-weight: 500;
      border-radius: 6px;
      transition: all 0.2s ease;
    }
    .rbc-btn-group button:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
    }
    .rbc-btn-group button.rbc-active {
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border-color: #3b82f6;
      color: white;
    }
    .rbc-toolbar-label {
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
    }
    .rbc-event {
      border-radius: 8px !important;
      border: none !important;
    }
    .rbc-event:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .rbc-day-slot .rbc-events-container {
      margin-right: 0;
    }
    .rbc-time-content {
      border-top: none;
    }
    .rbc-time-gutter {
      background: #f8fafc;
      border-right: 1px solid #e5e7eb;
    }
    .rbc-time-gutter .rbc-timeslot-group {
      border-bottom: 1px solid #e5e7eb;
    }
  `;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{calendarStyle}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Availability Calendar</h1>
              <p className="text-gray-500 mt-1">Manage your schedule with ease</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Booked</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span>Unavailable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-800 font-medium">{error}</p>
              </div>
              <button
                onClick={handleRetry}
                className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-md font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-end">
            <button
              onClick={() => setShowMap(!showMap)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              {showMap ? 'Hide Map' : 'Show Map'}
            </button>
          </div>
        </div> */}

        {/* Map Section */}
        {/* {showMap && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Location Overview</h3>
              <p className="text-gray-500">Your service area and coverage map</p>
            </div>
            <div className="h-64">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/view?key=${
                  import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                }&center=0,0&zoom=2`}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )} */}

        {/* Calendar Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div style={{ height: 600 }}>
            <Calendar
              localizer={localizer}
              events={[
                ...events,
                ...(Array.isArray(bookings)
                  ? bookings.map((booking) => ({
                      title: `Booked with ${booking.client_email || 'client'}`,
                      start: new Date(booking.start),
                      end: new Date(booking.end),
                      status: 'booked',
                    }))
                  : []),
              ]}
              startAccessor="start"
              endAccessor="end"
              defaultView={Views.WEEK}
              view={currentView}
              onView={setCurrentView}
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={(event) => {
                if (event.status !== 'booked') {
                  setSelectedSlot({
                    start: event.start,
                    end: event.end,
                    status: event.status,
                  });
                  setShowModal(true);
                }
              }}
              eventPropGetter={eventStyleGetter}
              step={45}
              timeslots={1}
              popup
              showMultiDayTimes
              resizable
            />
          </div>
        </div>

        {/* Modal for Confirmation */}
        {showModal && selectedSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Availability</h3>
              <p className="text-gray-600 mb-4">
                Set availability for{' '}
                <span className="font-medium">
                  {format(selectedSlot.start, 'PPp')} - {format(selectedSlot.end, 'p')}
                </span>
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setModalStatus('unavailable');
                    handleSaveSlot('unavailable');
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors"
                >
                  Mark Unavailable
                </button>
                <button
                  onClick={() => {
                    setModalStatus('available');
                    handleSaveSlot('available');
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
                >
                  Mark Available
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}