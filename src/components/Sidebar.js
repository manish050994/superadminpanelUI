import React from "react";
import { Home, User, Settings, LogOut, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/nexus_logo.png"

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { name: "CollegesPage", icon: <User size={20} />, path: "/CollegesPage" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >
      {/* Sidebar Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        // style={{  }}
      >
        <img src={Logo} style={{width:"100px",margin:"auto"}}/>
        <button className="md:hidden text-white" onClick={toggleSidebar}>
          <X size={24} />
        </button>
      </div>

      {/* Sidebar Links */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item, idx) => (
          <Link
            key={idx}
            to={item.path}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            onClick={toggleSidebar}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-100 transition w-full"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
