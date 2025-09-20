// import React from "react";
// import SuperAdminPanel from "./SuperAdminPanel";
// import CollegeAdminPanel from "./CollegeAdminPanel";

// function App() {
//   return (
//   <SuperAdminPanel />
//   <CollegeAdminPanel />
//   )
// }

// export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import SuperAdminPanel from "./SuperAdminPanel";
import CollegeAdminPanel from "./CollegeAdminPanel";
import SuperAdminLogin from "./SuperAdminLogin";
import CollegeAdminLogin from "./CollegeAdminLogin";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<SuperAdminLogin />} />
        <Route path="/college-login" element={<CollegeAdminLogin />} />

        {/* Dashboard Routes */}
        <Route path="/super-admin" element={<SuperAdminPanel />} />
        <Route path="/college-admin" element={<CollegeAdminPanel />} />

        {/* Catch All → Redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;


// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import CollegeForm from "./pages/CollegeForm";
// import UserForm from "./pages/UserForm";
// import Navbar from "./components/Navbar";

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <div className="p-6">
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/college" element={<CollegeForm />} />
//           <Route path="/user" element={<UserForm />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
