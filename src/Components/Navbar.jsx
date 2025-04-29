import React, { useEffect, useState } from 'react';
import { MdDashboard, MdAnalytics } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isSidebar, setIsSidebar] = useState(window.innerWidth >= 1060); // Notice: 1060px breakpoint
  const [opt, setOpt] = useState([]);
  const [logotxt, setLogotxt] = useState("");
  const [padding, setPadding] = useState("justify-center");

  useEffect(() => {
    const handleResize = () => {
      setIsSidebar(window.innerWidth >= 1060);
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const items = [
    { icon: <MdDashboard />, label: "Dashboard", href: "/" },
    { icon: <FaTasks />, label: "Tasks", href: "/Task" },
    { icon: <MdAnalytics />, label: "Analytics", href: "/analytics" },
  ];

  const handleMouseOver = () => {
    if (isSidebar) {
      setOpt(["logo", "Dashboard", "Tasks", "Analytics", "Settings"]);
      setPadding("justify-start pl-2");
      setLogotxt("Taskify");
    }
  };

  const handleMouseLeave = () => {
    if (isSidebar) {
      setOpt([]);
      setPadding("justify-center");
      setLogotxt("");
    }
  };

  return (
    <nav 
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      className={`
        fixed bg-white border z-999 transition-all duration-300 ease-in-out
        flex ${isSidebar ? "flex-col" : "flex-row"}
        ${isSidebar ? "top-0 left-0 min-h-screen w-[5%] hover:w-[20%]" : "bottom-0 left-0 w-full h-[10vh]"}
        items-center pt-2
      `}
    >
      {/* Logo only for Sidebar */}
      {isSidebar && (
        <div className='flex flex-row h-[8vh] w-full justify-center items-center'>
          <img src="/logo.png" alt="logo" className='scale-75 w-[60px]' />
          <div className='text-md md:text-xl font-medium'>{logotxt}</div>
        </div>
      )}

      {/* Menu Items */}
      <section className={`flex ${isSidebar ? "flex-col" : "flex-row"} w-full h-full justify-evenly ${isSidebar ? "pt-[20%]" : ""}`}>
        {items.map(({ icon, label, href }, i) => (
          <Link
            key={i}
            to={href}
            className={`text-black flex ${padding} items-center ${isSidebar ? "flex-nowrap" : "flex-row"} gap-1 hover:bg-zinc-200 ${isSidebar ? "h-[8vh] w-full" : "h-full w-full"}`}
          >
            {icon}
            {isSidebar && <div>{opt.length ? label : null}</div>}
          </Link>
        ))}

        {/* Settings always last */}
        <Link
          to="/settings"
          className={`text-black flex ${padding} items-center ${isSidebar ? "flex-nowrap" : "flex-col"} gap-1 hover:bg-zinc-200 ${isSidebar ? "h-[8vh] w-full absolute bottom-1" : "h-full w-full"}`}
        >
          <IoMdSettings />
          {isSidebar && <div>{opt.length ? "Settings" : null}</div>}
        </Link>
      </section>
    </nav>
  );
};

export default Navbar;
