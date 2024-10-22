import React, { useState } from 'react';
import './Login.css';
import logo from './assets/logo.jpeg'; // Adjust the path as necessary

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error message

  const handleSubmit = (e) => {
    e.preventDefault();

    // Call the onLogin function, expecting it to return a boolean or a promise
    onLogin(username, password)
      .then((isAuthenticated) => {
        if (!isAuthenticated) {
          setError('Invalid credentials. Please try again.'); // Set error message if authentication fails
        } else {
          setError(''); // Clear error if authenticated
        }
      })
      .catch((error) => {
        console.error('Login error:', error); // Log error
        setError('An error occurred during login. Please try again.'); // Set a generic error message
      });
  };

  return (
    <div className="full-screen-background">
      <div className="logo-container">
        <img src={logo} alt="Mind Palace Logo" className="logo" />
      </div>
      <div className="login-container">
        <div className="login-box">
          <div className="title-background">
            <h1 className="login-title">MIND PALACE</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                type="text"
                placeholder="User Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-container">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>} {/* Display error message */}
            <div className="remember-me-container">
              <input type="checkbox" id="remember-me" />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <button type="submit" className="login-button">Log in</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
