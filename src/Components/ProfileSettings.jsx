import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const ProfileSettings = ({data}) => {
  if(!data) return
  return (
    <section className="flex flex-col md:flex-row items-center gap-6 bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition">
      <FaUserCircle className="text-6xl text-blue-600" />
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-semibold">{data[0].firstname + ' ' + data[0].lastname}</h2>
        <p className="text-gray-500">{data[0].email}</p>
      </div>
    </section>
  );
};

export default ProfileSettings;
