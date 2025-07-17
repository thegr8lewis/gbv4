
import { Routes, Route } from "react-router-dom";
import Login from "/src/components/Auth/Login";
import SignUp from "/src/components/Auth/SignUp";
import ForgotPassword from "/src/components/Auth/ForgotPassword";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import PsychologistRoutes from "./routes/PsychologistRoutes";
import PrivateRoute from './components/Auth/PrivateRoute';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Admin routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* Psychologist routes */}
      <Route 
        path="/dashboard/*" 
        element={
          <PrivateRoute allowedRoles={['psychologist']}>
            <PsychologistRoutes />
          </PrivateRoute>
        } 
      />

      {/* Default fallback to user routes */}
      <Route path="/*" element={<UserRoutes />} />
    </Routes>
  );
}

export default App;