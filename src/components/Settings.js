import React, { useState } from 'react';
import './HelpSettings.css';

function Settings({ theme, toggleTheme }) {
  const [notifications, setNotifications] = useState(true);

  const handleNotificationChange = () => {
    setNotifications(!notifications);
  };

  return (
    <div className={`settings-container ${theme}`}>
      <h1>Settings</h1>
      <div className="settings-section">
        <h2>Account Preferences</h2>
        <div className="settings-item">
          <label htmlFor="theme-toggle">Theme:</label>
          <button onClick={toggleTheme}>
            {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>
        <div className="settings-item">
          <label htmlFor="notifications">Notifications:</label>
          <input
            type="checkbox"
            id="notifications"
            checked={notifications}
            onChange={handleNotificationChange}
          />
          <span>{notifications ? 'Enabled' : 'Disabled'}</span>
        </div>
      </div>
      <div className="settings-section">
        <h2>Privacy</h2>
        <p>Manage your data and privacy settings here.</p>
      </div>
    </div>
  );
}

export default Settings;
