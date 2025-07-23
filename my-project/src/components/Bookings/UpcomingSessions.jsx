
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Calendar, Clock, Video, User as UserIcon } from 'lucide-react';
// import api from '/src/utils/api';

// export default function UpcomingSessions() {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [authChecked, setAuthChecked] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuth = () => {
//       const token = localStorage.getItem('auth_token');
//       if (!token) {
//         navigate('/login');
//       } else {
//         setAuthChecked(true);
//       }
//     };

//     checkAuth();
//   }, [navigate]);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get('/bookings/upcoming/');
//         setBookings(response.data);
//       } catch (error) {
//         if (error.response && error.response.status === 401) {
//           localStorage.removeItem('auth_token');
//           localStorage.removeItem('user_email');
//           localStorage.removeItem('is_staff');
//           navigate('/login');
//         }
//         console.error("Error fetching bookings: ", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (authChecked) {
//       fetchBookings();
//     }
//   }, [authChecked, navigate]);

//   const formatDateTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       weekday: 'short',
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (!authChecked) {
//     return (
//       <div className="text-center py-4">Loading upcoming sessions...</div>
//     );
//   }

//   if (loading) return <div className="text-center py-4">Loading upcoming sessions...</div>;

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
//         <Calendar className="h-6 w-6 text-blue-600" />
//         Upcoming Sessions
//       </h2>
      
//       {bookings.length === 0 ? (
//         <div className="text-center py-8 bg-gray-50 rounded-lg">
//           <p className="text-gray-500">No upcoming sessions scheduled</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {bookings.map(booking => (
//             <div key={booking.id} className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-2">
//                     <UserIcon className="h-5 w-5 text-gray-500" />
//                     <h3 className="font-medium text-gray-900">
//                       Session with {booking.client_email || 'client'}
//                       {booking.client_phone && (
//                         <span className="text-gray-500 ml-2">({booking.client_phone})</span>
//                       )}
//                     </h3>
//                   </div>
                  
//                   <div className="flex items-center gap-2 text-gray-600">
//                     <Clock className="h-5 w-5 text-gray-400" />
//                     <span>
//                       {formatDateTime(booking.start)} • {formatTime(booking.start)} - {formatTime(booking.end)}
//                     </span>
//                   </div>
//                 </div>
                
//                 {booking.meet_link && (
//                   <a
//                     href={booking.meet_link}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
//                   >
//                     <Video className="h-4 w-4" />
//                     Join Meeting
//                   </a>
//                 )}
//               </div>
              
//               {booking.notes && (
//                 <div className="mt-3 p-3 bg-gray-50 rounded">
//                   <p className="text-sm text-gray-600">{booking.notes}</p>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// src/components/Bookings/UpcomingSessions.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, User as UserIcon } from 'lucide-react';
import api from '../../utils/api'; // Updated path to relative import

export default function UpcomingSessions() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const accountStatus = localStorage.getItem('account_status');
    if (!token || accountStatus !== 'active') {
      navigate('/login');
    } else {
      fetchBookings();
    }
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.get('/bookings/upcoming/');
      const bookingsArray = Array.isArray(response.data)
        ? response.data
        : response.data.results || response.data.bookings || [];
      setBookings(bookingsArray);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        localStorage.removeItem('is_staff');
        localStorage.removeItem('account_status');
        navigate('/login');
      }
      setError('Failed to fetch upcoming sessions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="text-center py-4">Loading upcoming sessions...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Calendar className="h-6 w-6 text-blue-600" />
        Upcoming Sessions
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchBookings}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No upcoming sessions scheduled</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="font-medium text-gray-900">
                      Session with {booking.client_email || 'client'}
                      {booking.client_phone && (
                        <span className="text-gray-500 ml-2">
                          ({booking.client_phone})
                        </span>
                      )}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span>
                      {formatDateTime(booking.start)} • {formatTime(booking.start)} -{' '}
                      {formatTime(booking.end)}
                    </span>
                  </div>
                </div>
                {booking.meet_link && (
                  <a
                    href={booking.meet_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    <Video className="h-4 w-4" />
                    Join Meeting
                  </a>
                )}
              </div>
              {booking.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">{booking.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}