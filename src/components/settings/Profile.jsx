// src/components/settings/Profile.jsx

import React, { useState, useRef } from "react";
import {  BiImport } from "react-icons/bi";

const Profile = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [profilePicture, setProfilePicture] = useState(
    "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  );
  const fileInputRef = useRef(null);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log("Saving profile settings:", { name, email, profilePicture });
    setSaveStatus("Profile saved!");
    setTimeout(() => setSaveStatus(null), 3000); // Clear message after 3 seconds
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-xl">
      {/* Profile Picture */}
      <div className="flex items-center space-x-6">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
          <img
            src={profilePicture}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Profile Picture
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            JPG, PNG and GIF images are allowed.
          </p>
          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/gif"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="mt-2 flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-gray-800 dark:text-gray-100"
          >
            <BiImport /> Upload
          </button>
        </div>
      </div>

      {/* Name and Email */}
      <div>
        <label
          htmlFor="profile-name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Full Name
        </label>
        <input
          id="profile-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 focus:outline-none dark:text-gray-100"
        />
      </div>

      <div>
        <label
          htmlFor="profile-email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Email Address
        </label>
        <input
          id="profile-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 focus:outline-none dark:text-gray-100"
        />
      </div>

      <div className="flex items-center justify-between pt-4">
        {saveStatus && (
          <p className="text-sm text-green-600 dark:text-green-400">
            {saveStatus}
          </p>
        )}
        <button
          type="submit"
          className="ml-auto px-4 py-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Save Profile
        </button>
      </div>
    </form>
  );
};

export default Profile;