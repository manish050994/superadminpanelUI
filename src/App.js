

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import SuperAdminPanel from "./SuperAdminPanel";
import CollegeAdminPanel from "./CollegeAdminPanel";
import SuperAdminLogin from "./SuperAdminLogin";
import CollegeAdminLogin from "./CollegeAdminLogin";
import Dashboard from "./pages/Dashboard";
import CollegesPage from "./pages/Collegespage";
import CollegesPageAdd from "./pages/CollegeAdd";
import CourseAndSub from "./pages/CourseAndSub";
import TeachersPage from "./pages/Teachers";
import FeesPage from "./pages/FeesPage";
import TeacherLeavesPage from "./pages/TeachersLeavepage";
import ParentsPage from "./pages/Parentpage";
import TimetablePage from "./pages/Timetablepage";
import AttendancePage from "./pages/AttendancePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/CollegesPage" element={<CollegesPage />} />
        <Route path="/login" element={<SuperAdminLogin />} />
        <Route path="/college-login" element={<CollegeAdminLogin />} />
        <Route path="/colleges-page-add" element={<CollegesPageAdd />} />
        <Route path="/CourseAndSub" element={<CourseAndSub />} />

        <Route path="/TeachersPage" element={<TeachersPage />} />
        <Route path="/TeacherLeavesPage" element={<TeacherLeavesPage />} />
        <Route path="/FeesPage" element={<FeesPage />} />
        {/* <Route path="/super-admin" element={<SuperAdminPanel />} /> */}
        <Route path="/dashboard-college-admin" element={<CollegeAdminPanel />} />
        <Route path="/ParentsPage" element={<ParentsPage />} />
        <Route path="/TimetablePage" element={<TimetablePage />} />
        <Route path="/AttendancePage" element={<AttendancePage />} />
        {/* Catch All → Redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

