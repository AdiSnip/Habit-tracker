import React from 'react';
import { FiBell } from 'react-icons/fi';

const NotificationSettings = () => {
  return (
    <div className="flex items-center gap-4 p-6 border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-black cursor-pointer transition">
      <FiBell className="text-3xl text-emerald-400" />
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-gray-500 text-sm">Manage reminders and alerts.</p>
      </div>
    </div>
  );
};

export default NotificationSettings;
