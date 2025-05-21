import React, { useEffect, useState } from 'react';
import { MdDashboard, MdAnalytics } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isSidebar, setIsSidebar] = useState(window.innerWidth >= 1060);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setIsSidebar(window.innerWidth >= 1060);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const items = [
    { icon: <MdDashboard size={24} />, label: "Dashboard", href: "/" },
    { icon: <FaTasks size={22} />, label: "Tasks", href: "/Task" },
    { icon: <MdAnalytics size={24} />, label: "Analytics", href: "/analytics" },
  ];

  return (
    <nav
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        fixed bg-white shadow-lg rounded-xl
        transition-all duration-300 ease-in-out z-50
        flex ${isSidebar ? "flex-col" : "flex-row"}
        ${isSidebar 
          ? "top-0 left-0 min-h-[100vh] w-[6%] hover:w-56" 
          : "bottom-4 left-1/2 transform -translate-x-1/2 w-[90vw] h-16 rounded-3xl"}
      `}
      style={{ backdropFilter: "blur(12px)", backgroundColor: "#1e1f29" }}
    >
      {/* Logo for sidebar */}
      {isSidebar && (
        <div className={`flex items-center justify-center gap-3 p-4 mb-6 border-b border-blue-400`}>
          <img
            src="/logo.png"
            alt="logo"
            className={`w-10  rounded-full object-cover ${!isHovered ? 'ml-22':'ml-0'}`}
          />
          <span
            className={`text-xl font-bold text-[#4ade80] transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Questify
          </span>
        </div>
      )}

      {/* Menu Items */}
      <div className={`flex ${isSidebar ? "flex-col" : "flex-row"} flex-1 justify-around items-center`}>
        {items.map(({ icon, label, href }) => {
          const isActive = location.pathname === href;

          return (
            <Link
              key={label}
              to={href}
              className={`
                group relative flex items-center justify-center gap-3
                ${isSidebar ? "w-full px-4 py-3 rounded-lg mb-4" : "flex-1 h-full rounded-full"}
                ${isActive ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" : "text-[#4ade80] hover:text-blue-600 hover:bg-blue-100"}
                transition-all duration-300 ease-in-out cursor-pointer
                hover:scale-105
                ${isSidebar && isHovered ? "justify-start" : "justify-center"}
              `}
            >
              <div className="text-2xl">{icon}</div>
              {/* Label only visible on sidebar hover */}
              {isSidebar && isHovered && (
                <span className="text-lg font-semibold select-none whitespace-nowrap">
                  {label}
                </span>
              )}
            </Link>
          );
        })}

        {/* Settings link */}
        <Link
          to="/settings"
          className={`
            group relative flex items-center justify-center gap-3
            ${isSidebar ? "w-full px-4 py-3 rounded-lg mt-auto mb-4" : "flex-1 h-full rounded-full"}
            text-gray-600 hover:text-purple-700 hover:bg-purple-100
            transition-all duration-300 ease-in-out cursor-pointer hover:scale-105
            ${location.pathname === "/settings" ? "bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg" : ""}
            ${isSidebar && isHovered ? "justify-start" : "justify-center"}
          `}
        >
          <IoMdSettings size={24} />
          {isSidebar && isHovered && (
            <span className="text-lg font-semibold select-none whitespace-nowrap">
              Settings
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
