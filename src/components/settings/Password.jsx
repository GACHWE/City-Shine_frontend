// src/components/settings/Password.jsx

import React, { useState } from "react";

const Password = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [status, setStatus] = useState(null);

  const handleChangePassword = (e) => {
    e.preventDefault();
    setStatus(null); // Clear previous status

    if (newPassword !== confirmNewPassword) {
      setStatus({ type: "error", message: "New passwords do not match." });
      return;
    }

    // In a real app, you would send this data to your backend
    console.log("Changing password:", { currentPassword, newPassword });
    setStatus({ type: "success", message: "Password changed successfully!" });

    // Clear form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  return (
    <form onSubmit={handleChangePassword} className="space-y-6 max-w-lg">
      <div>
        <label
          htmlFor="current-password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Current Password
        </label>
        <input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 focus:outline-none dark:text-gray-100"
          required
        />
      </div>

      <div>
        <label
          htmlFor="new-password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          New Password
        </label>
        <input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 focus:outline-none dark:text-gray-100"
          required
        />
      </div>

      <div>
        <label
          htmlFor="confirm-new-password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Confirm New Password
        </label>
        <input
          id="confirm-new-password"
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 focus:outline-none dark:text-gray-100"
          required
        />
      </div>

      {status && (
        <p
          className={`text-sm ${
            status.type === "success"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {status.message}
        </p>
      )}

      <div>
        <button
          type="submit"
          className="mt-2 px-4 py-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Change Password
        </button>
      </div>
    </form>
  );
};

export default Password;