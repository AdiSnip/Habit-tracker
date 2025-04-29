import React from 'react';
import { FiLogOut } from 'react-icons/fi';

const LogoutButton = () => {
  const handleLogout = () => {
    alert('Logging out...');
  };

  return (
    <div className="flex justify-center md:justify-end">
      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 bg-red-50 text-red-600 p-3 px-6 rounded-xl border border-red-200 hover:bg-red-100 transition"
      >
        <FiLogOut className="text-2xl" />
        <span className="text-md font-semibold">Logout</span>
      </button>
    </div>
  );
};

export default LogoutButton;
