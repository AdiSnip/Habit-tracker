import React from 'react';
import { FaPalette } from 'react-icons/fa';

const ThemeSettings = () => {
  return (
    <div className="flex items-center gap-4 p-6 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition">
      <FaPalette className="text-3xl text-red-400" />
      <div>
        <h3 className="text-lg font-medium">Theme & Appearance</h3>
        <p className="text-gray-500 text-sm">Customize your app's look.</p>
      </div>
    </div>
  );
};

export default ThemeSettings;
