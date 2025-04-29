import React from 'react';

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-1/4 bg-gray-100 border-r">
      <div className="p-6 text-2xl font-bold text-gray-700 border-b">Settings</div>
      <nav className="flex flex-col p-4 gap-4 text-gray-600">
        <button className="text-left hover:text-black transition">Profile</button>
        <button className="text-left hover:text-black transition">Theme & Appearance</button>
        <button className="text-left hover:text-black transition">Notifications</button>
        <button className="text-left hover:text-black transition">Privacy & Password</button>
        <button className="text-left hover:text-black transition">Help & Support</button>
      </nav>
    </aside>
  );
};

export default Sidebar;
