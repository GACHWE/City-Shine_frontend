// src/components/settings/Notifications.jsx

import React, { useState } from "react";

const Notifications = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSave = () => {
    // In a real application, you would send this data to your backend
    console.log("Saving notification settings:", {
      emailNotifications,
      pushNotifications,
    });
    setSaveStatus("Settings saved!");
    setTimeout(() => setSaveStatus(null), 3000); // Clear message after 3 seconds
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Email Notifications
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Receive important updates and announcements via email.
        </p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enable Email Notifications
          </p>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
              className="sr-only peer"
            />
            <div
              className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 
              peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 
              after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
            ></div>
          </label>
        </div>
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Push Notifications
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get real-time alerts on your browser or device.
        </p>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enable Push Notifications
          </p>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={pushNotifications}
              onChange={() => setPushNotifications(!pushNotifications)}
              className="sr-only peer"
            />
            <div
              className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 
              peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 
              after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
            ></div>
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        {saveStatus && (
          <p className="text-sm text-green-600 dark:text-green-400">
            {saveStatus}
          </p>
        )}
        <button
          onClick={handleSave}
          className="ml-auto px-4 py-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Notifications;