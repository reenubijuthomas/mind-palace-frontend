import React, { useState } from 'react';
import './HelpSettings.css';

function Settings({ theme, toggleTheme }) {
  const [fontStyle, setFontStyle] = useState('Arial');
  const [fontSize, setFontSize] = useState(16);

  const handleFontStyleChange = (event) => {
    const selectedFont = event.target.value;
    setFontStyle(selectedFont);
    document.body.style.fontFamily = selectedFont;
  };

  const handleFontSizeIncrease = () => {
    if (fontSize < 48) {
      const newSize = fontSize + 1;
      setFontSize(newSize);
      document.body.style.fontSize = `${newSize}px`;
    }
  };

  const handleFontSizeDecrease = () => {
    if (fontSize > 10) {
      const newSize = fontSize - 1;
      setFontSize(newSize);
      document.body.style.fontSize = `${newSize}px`;
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-box">
        <h2 className="settings-title">Settings</h2>

        {/* Theme Toggle */}
        <div className="settings-item">
          <label htmlFor="theme-toggle" className="settings-label">Theme:</label>
          <button onClick={toggleTheme} className="settings-button">
            {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>

        {/* Font Size */}
        <div className="settings-item">
          <label className="settings-label">Font Size:</label>
          <div className="font-size-controls">
            <button onClick={handleFontSizeDecrease} className="settings-button small-button">-</button>
            <span className="font-size-display">{fontSize}px</span>
            <button onClick={handleFontSizeIncrease} className="settings-button small-button">+</button>
          </div>
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
            <option value="Times New Roman">Times New Roman</option>
            <option value="Verdana">Verdana</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
            <option value="Lucida Console">Lucida Console</option>
            <option value="Garamond">Garamond</option>
            <option value="Palatino Linotype">Palatino Linotype</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Settings;
