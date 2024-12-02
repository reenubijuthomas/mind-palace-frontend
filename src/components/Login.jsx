import React, { useState, useEffect } from "react";
import { Moon, Sun, User, Lock } from "lucide-react";

const Login = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(systemPrefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", credentials);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 
      ${isDarkMode 
        ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white' 
        : 'bg-gradient-to-b from-purple-300 via-purple-400 to-purple-500'
      }`}>
      
      <div className="absolute top-4 right-4">
        <button 
          onClick={toggleTheme}
          className={`p-3 rounded-full shadow-lg transition-all 
            ${isDarkMode 
              ? 'bg-gray-700 text-white hover:bg-gray-600' 
              : 'bg-white/80 text-purple-600 hover:bg-purple-100'
            }`}
        >
          {isDarkMode ? <Sun /> : <Moon />}
        </button>
      </div>

      <div className={`rounded-2xl shadow-xl p-8 w-full max-w-md transition-colors
        ${isDarkMode 
          ? 'bg-gray-800/80 border border-gray-700' 
          : 'bg-white/80'
        }`}>
        
        <div className="flex flex-col items-center">
          <div className={`w-24 h-24 rounded-full shadow-lg flex items-center justify-center
            ${isDarkMode 
              ? 'bg-gradient-to-r from-gray-600 to-gray-700' 
              : 'bg-gradient-to-r from-purple-400 to-purple-600'
            }`}>
            <span className="text-white text-2xl font-bold">MP</span>
          </div>
          
          <h1 className={`text-3xl font-bold mt-4 
            ${isDarkMode ? 'text-gray-200' : 'text-purple-600'}`}>
            Mind Palace
          </h1>
          
          <p className={`mt-2 
            ${isDarkMode ? 'text-gray-400' : 'text-purple-500'}`}>
            Welcome back! Please login.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <User className={`absolute left-3 top-3.5 
              ${isDarkMode ? 'text-gray-400' : 'text-purple-500'}`} />
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Username"
              className={`w-full px-10 py-3 rounded-xl 
                ${isDarkMode 
                  ? 'bg-gray-700 text-white border-gray-600 focus:ring-gray-500' 
                  : 'border-purple-300 focus:ring-purple-400'
                }
                border focus:outline-none focus:ring`}
            />
          </div>

          <div className="relative">
            <Lock className={`absolute left-3 top-3.5 
              ${isDarkMode ? 'text-gray-400' : 'text-purple-500'}`} />
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Password"
              className={`w-full px-10 py-3 rounded-xl 
                ${isDarkMode 
                  ? 'bg-gray-700 text-white border-gray-600 focus:ring-gray-500' 
                  : 'border-purple-300 focus:ring-purple-400'
                }
                border focus:outline-none focus:ring`}
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-xl text-white shadow-md transition-all
              ${isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-purple-600 hover:bg-purple-700'
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