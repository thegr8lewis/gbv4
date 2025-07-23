
// src/components/Bookings/PastAppointments.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api'; // Updated path to relative import

export default function PastAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const accountStatus = localStorage.getItem('account_status');
    if (!token || accountStatus !== 'active') {
      navigate('/login');
    } else {
      fetchAppointments();
    }
  }, [navigate]);

  const fetchAppointments = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await api.get('/bookings/past/');
      const appointmentsArray = Array.isArray(response.data)
        ? response.data
        : response.data.results || response.data.appointments || [];
      setAppointments(appointmentsArray);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        localStorage.removeItem('is_staff');
        localStorage.removeItem('account_status');
        navigate('/login');
      }
      setError('Failed to fetch past appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditNote = (appointment) => {
    setEditingNoteId(appointment.id);
    setNoteContent(appointment.notes || '');
  };

  const handleSaveNote = async (appointmentId) => {
    try {
      setError(null);
      await api.patch(`/bookings/${appointmentId}/`, {
        notes: noteContent,
      });
      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId ? { ...app, notes: noteContent } : app
        )
      );
      setEditingNoteId(null);
    } catch (error) {
      console.error('Error updating notes:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        localStorage.removeItem('is_staff');
        localStorage.removeItem('account_status');
        navigate('/login');
      }
      setError('Failed to update notes. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading past appointments...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Past Appointments</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchAppointments}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No past appointments</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">
                    Session with {appointment.client_email}
                    {appointment.client_phone && (
                      <span className="text-gray-500"> ({appointment.client_phone})</span>
                    )}
                  </h3>
                  <p className="text-gray-600">
                    {new Date(appointment.start).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    -{' '}
                    {new Date(appointment.start).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                {editingNoteId === appointment.id ? (
                  <div>
                    <textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      rows={3}
                    />
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleSaveNote(appointment.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700">
                      {appointment.notes || 'No notes for this session'}
                    </p>
                    <button
                      onClick={() => handleEditNote(appointment)}
                      className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      {appointment.notes ? 'Edit Notes' : 'Add Notes'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}