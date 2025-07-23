
// import { useState, useCallback, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
// import format from 'date-fns/format';
// import parse from 'date-fns/parse';
// import startOfWeek from 'date-fns/startOfWeek';
// import getDay from 'date-fns/getDay';
// import { addHours } from 'date-fns';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import enUS from 'date-fns/locale/en-US';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

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
//   const navigate = useNavigate();

//   const fetchAvailability = async () => {
//     try {
//       setError(null);
//       setLoading(true);

//       const response = await fetch(`${API_BASE_URL}/availabilities/`, {
//         // headers: {
//         //   'Authorization': `Token ${localStorage.getItem('auth_token')}`
//         // }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
      
//       // Handle case where data might be an object with nested array
//       const availabilityArray = Array.isArray(data) ? data : 
//                               (data.results || data.availabilities || []);

//       if (!Array.isArray(availabilityArray)) {
//         throw new Error("Expected array but got " + typeof availabilityArray);
//       }

//       setEvents(availabilityArray.map(avail => ({
//         title: avail.status === 'available' ? 'Available' : 'Unavailable',
//         start: new Date(avail.start),
//         end: new Date(avail.end),
//         status: avail.status,
//       })));
//     } catch (error) {
//       console.error("Error fetching availability: ", error);
//       setError("Failed to fetch availability. Please try refreshing the page.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchBookings = async () => {
//     try {
//       setError(null);
//       setLoading(true);

//       const response = await fetch(`${API_BASE_URL}/bookings/upcoming/`, {
//         // headers: {
//         //   'Authorization': `Token ${localStorage.getItem('auth_token')}`
//         // }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
      
//       // Handle case where data might be an object with nested array
//       const bookingsArray = Array.isArray(data) ? data : 
//                           (data.results || data.bookings || []);

//       if (!Array.isArray(bookingsArray)) {
//         throw new Error("Expected array but got " + typeof bookingsArray);
//       }

//       setBookings(bookingsArray);
//     } catch (error) {
//       console.error("Error fetching bookings: ", error);
//       setError("Failed to fetch bookings. Please try refreshing the page.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAvailability();
//     fetchBookings();
//   }, []);

//   const handleSelectSlot = useCallback(({ start, end }) => {
//     setSelectedSlot({ start, end });
//   }, []);

//   const handleSaveSlot = async (status) => {
//     if (!selectedSlot) return;

//     try {
//       setError(null);
//       setLoading(true);

//       const response = await fetch(`${API_BASE_URL}/availabilities/`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       const existingAvailabilities = Array.isArray(data) ? data : 
//                                    (data.results || data.availabilities || []);

//       await updateAvailability(existingAvailabilities, status);
//     } catch (error) {
//       console.error("Error updating availability: ", error);
//       setError("Failed to update availability. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateAvailability = async (existingAvailabilities, status) => {
//     const updatedAvailabilities = existingAvailabilities
//       .filter(avail =>
//         !(
//           new Date(avail.start).getTime() === new Date(selectedSlot.start).getTime() &&
//           new Date(avail.end).getTime() === new Date(selectedSlot.end).getTime()
//         )
//       )
//       .map(avail => ({
//         start: avail.start,
//         end: avail.end,
//         status: avail.status
//       }));

//     updatedAvailabilities.push({
//       start: selectedSlot.start.toISOString(),
//       end: selectedSlot.end.toISOString(),
//       status
//     });

