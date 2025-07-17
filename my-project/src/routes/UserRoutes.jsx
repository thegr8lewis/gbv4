
import { Routes, Route } from "react-router-dom";
import About from "../pages/User/About";
import Emergency from "../pages/User/Emergency";
import Home from "../pages/User/Home";
import Report from "../pages/User/Report";
import Update from "../pages/User/Updates";
import GBVApp from "../pages/User/SGBVApp";
import Layout from '../pages/User/Layout';
import Response from "../pages/User/ReportResponse";
import Instruction from "../pages/User/Instruction";
import PsychologistDirectory from '../pages/Psychologist/PsychologistDirectory';
import PsychologistProfile from '../pages/Psychologist/PsychologistProfile';

const UserRoutes = () => {
  return (
    <Layout>
      <Routes>
        {/* Home/root route */}
        <Route index element={<GBVApp />} />
        
        {/* User application routes */}
        <Route path="home" element={<Home />} />
        <Route path="report" element={<Report />} />
        <Route path="emergency" element={<Emergency />} />

        <Route path="/psychologists" element={<PsychologistDirectory />} />
        <Route path="/psychologists/:id" element={<PsychologistProfile />} />
        
        <Route path="about" element={<About />} />
        <Route path="updates" element={<Update />} />
        <Route path="report-response" element={<Response />} />
        <Route path="instructions" element={<Instruction />} />
        
        {/* Catch-all route for unmatched user paths */}
        <Route path="*" element={<GBVApp />} />
      </Routes>
    </Layout>
  );
};

export default UserRoutes;