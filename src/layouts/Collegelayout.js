import React, { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../components/Collgesidebar";


const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Mobile Top Navbar */}
        <div
          className="flex items-center justify-between px-4 py-3 shadow-md md:hidden"
          style={{ backgroundColor: "#246fb2" }}
        >
          <h1 className="text-lg font-bold text-white">College Admin Dashboard</h1>
          <button className="text-white" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
        </div>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
