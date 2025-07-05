

import { Routes, Route } from "react-router-dom";
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
      <Route index element={<Login />} />
      <Route path="login" element={<Login />} />
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="events" element={<Events />} />
        <Route path="settings" element={<Settings />} />
        <Route path="support" element={<Support />} />
        <Route path="updates" element={<Updates />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;