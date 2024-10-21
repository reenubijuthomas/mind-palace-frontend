import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State to manage error message

  const handleSubmit = (e) => {
    e.preventDefault();
    // Attempt to log in
    onLogin(username, password).then((success) => {
      if (!success) {
        setErrorMessage('Invalid username or password.'); // Show error message
      }
    });
  };

  return (
    <div className="login-container"> {/* Added class for styling */}
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
        <input
          type="text"
          placeholder="User ID"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log in</button>
      </form>
    </div>
  );
};

export default Login;
