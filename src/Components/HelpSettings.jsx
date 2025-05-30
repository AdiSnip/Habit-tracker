import React from 'react';
import { FiHelpCircle } from 'react-icons/fi';

const HelpSettings = () => {
  return (
    <div className="flex items-center gap-4 p-6 border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-black cursor-pointer transition">
      <FiHelpCircle className="text-3xl text-blue-400" />
      <div>
        <h3 className="text-lg font-medium">Help & Support</h3>
        <p className="text-gray-500 text-sm">Get support or find FAQs.</p>
      </div>
    </div>
  );
};

export default HelpSettings;
