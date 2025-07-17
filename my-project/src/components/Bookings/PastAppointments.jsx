
import { useState, useEffect } from 'react';
import { auth } from '/src/Firebase';
import {  API_BASE_URL } from '/src/pages/User/apiConfig';

export default function PastAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const token = await user.getIdToken();
          const response = await fetch(`${API_BASE_URL}/bookings/past/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          setAppointments(data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching appointments: ", error);
          setLoading(false);
        }
      }
    };

    fetchAppointments();
  }, []);

  const handleEditNote = (appointment) => {
    setEditingNoteId(appointment.id);
    setNoteContent(appointment.notes || '');
  };

  const handleSaveNote = async (appointmentId) => {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();

      const response = await fetch(`${API_BASE_URL}/bookings/${appointmentId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notes: noteContent
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setAppointments(prev => prev.map(app => 
        app.id === appointmentId ? { ...app, notes: noteContent } : app
      ));
      setEditingNoteId(null);
    } catch (error) {
      console.error("Error updating notes: ", error);
    }
  };

  if (loading) return <div className="text-center py-4">Loading past appointments...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Past Appointments</h2>
      
      {appointments.length === 0 ? (
        <p className="text-gray-500">No past appointments</p>
      ) : (
        <div className="space-y-4">
          {appointments.map(appointment => (
            <div key={appointment.id} className="p-4 border rounded-lg shadow-sm">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">
                    Session with {appointment.client_email}
                    {appointment.client_phone && ` (${appointment.client_phone})`}
                  </h3>
                  <p className="text-gray-600">
                    {new Date(appointment.start).toLocaleDateString()} - {new Date(appointment.start).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              <div className="mt-3">
                {editingNoteId === appointment.id ? (
                  <div>
                    <textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="w-full p-2 border rounded"
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