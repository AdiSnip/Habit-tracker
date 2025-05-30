// File: /pages/Settings.jsx
import React from 'react';
import ProfileSettings from '../components/ProfileSettings';
import ThemeSettings from '../components/ThemeSettings';
import NotificationSettings from '../components/NotificationSettings';
import PrivacySettings from '../components/PrivacySettings';
import HelpSettings from '../components/HelpSettings';
import LogoutButton from '../Components/LogoutButton';

const Settings = ({data}) => {
  return (
    <div className="min-h-screen text-white bg-black p-8 flex flex-col gap-8">
      <h1 className="text-2xl font-semibold text-white border-b pb-2">Settings</h1>

      <div className="bg-black shadow-md rounded-lg p-4 border border-gray-900">
        <ProfileSettings data={data}/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black shadow-sm border border-gray-900 rounded-md p-4">
          <ThemeSettings />
        </div>
        <div className="bg-black shadow-sm border border-gray-900 rounded-md p-4">
          <NotificationSettings />
        </div>
        <div className="bg-black shadow-sm border border-gray-900 rounded-md p-4">
          <PrivacySettings />
        </div>
        <div className="bg-black shadow-sm border border-gray-900 rounded-md p-4">
          <HelpSettings />
        </div>
      </div>

      <div className="mt-8 bg-black shadow-md border border-gray-900 rounded-md p-4">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Settings;
