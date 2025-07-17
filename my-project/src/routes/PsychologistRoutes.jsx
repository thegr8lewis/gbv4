
// routes/PsychologistRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/Layout/DashboardLayout';

export default function PsychologistRoutes() {
  return (
    <Routes>
      {/* Single route that handles all dashboard paths */}
      <Route path="/*" element={<DashboardLayout />} />
    </Routes>
  );
}