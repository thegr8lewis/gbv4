import { Outlet } from 'react-router-dom';
import { auth } from '/src/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold">Psychologist Dashboard</h1>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a
                href="/dashboard"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Availability Calendar
              </a>
            </li>
            <li>
              <a
                href="/dashboard/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Profile Management
              </a>
            </li>
            <li>
              <a
                href="/dashboard/upcoming"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Upcoming Sessions
              </a>
            </li>
            <li>
              <a
                href="/dashboard/past"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Past Appointments
              </a>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}