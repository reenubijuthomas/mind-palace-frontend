import React, { useState, useEffect } from "react";
import { Moon, Sun, User, Lock } from "lucide-react";
import logo from "./assets/logo.jpeg";

const Login = ({ onLogin }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("loginTheme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    } else {
      setIsDarkMode(systemPrefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("loginTheme", newMode ? "dark" : "light");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const isAuthenticated = await onLogin(credentials.username, credentials.password);

      if (!isAuthenticated) {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-colors duration-300 z-50 ${
        isDarkMode ? "dark-gradient-bg" : "light-gradient-bg"
      }`}
    >
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full shadow-lg transition-all ${
            isDarkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-white/80 text-blue-600 hover:bg-blue-100"
          }`}
        >
          {isDarkMode ? <Sun /> : <Moon />}
        </button>
      </div>

      {/* Login Form Container */}
      <div
        className={`rounded-3xl shadow-2xl w-full max-w-lg px-10 py-12 transition-colors ${
          isDarkMode
            ? "bg-gray-800/80 border border-gray-700"
            : "bg-white/90 border border-gray-300 shadow-lg"
        }`}
      >
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div
            className={`w-24 h-24 rounded-full shadow-lg flex items-center justify-center overflow-hidden ${
              isDarkMode
                ? "bg-gradient-to-r from-gray-600 to-gray-700"
                : "bg-gradient-to-r from-blue-400 to-blue-600"
            }`}
          >
            <img
              src={logo}
              alt="Mind Palace Logo"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Title */}
          <h1
            className={`text-3xl font-extrabold mt-6 tracking-wide text-center ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Mind Palace
          </h1>

          {/* Subtitle */}
          <p
            className={`mt-3 text-base text-center ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Welcome back! Please log in to continue.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          {/* Username Input */}
          <div className="relative">
            <User
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? "text-gray-400" : "text-blue-500"
              }`}
            />
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Username"
              className={`w-full px-12 py-4 text-lg rounded-full focus:outline-none focus:ring ${
                isDarkMode
                  ? "bg-gray-700 text-white border-gray-600 focus:ring-gray-500"
                  : "bg-white border-gray-300 text-gray-800 focus:ring-blue-400"
              } border`}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? "text-gray-400" : "text-blue-500"
              }`}
            />
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Password"
              className={`w-full px-12 py-4 text-lg rounded-full focus:outline-none focus:ring ${
                isDarkMode
                  ? "bg-gray-700 text-white border-gray-600 focus:ring-gray-500"
                  : "bg-white border-gray-300 text-gray-800 focus:ring-blue-400"
              } border`}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-center mt-2">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-4 text-lg font-semibold rounded-full text-white shadow-md transition-all ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
