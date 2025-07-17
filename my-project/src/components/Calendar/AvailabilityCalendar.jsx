
import { useState, useCallback, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { addHours } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { auth } from '/src/Firebase';
import enUS from 'date-fns/locale/en-US';
import {  API_BASE_URL } from '/src/pages/User/apiConfig';

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

  useEffect(() => {
    const fetchAvailability = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const token = await user.getIdToken();
          const response = await fetch(`${API_BASE_URL}/availabilities/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setEvents(data.map(avail => ({
            title: avail.status === 'available' ? 'Available' : 'Unavailable',
            start: new Date(avail.start),
            end: new Date(avail.end),
            status: avail.status,
          })));
        } catch (error) {
          console.error("Error fetching availability: ", error);
        }
      }
    };

    const fetchBookings = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const token = await user.getIdToken();
          const response = await fetch(`${API_BASE_URL}/bookings/upcoming/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setBookings(data);
        } catch (error) {
          console.error("Error fetching bookings: ", error);
        }
      }
    };

    fetchAvailability();
    fetchBookings();
  }, []);

  const handleSelectSlot = useCallback(({ start, end }) => {
    setSelectedSlot({ start, end });
  }, []);

  const handleSaveSlot = async (status) => {
    if (!selectedSlot) return;

    const newEvent = {
      title: status === 'available' ? 'Available' : 'Unavailable',
      start: selectedSlot.start,
      end: selectedSlot.end,
      status,
    };

    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();

        // Fetch current availability
        const getResponse = await fetch(`${API_BASE_URL}/availabilities/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!getResponse.ok) {
          throw new Error(`HTTP error! status: ${getResponse.status}`);
        }

        const existingAvailabilities = await getResponse.json();

        // Remove any availability with same start & end
        const updatedAvailabilities = existingAvailabilities
          .filter(avail =>
            !(
              new Date(avail.start).getTime() === new Date(selectedSlot.start).getTime() &&
              new Date(avail.end).getTime() === new Date(selectedSlot.end).getTime()
            )
          )
          .map(avail => ({
            start: avail.start,
            end: avail.end,
            status: avail.status
          }));

        // Add updated slot
        updatedAvailabilities.push({
          start: selectedSlot.start.toISOString(),
          end: selectedSlot.end.toISOString(),
          status
        });

        // Send to backend
        const updateResponse = await fetch(`${API_BASE_URL}/availabilities/bulk/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ availabilities: updatedAvailabilities })
        });

        if (!updateResponse.ok) {
          throw new Error(`HTTP error! status: ${updateResponse.status}`);
        }

        // Update frontend state
        setEvents(prevEvents => [
          ...prevEvents.filter(event =>
            !(
              event.start.getTime() === selectedSlot.start.getTime() &&
              event.end.getTime() === selectedSlot.end.getTime()
            )
          ),
          newEvent,
        ]);

        setSelectedSlot(null);
      } catch (error) {
        console.error("Error updating availability: ", error);
      }
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad'; // default blue
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

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Availability Calendar</h2>
        <p className="text-gray-600">Click or drag to mark availability slots</p>
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleSaveSlot('available')}
          disabled={!selectedSlot}
          className={`px-4 py-2 rounded ${selectedSlot ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          Mark as Available
        </button>
        <button
          onClick={() => handleSaveSlot('unavailable')}
          disabled={!selectedSlot}
          className={`px-4 py-2 rounded ${selectedSlot ? 'bg-gray-500 hover:bg-gray-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
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
          <p>Selected slot: {format(selectedSlot.start, 'PPp')} - {format(selectedSlot.end, 'p')}</p>
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
            src={`https://www.google.com/maps/embed/v1/view?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&center=0,0&zoom=2`}
            allowFullScreen
          ></iframe>
        </div>
      )}

      <div style={{ height: 700 }}>
        <Calendar
          localizer={localizer}
          events={[
            ...events,
            ...bookings.map(booking => ({
              title: `Booked with ${booking.client_email}`,
              start: new Date(booking.start),
              end: new Date(booking.end),
              status: 'booked',
            }))
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
                status: event.status
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
