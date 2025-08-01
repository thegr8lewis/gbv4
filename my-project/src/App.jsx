
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';
import UserRoutes from './routes/UserRoutes';
import PsychologistRoutes from './routes/PsychologistRoutes';
import { AuthProvider } from './contexts/AuthContext';
import NotFound from './components/NotFound'; 

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Role-based dashboard routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/dashboard/*" element={<PsychologistRoutes />} />

        {/* Default user-facing routes */}
        <Route path="/*" element={<UserRoutes />} />

        {/* 404 Not Found route - This should be last */}
        <Route path="*" element={<NotFound />} />

        {/* Fallback route */}
        {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
      </Routes>
    </AuthProvider>
  );
}

export default App;