import React from 'react';
import { FiLock } from 'react-icons/fi';

const PrivacySettings = () => {
  return (
    <div className="flex items-center gap-4 p-6 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition">
      <FiLock className="text-3xl text-purple-500" />
      <div>
        <h3 className="text-lg font-medium">Privacy & Password</h3>
        <p className="text-gray-500 text-sm">Update your privacy and security settings.</p>
      </div>
    </div>
  );
};

export default PrivacySettings;
