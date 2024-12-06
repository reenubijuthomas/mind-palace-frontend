import React, { useState } from "react";

function Settings({ theme, toggleTheme }) {
  const [fontStyle, setFontStyle] = useState("Arial");
  const [fontSize, setFontSize] = useState("Normal");

  const handleFontStyleChange = (event) => {
    const selectedFont = event.target.value;
    setFontStyle(selectedFont);
    document.body.style.fontFamily = selectedFont;
  };

  const handleFontSizeChange = (event) => {
    const size = event.target.value;
    setFontSize(size);

    const sizeMap = {
      Normal: "16px",
      Medium: "18px",
      Large: "20px",
      "Extra Large": "24px",
    };
    document.body.style.fontSize = sizeMap[size];
  };

  return (
    <div
      className={`min-h-screen py-10 px-6 ${theme === "dark"
        ? "bg-gradient-to-b from-[#1e293b] via-[#151f2d] to-[#0f172a] text-[#e2e8f0]"
        : "bg-gradient-to-b from-[#f3f8ff] via-[#d1e3ff] to-[#a9c9ff] text-[#2d3748]"
        }`}
    >
      <div className="pt-24 pb-8 text-center">
        <h1
          className={`
      text-4xl font-extrabold tracking-wide
      ${theme === "dark" ? "text-indigo-300" : "text-indigo-700"}
    `}
        >
          Settings
        </h1>
        <p
          className={`
      mt-4 text-lg font-medium
      ${theme === "dark" ? "text-gray-400" : "text-gray-600"}
    `}
        >
          Customize your preferences and manage your account settings.
        </p>
      </div>

      {/* Settings Box */}
      <div
        className={`max-w-xl mx-auto p-10 rounded-xl shadow-lg transition-all duration-300 ${theme === "dark"
          ? "bg-gray-800 text-gray-200 border-gray-700"
          : "bg-white text-gray-800 border-gray-300"
          }`}
      >

        {/* Theme Toggle */}
        <div className="flex justify-between items-center mb-8">
          <label htmlFor="theme-toggle" className="text-lg font-medium">
            Theme:
          </label>
          <button
            onClick={toggleTheme}
            className={`px-6 py-3 rounded-md text-white transition-colors w-1/3 
              ${theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
        </div>

        {/* Font Size */}
        <div className="flex justify-between items-center mb-8">
          <label htmlFor="font-size" className="text-lg font-medium">
            Font Size:
          </label>
          <select
            id="font-size"
            value={fontSize}
            onChange={handleFontSizeChange}
            className={`px-6 py-3 rounded-md text-white transition-colors w-1/3 
              ${theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"}`}>
            <option value="Normal">Normal</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
            <option value="Extra Large">Extra Large</option>
          </select>
        </div>

        {/* Font Style */}
        <div className="flex justify-between items-center mb-8">
          <label htmlFor="font-style" className="text-lg font-medium">
            Font Style:
          </label>
          <select
            id="font-style"
            value={fontStyle}
            onChange={handleFontStyleChange}
            className={`px-6 py-3 rounded-md text-white transition-colors w-1/3 
              ${theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"}`}
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
