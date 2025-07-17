
import { useState, useEffect } from 'react';
import { auth } from '/src/Firebase';
import { Calendar, Clock, Video, User as UserIcon } from 'lucide-react';
import {  API_BASE_URL } from '/src/pages/User/apiConfig';

export default function UpcomingSessions() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          setLoading(false);
        } catch (error) {
          console.error("Error fetching bookings: ", error);
          setLoading(false);
        }
      }
    };

    fetchBookings();
  }, []);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="text-center py-4">Loading upcoming sessions...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Calendar className="h-6 w-6 text-blue-600" />
        Upcoming Sessions
      </h2>
      
      {bookings.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No upcoming sessions scheduled</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking.id} className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="font-medium text-gray-900">
                      Session with {booking.client_email || 'client'}
                      {booking.client_phone && (
                        <span className="text-gray-500 ml-2">({booking.client_phone})</span>
                      )}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span>
                      {formatDateTime(booking.start)} • {formatTime(booking.start)} - {formatTime(booking.end)}
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