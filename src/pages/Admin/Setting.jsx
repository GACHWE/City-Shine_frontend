import React, { useState } from "react";
import Notifications from "../../components/settings/Notifications";
import Password from "../../components/settings/Password";
import Profile from "../../components/settings/Profile";

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "Profile", component: <Profile /> },
    { label: "Password", component: <Password /> },
    { label: "Notifications", component: <Notifications /> },
  ];

  return (
    <div className="pt-20 pb-5 px-96">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Settings
      </h1>
      <div
        className="
          rounded-xl border border-gray-200 dark:border-gray-700 p-5
          bg-white dark:bg-gray-800 shadow-sm
        "
      >
        <div className="w-full mt-3">
          {/* Tabs Navigation */}
          <nav className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`
                  -mb-px px-4 py-2 text-sm font-medium
                  focus:outline-none transition-colors
                  ${
                    activeTab === index
                      ? "border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                      : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Tab Content */}
          <div className="mt-4 p-4">
            {tabs[activeTab].component}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;