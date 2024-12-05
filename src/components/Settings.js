import React, { useState } from 'react';
import './Settings.css';

function Settings({ theme, toggleTheme }) {
  const [fontStyle, setFontStyle] = useState('Arial');
  const [fontSize, setFontSize] = useState('Normal');

  const handleFontStyleChange = (event) => {
    const selectedFont = event.target.value;
    setFontStyle(selectedFont);
    document.body.style.fontFamily = selectedFont;
  };

  const handleFontSizeChange = (event) => {
    const size = event.target.value;
    setFontSize(size);

    const sizeMap = {
      Normal: '16px',
      Medium: '20px',
      Large: '24px',
      'Extra Large': '32px',
    };
    document.body.style.fontSize = sizeMap[size];
  };

  return (
    <div className={`settings-page ${theme}`}>
      <div className="settings-box">
        <h2 className="settings-title">Settings</h2>

        {/* Theme Toggle */}
        <div className="settings-item">
          <label htmlFor="theme-toggle" className="settings-label">Theme:</label>
          <button onClick={toggleTheme} className="settings-button small-button">
            {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>

        {/* Font Size */}
        <div className="settings-item">
          <label htmlFor="font-size" className="settings-label">Font Size:</label>
          <select
            id="font-size"
            value={fontSize}
            onChange={handleFontSizeChange}
            className="settings-select"
          >
            <option value="Normal">Normal</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
            <option value="Extra Large">Extra Large</option>
          </select>
        </div>

        {/* Font Style */}
        <div className="settings-item">
          <label htmlFor="font-style" className="settings-label">Font Style:</label>
          <select
            id="font-style"
            value={fontStyle}
            onChange={handleFontStyleChange}
            className="settings-select"
          >
            <option value="Arial">Arial</option>
            <option value="Verdana">Verdana</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Settings;