//     const response = await fetch(`${API_BASE_URL}/availabilities/bulk/`, {
//       method: 'POST',
//       // headers: {
//       //   'Authorization': `Token ${localStorage.getItem('auth_token')}`,
//       //   'Content-Type': 'application/json'
//       // },
//       body: JSON.stringify({ availabilities: updatedAvailabilities })
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const newEvent = {
//       title: status === 'available' ? 'Available' : 'Unavailable',
//       start: selectedSlot.start,
//       end: selectedSlot.end,
//       status,
//     };

//     setEvents(prevEvents => [
//       ...prevEvents.filter(event =>
//         !(
//           event.start.getTime() === selectedSlot.start.getTime() &&
//           event.end.getTime() === selectedSlot.end.getTime()
//         )
//       ),
//       newEvent,
//     ]);

//     setSelectedSlot(null);
//   };

//   const eventStyleGetter = (event) => {
//     let backgroundColor = '#3174ad';
//     if (event.status === 'available') backgroundColor = '#2ecc71';
//     else if (event.status === 'booked') backgroundColor = '#e74c3c';
//     else if (event.status === 'unavailable') backgroundColor = '#95a5a6';

//     return {
//       style: {
//         backgroundColor,
//         borderRadius: '4px',
//         opacity: 0.8,
//         color: 'white',
//         border: '0px',
//         display: 'block',
//       },
//     };
//   };

//   const handleRetry = () => {
//     fetchAvailability();
//     fetchBookings();
//   };

//   if (loading) {
//     return (
//       <div className="p-4">
//         <div className="flex items-center justify-center h-64">
//           <div className="text-lg">Loading...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold">Availability Calendar</h2>
//         <p className="text-gray-600">Click or drag to mark availability slots</p>
//       </div>

//       {error && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//           <div className="flex items-center justify-between">
//             <p className="text-red-700">{error}</p>
//             <button
//               onClick={handleRetry}
//               className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="flex space-x-4 mb-4">
//         <button
//           onClick={() => handleSaveSlot('available')}
//           disabled={!selectedSlot}
//           className={`px-4 py-2 rounded ${selectedSlot ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
//         >
//           Mark as Available
//         </button>
//         <button
//           onClick={() => handleSaveSlot('unavailable')}
//           disabled={!selectedSlot}
//           className={`px-4 py-2 rounded ${selectedSlot ? 'bg-gray-500 hover:bg-gray-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
//         >
//           Mark as Unavailable
//         </button>
//         <button
//           onClick={() => setShowMap(!showMap)}
//           className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
//         >
//           {showMap ? 'Hide Map' : 'Show Map'}
//         </button>
//       </div>

//       {selectedSlot && (
//         <div className="mb-4 p-3 bg-blue-50 rounded">
//           <p>Selected slot: {format(selectedSlot.start, 'PPp')} - {format(selectedSlot.end, 'p')}</p>
//           <p>Status: {selectedSlot.status || 'Not Set'}</p>
//         </div>
//       )}

//       {showMap && (
//         <div className="mb-6 h-64 bg-gray-100 rounded-lg overflow-hidden">
//           <iframe
//             width="100%"
//             height="100%"
//             frameBorder="0"
//             style={{ border: 0 }}
//             src={`https://www.google.com/maps/embed/v1/view?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&center=0,0&zoom=2`}
//             allowFullScreen
//           ></iframe>
//         </div>
//       )}

//       <div style={{ height: 700 }}>
//         <Calendar
//           localizer={localizer}
//           events={[
//             ...events,
//             ...(Array.isArray(bookings) ? bookings.map(booking => ({
//               title: `Booked with ${booking.client_email || 'client'}`,
//               start: new Date(booking.start),
//               end: new Date(booking.end),
//               status: 'booked',
//             })) : [])
//           ]}
//           startAccessor="start"
//           endAccessor="end"
//           defaultView={Views.WEEK}
//           selectable
//           onSelectSlot={handleSelectSlot}
//           onSelectEvent={(event) => {
//             if (event.status !== 'booked') {
//               setSelectedSlot({
//                 start: event.start,
//                 end: event.end,
//                 status: event.status
//               });
//             }
//           }}
//           eventPropGetter={eventStyleGetter}
//           step={15}
//           timeslots={4}
//         />
//       </div>
//     </div>
//   );
// }

// src/components/Calendar/AvailabilityCalendar.jsx
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
    setSelectedSlot({ start, end });
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
    let backgroundColor = '#3174ad';
    if (event.status === 'available') backgroundColor = '#2ecc71';
    else if (event.status === 'booked') backgroundColor = '#e74c3c';
    else if (event.status === 'unavailable') backgroundColor = '#95a5a6';

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  const handleRetry = () => {
    fetchAvailability();
    fetchBookings();
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Availability Calendar</h2>
        <p className="text-gray-600">Click or drag to mark availability slots</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-red-700">{error}</p>
            <button
              onClick={handleRetry}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleSaveSlot('available')}
          disabled={!selectedSlot}
          className={`px-4 py-2 rounded ${
            selectedSlot
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Mark as Available
        </button>
        <button
          onClick={() => handleSaveSlot('unavailable')}
          disabled={!selectedSlot}
          className={`px-4 py-2 rounded ${
            selectedSlot
              ? 'bg-gray-500 hover:bg-gray-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Mark as Unavailable
        </button>
        <button
          onClick={() => setShowMap(!showMap)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          {showMap ? 'Hide Map' : 'Show Map'}
        </button>
      </div>

      {selectedSlot && (
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <p>
            Selected slot: {format(selectedSlot.start, 'PPp')} -{' '}
            {format(selectedSlot.end, 'p')}
          </p>
          <p>Status: {selectedSlot.status || 'Not Set'}</p>
        </div>
      )}

      {showMap && (
        <div className="mb-6 h-64 bg-gray-100 rounded-lg overflow-hidden">
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
      )}

      <div style={{ height: 700 }}>
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
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(event) => {
            if (event.status !== 'booked') {
              setSelectedSlot({
                start: event.start,
                end: event.end,
                status: event.status,
              });
            }
          }}
          eventPropGetter={eventStyleGetter}
          step={15}
          timeslots={4}
        />
      </div>
    </div>
  );
}