import React, { useState } from 'react';
import './Login.css';
import logo from './assets/logo.jpeg'; 


const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('light'); 

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password)
      .then((isAuthenticated) => {
        if (!isAuthenticated) {
          setError('Invalid credentials. Please try again.');
        } else {
          setError('');
        }
      })
      .catch(() => {
        setError('An error occurred during login. Please try again.');
      });
  };

  return (
    <div className={`full-screen-background ${theme}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        <div className="toggle-container">
          {theme === 'light' ? '🌙' : '🌞'}
        </div>
      </button>
      <div className="login-wrapper">
        <div className={`login-branding ${theme}`}>
        <img src={logo} alt="Mind Palace Logo" className="branding-logo" />

          {/* <h1 className="app-title">MIND PALACE</h1>
          <p className="branding-text">
            Unlock creativity and innovation with ease.
          </p> */}
        </div>
        <div className={`login-form-container ${theme}`}>
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-header">Welcome Back!</h2>
            <div className="input-group">
              <input
                type="text"
                placeholder="User Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-button">Log In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
