
// routes/PsychologistRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/Layout/DashboardLayout';
import LoginPage from '/src/components/Auth/LoginPage';
import RegisterPage from '/src/components/Auth/RegisterPage';

export default function PsychologistRoutes() {
  return (
    <Routes>

         <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

      {/* Single route that handles all dashboard paths */}
      <Route path="/*" element={<DashboardLayout />} />
    </Routes>
  );
}