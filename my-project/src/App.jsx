

import { Routes, Route } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";

function App() {
  return (
    <Routes>
      {/* Admin routes - prefixed with /admin */}
      <Route path="/admin/*" element={<AdminRoutes />} />
      
      {/* User routes - catch all other paths */}
      <Route path="/*" element={<UserRoutes />} />
    </Routes>
  );
}

export default App;