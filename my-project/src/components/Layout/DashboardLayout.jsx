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
//     account_status: localStorage.getItem('account_status') || 'active', // Default to 'active'
//   });

//   useEffect(() => {
//     const token = localStorage.getItem('auth_token');
//     const accountStatus = localStorage.getItem('account_status') || 'active'; // Default to 'active'
    
//     console.log('DashboardLayout useEffect: token=', token, 'accountStatus=', accountStatus);
    
//     if (!token) {
//       console.log('No token found, redirecting to /login');
//       navigate('/login');
//       return;
//     }

//     // Only redirect if account is explicitly suspended
//     if (accountStatus === 'suspended') {
//       console.log('Account suspended, redirecting to /login');
//       navigate('/login');
//       return;
//     }

//     console.log('Auth check passed, staying on dashboard');
//   }, [navigate]);

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


import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Calendar, User, BookOpen, Clock, LogOut } from 'lucide-react';
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
    account_status: localStorage.getItem('account_status') || 'active',
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const accountStatus = localStorage.getItem('account_status') || 'active';
    
    if (!token) {
      navigate('/dashboard/login');
      return;
    }

    if (accountStatus === 'suspended') {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await api.post('/auth/logout/');
      clearLocalStorage();
      navigate('/dashboard/login');
    } catch (error) {
      console.error('Error signing out:', error);
      clearLocalStorage();
      navigate('/dashboard/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('is_staff');
    localStorage.removeItem('account_status');
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

  const getNavIcon = (path) => {
    switch (path) {
      case '/dashboard':
        return <Calendar className="h-5 w-5" />;
      case '/dashboard/profile':
        return <User className="h-5 w-5" />;
      case '/dashboard/upcoming':
        return <Clock className="h-5 w-5" />;
      case '/dashboard/past':
        return <BookOpen className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg z-10">
          <div className="p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 truncate">{user.email}</p>
                <p className="text-xs text-gray-500">Status: {user.account_status}</p>
              </div>
            </div>
          </div>
          <nav className="p-2">
            <ul className="space-y-1">
              {[
                { path: '/dashboard', label: 'Availability', icon: <Calendar className="h-5 w-5" /> },
                { path: '/dashboard/profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
                { path: '/dashboard/upcoming', label: 'Upcoming', icon: <Clock className="h-5 w-5" /> },
                { path: '/dashboard/past', label: 'Past Appointments', icon: <BookOpen className="h-5 w-5" /> },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-3 rounded-md transition-colors ${
                      isActiveLink(item.path)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-3 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
              {isLoggingOut && (
                <svg className="animate-spin ml-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-shrink-0">
        <div className="w-64 bg-white shadow-md flex flex-col justify-between border-r border-gray-200">
          <div>
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-xl font-semibold text-gray-800">Psychologist Dashboard</h1>
              <div className="mt-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 truncate">{user.email}</p>
                    <p className="text-xs text-gray-500">Status: {user.account_status}</p>
                  </div>
                </div>
              </div>
            </div>

            <nav className="p-4">
              <ul className="space-y-2">
                {[
                  { path: '/dashboard', label: 'Availability Calendar', icon: <Calendar className="h-5 w-5" /> },
                  { path: '/dashboard/profile', label: 'Profile Management', icon: <User className="h-5 w-5" /> },
                  { path: '/dashboard/upcoming', label: 'Upcoming Sessions', icon: <Clock className="h-5 w-5" /> },
                  { path: '/dashboard/past', label: 'Past Appointments', icon: <BookOpen className="h-5 w-5" /> },
                ].map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-3 py-3 rounded-md transition-colors ${
                        isActiveLink(item.path)
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
              {isLoggingOut && (
                <svg className="animate-spin ml-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb for desktop */}
          <div className="hidden md:flex items-center text-sm text-gray-600 mb-6">
            <Link to="/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
            {location.pathname !== '/dashboard' && (
              <>
                <span className="mx-2">/</span>
                <span className="text-gray-800 font-medium">
                  {location.pathname
                    .split('/')
                    .pop()
                    .replace(/-/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              </>
            )}
          </div>
          
          {/* Page title for mobile */}
          <h2 className="md:hidden text-xl font-semibold text-gray-800 mb-6">
            {location.pathname
              .split('/')
              .pop()
              .replace(/-/g, ' ')
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </h2>

          {renderContent()}
        </div>
      </main>
    </div>
  );
}