
import { Routes, Route, useLocation } from "react-router-dom";
import AdminLayout from "../pages/Admin/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard";
import Events from "../pages/Admin/EventsandWorkshops";
import Settings from "../pages/Admin/Settings";
import Support from "../pages/Admin/Support";
import Reports from "../pages/Admin/Reports";
import Login from "../pages/Admin/Login";
import Updates from "../pages/Admin/Updates";



const AdminRoutes = () => {
  return (
    <Routes>
      {/* Login routes - no layout wrapper */}
      <Route index element={<Login />} />
      <Route path="login" element={<Login />} />
      
      {/* Admin dashboard routes - with layout wrapper */}
      <Route path="dashboard" element={<AdminLayoutWrapper><Dashboard /></AdminLayoutWrapper>} />

      {/* Other admin routes - all wrapped in AdminLayout */}
      <Route path="events" element={<AdminLayoutWrapper><Events /></AdminLayoutWrapper>} />
      <Route path="settings" element={<AdminLayoutWrapper><Settings /></AdminLayoutWrapper>} />
      <Route path="support" element={<AdminLayoutWrapper><Support /></AdminLayoutWrapper>} />
      <Route path="updates" element={<AdminLayoutWrapper><Updates /></AdminLayoutWrapper>} />
      <Route path="reports" element={<AdminLayoutWrapper><Reports /></AdminLayoutWrapper>} />
      
      {/* Default route for unmatched admin paths - redirect to dashboard */}
      <Route path="*" element={<AdminLayoutWrapper><Dashboard /></AdminLayoutWrapper>} />
    </Routes>
  );
};

// Helper component to wrap AdminLayout with activeNavItem
const AdminLayoutWrapper = ({ children }) => {
  const location = useLocation();
  const pathname = location.pathname;
  
  // Determine active nav item based on current path
  let activeNavItem = 'Dashboard'; // default
  if (pathname.includes('/admin/psychologist-dashboard')) activeNavItem = 'Psychologist Dashboard';
  if (pathname.includes('/admin/reports')) activeNavItem = 'Reports';
  if (pathname.includes('/admin/support')) activeNavItem = 'Support';
  if (pathname.includes('/admin/updates')) activeNavItem = 'Updates';
  if (pathname.includes('/admin/events')) activeNavItem = 'Events';
  if (pathname.includes('/admin/settings')) activeNavItem = 'Settings';
  if (pathname.includes('/admin/dashboard')) activeNavItem = 'Dashboard';

  return (
    <AdminLayout activeNavItem={activeNavItem}>
      {children}
    </AdminLayout>
  );
};

export default AdminRoutes;