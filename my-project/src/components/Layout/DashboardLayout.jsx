// // src/components/Dashboard/DashboardLayout.jsx
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import api from '../../utils/api';
// import AvailabilityCalendar from '../Calendar/AvailabilityCalendar';
// import ProfileManagement from '../Profile/ProfileForm';
// import UpcomingSessions from '../Bookings/UpcomingSessions';
// import PastAppointments from '../Bookings/PastAppointments';

// export default function DashboardLayout() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [user, setUser] = useState({
//     email: localStorage.getItem('user_email') || 'user@example.com',
//     account_status: localStorage.getItem('account_status') || 'unknown',
//   });

//  useEffect(() => {
//   const token = localStorage.getItem('auth_token');
//   const accountStatus = localStorage.getItem('account_status');
//   console.log('DashboardLayout useEffect: token=', token, 'accountStatus=', accountStatus);
//   if (!token || accountStatus !== 'active') {
//     console.log('Invalid token or account status, redirecting to /login');
//     navigate('/dashboard/login'); // Use explicit path to match PsychologistRoutes
//   }
// }, [navigate]);

//   const handleLogout = async () => {
//     try {
//       await api.post('/auth/logout/');
//       localStorage.removeItem('auth_token');
//       localStorage.removeItem('user_id');
//       localStorage.removeItem('user_email');
//       localStorage.removeItem('is_staff');
//       localStorage.removeItem('account_status');
//       navigate('/login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//       localStorage.removeItem('auth_token');
//       localStorage.removeItem('user_id');
//       localStorage.removeItem('user_email');
//       localStorage.removeItem('is_staff');
//       localStorage.removeItem('account_status');
//       navigate('/login');
//     }
//   };

//   const renderContent = () => {
//     const path = location.pathname;
//     switch (path) {
//       case '/dashboard':
//         return <AvailabilityCalendar />;
//       case '/dashboard/profile':
//         return <ProfileManagement />;
//       case '/dashboard/upcoming':
//         return <UpcomingSessions />;
//       case '/dashboard/past':
//         return <PastAppointments />;
//       default:
//         return <AvailabilityCalendar />;
//     }
//   };

//   const isActiveLink = (path) => {
//     return location.pathname === path;
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
//         <div>
//           <div className="p-4 border-b">
//             <h1 className="text-xl font-semibold text-gray-800">Psychologist Dashboard</h1>
//             <div className="mt-2">
//               <p className="text-sm text-gray-500">Signed in as:</p>
//               <p className="text-sm font-medium text-gray-700">{user.email}</p>
//               <p className="text-sm text-gray-500">Status: {user.account_status}</p>
//             </div>
//           </div>

//           <nav className="p-4">
//             <ul className="space-y-2">
//               <li>
//                 <Link
//                   to="/dashboard"
//                   className={`block px-4 py-2 rounded transition-colors ${
//                     isActiveLink('/dashboard')
//                       ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
//                       : 'text-gray-700 hover:bg-gray-100'
//                   }`}
//                 >
//                   📅 Availability Calendar
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/dashboard/profile"
//                   className={`block px-4 py-2 rounded transition-colors ${
//                     isActiveLink('/dashboard/profile')
//                       ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
//                       : 'text-gray-700 hover:bg-gray-100'
//                   }`}
//                 >
//                   👤 Profile Management
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/dashboard/upcoming"
//                   className={`block px-4 py-2 rounded transition-colors ${
//                     isActiveLink('/dashboard/upcoming')
//                       ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
//                       : 'text-gray-700 hover:bg-gray-100'
//                   }`}
//                 >
//                   📋 Upcoming Sessions
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/dashboard/past"
//                   className={`block px-4 py-2 rounded transition-colors ${
//                     isActiveLink('/dashboard/past')
//                       ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
//                       : 'text-gray-700 hover:bg-gray-100'
//                   }`}
//                 >
//                   📚 Past Appointments
//                 </Link>
//               </li>
//             </ul>
//           </nav>
//         </div>

//         <div className="p-4 border-t">
//           <button
//             onClick={handleLogout}
//             className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
//           >
//             🚪 Logout
//           </button>
//         </div>
//       </aside>

//       <main className="flex-1 overflow-auto p-6">
//         <div className="max-w-7xl mx-auto">{renderContent()}</div>
//       </main>
//     </div>
//   );
// }


// src/components/Dashboard/DashboardLayout.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../utils/api';
import AvailabilityCalendar from '../Calendar/AvailabilityCalendar';
import ProfileManagement from '../Profile/ProfileForm';
import UpcomingSessions from '../Bookings/UpcomingSessions';
import PastAppointments from '../Bookings/PastAppointments';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({
    email: localStorage.getItem('user_email') || 'user@example.com',
    account_status: localStorage.getItem('account_status') || 'active', // Default to 'active'
  });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const accountStatus = localStorage.getItem('account_status') || 'active'; // Default to 'active'
    
    console.log('DashboardLayout useEffect: token=', token, 'accountStatus=', accountStatus);
    
    if (!token) {
      console.log('No token found, redirecting to /login');
      navigate('/login');
      return;
    }

    // Only redirect if account is explicitly suspended
    if (accountStatus === 'suspended') {
      console.log('Account suspended, redirecting to /login');
      navigate('/login');
      return;
    }

    console.log('Auth check passed, staying on dashboard');
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout/');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      localStorage.removeItem('is_staff');
      localStorage.removeItem('account_status');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      localStorage.removeItem('is_staff');
      localStorage.removeItem('account_status');
      navigate('/login');
    }
  };

  const renderContent = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return <AvailabilityCalendar />;
      case '/dashboard/profile':
        return <ProfileManagement />;
      case '/dashboard/upcoming':
        return <UpcomingSessions />;
      case '/dashboard/past':
        return <PastAppointments />;
      default:
        return <AvailabilityCalendar />;
    }
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
        <div>
          <div className="p-4 border-b">
            <h1 className="text-xl font-semibold text-gray-800">Psychologist Dashboard</h1>
            <div className="mt-2">
              <p className="text-sm text-gray-500">Signed in as:</p>
              <p className="text-sm font-medium text-gray-700">{user.email}</p>
              <p className="text-sm text-gray-500">Status: {user.account_status}</p>
            </div>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  to="/dashboard"
                  className={`block px-4 py-2 rounded transition-colors ${
                    isActiveLink('/dashboard')
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📅 Availability Calendar
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/profile"
                  className={`block px-4 py-2 rounded transition-colors ${
                    isActiveLink('/dashboard/profile')
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  👤 Profile Management
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/upcoming"
                  className={`block px-4 py-2 rounded transition-colors ${
                    isActiveLink('/dashboard/upcoming')
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📋 Upcoming Sessions
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/past"
                  className={`block px-4 py-2 rounded transition-colors ${
                    isActiveLink('/dashboard/past')
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📚 Past Appointments
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
}