import React, { useState } from "react";

function Settings({ theme, toggleTheme }) {
  const [notifications, setNotifications] = useState(true);

  const handleNotificationChange = () => {
    setNotifications(!notifications);
  };

  return (
    <div
      className={`p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 dark:text-gray-100 rounded shadow`}
    >
      <h1 className="text-3xl font-bold text-center mb-8">Settings</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Account Preferences</h2>
        <div className="flex justify-between items-center mb-4">
          <label htmlFor="theme-toggle" className="font-semibold">
            Theme:
          </label>
          <button
            onClick={toggleTheme}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
        </div>
        <div className="flex justify-between items-center">
          <label htmlFor="notifications" className="font-semibold">
            Notifications:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="notifications"
              checked={notifications}
              onChange={handleNotificationChange}
              className="w-5 h-5 accent-blue-500"
            />
            <span>{notifications ? "Enabled" : "Disabled"}</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Privacy</h2>
        <p>Manage your data and privacy settings here.</p>
      </div>
    </div>
  );
}

export default Settings;
