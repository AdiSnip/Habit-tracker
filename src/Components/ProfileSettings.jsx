import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const ProfileSettings = () => {
  return (
    <section className="flex flex-col md:flex-row items-center gap-6 bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
      <FaUserCircle className="text-6xl text-blue-600" />
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-semibold">John Doe</h2>
        <p className="text-gray-500">johndoe@example.com</p>
      </div>
    </section>
  );
};

export default ProfileSettings;
