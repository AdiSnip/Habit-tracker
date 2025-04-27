
import React, { useEffect, useState } from 'react'
import { MdDashboard,MdAnalytics } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { IoMdSettings } from "react-icons/io";

const Navbar = () => {
  const [opt, setOpt] = useState([])
  const [padding, setPadding] = useState("justify-center")
  const items = [
    { icon: <MdDashboard />, label: "Dashboard", href: "/" },
    { icon: <FaTasks />, label: "Tasks", href: "/Task" },
    { icon: <MdAnalytics />, label: "Analytics", href: "/analytics" },
  ];

  return (
    <nav 
    onMouseOver={()=>{
      setOpt(["logo","Dashboard","Tasks","Analytics","Settings"])
      setPadding("justify-start pl-2")
    }}
    onMouseLeave={()=>{
      setOpt([])
      setPadding("justify-center")
    }}
    className={`min-h-screen w-[5%] hover:w-[20%] bg-black flex flex-col pt-2 z-999 items-center hover:items-start fixed top-0 left-0 transition-all duration-300 ease-in-out`}
    >
        <div className='h-[2vw] w-[2vw] bg-white border rounded-full'></div>
        <section className='w-full pt-[20%] flex flex-col items-start gap-0'>
        {items.map(({ icon, label, href }, i) => (
            <Link
              key={i}
              to={href}
              className={`h-[8vh] w-full text-white flex ${padding} items-center flex-nowrap gap-1 hover:bg-zinc-900`}
              >
              {icon} {opt.length ? label : null}
            </Link>
        ))}

        </section>
        <div className='h-[2vw] w-[2vw] flex justify-center items-center text-white rounded-full absolute bottom-1'><IoMdSettings /></div>
    </nav>
  )
}

export default Navbar