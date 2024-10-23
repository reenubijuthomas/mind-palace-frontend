import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IdeaForm from './components/IdeaForm';
import IdeaList from './components/IdeaList';
import Login from './components/Login'; // Import Login component
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserCircle, faCog, faQuestionCircle, faBars } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [ideas, setIdeas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIdea, setEditingIdea] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to manage authentication
  const [userId, setUserId] = useState(null); // Add state for userId
  const [username, setUsername] = useState(''); // Add state for username
  const [dropdownOpen, setDropdownOpen] = useState(false); // Add state for dropdown
  const [menuOpen, setMenuOpen] = useState(false); // Add state for hamburger menu

  useEffect(() => {
    const fetchIdeas = async () => {
      if (!isAuthenticated) return; // Prevent fetching ideas if not authenticated
      try {
        const response = await axios.get('http://localhost:5050/api/ideas');
        setIdeas(response.data);
      } catch (error) {
        console.error('Error fetching ideas:', error);
      }
    };

    fetchIdeas(); // Call fetchIdeas function
  }, [isAuthenticated]); // Fetch ideas when authentication state changes

  const handleAddIdea = async (newIdea) => {
    try {
      const ideaWithCreator = { 
        ...newIdea, 
        createdBy: userId, // Add the userId here
        username: username // Add the username here
      };
      const response = await axios.post('http://localhost:5050/api/ideas', ideaWithCreator);
      response.data.username = username;
      // Add the new idea to the beginning of the list
      setIdeas((prevIdeas) => [response.data, ...prevIdeas]);
    } catch (error) {
      console.error('Error adding new idea:', error);
    }
  }; 
  
  const handleUpdateIdea = async (updatedIdea) => {
    try {
      const ideaWithCreator = { 
        ...updatedIdea, 
        createdBy: userId, // Add the userId here
        username: username // Add the username here
      };
      const response = await axios.put(`http://localhost:5050/api/ideas/${updatedIdea.id}`, ideaWithCreator);
      response.data.username = username;
      console.log(response.data);
      setIdeas((prevIdeas) =>
        prevIdeas.map((idea) => (idea.id === updatedIdea.id ? response.data : idea))
      );
      setEditingIdea(null); // Reset editing state after update
    } catch (error) {
      console.error('Error updating idea:', error);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5050/api/auth/login', { username, password });
      console.log('Login response:', response.data); // Debugging line
      if (response.data.message === 'Login successful') {
        setIsAuthenticated(true);
        // Save userId and username in state
        setUserId(response.data.userId); // Assuming you have a state for userId
        setUsername(response.data.username); // Assuming you have a state for username
        return true; // Indicate successful login
      }
    } catch (error) {
      console.error('Error logging in:', error);
      return false; // Indicate failed login
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5050/api/ideas/${id}`);
      setIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== id));
    } catch (error) {
      console.error('Error deleting idea:', error);
    }
  };

  const handleLike = async (id) => {
    try {
      await axios.post(`http://localhost:5050/api/ideas/${id}/like`);
      const response = await axios.get(`http://localhost:5050/api/ideas/${id}`);
      setIdeas((prevIdeas) =>
        prevIdeas.map((idea) =>
          idea.id === id ? { ...idea, ...response.data } : idea
        )
      );
    } catch (error) {
      console.error('Error liking idea:', error);
    }
  };

  const handleEdit = (idea) => {
    setEditingIdea(idea);
  };

  const filteredIdeas = ideas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // New logout function
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Toggle hamburger menu visibility
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="app-container"> {/* Added class for styling */}
      {isAuthenticated ? (
        <>
          {/* Navigation Bar */}
          <nav className="navbar">
            <div className="side-menu-icon" onClick={toggleMenu}> {/* Moved to the left */}
              <FontAwesomeIcon icon={faBars} />
            </div>
            <h1 className="navbar-title">Mind Palace</h1> {/* Centered title with white color */}
            <div className="nav-user" onClick={toggleDropdown}> {/* Username and dropdown trigger */}
              <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
              <span>{username}</span>
              {dropdownOpen && ( // Conditionally render dropdown
                <div className="dropdown">
                  <a href="#settings" className="dropdown-item">
                    <FontAwesomeIcon icon={faCog} /> Settings
                  </a>
                  <a href="#help" className="dropdown-item">
                    <FontAwesomeIcon icon={faQuestionCircle} /> Help
                  </a>
                  <button onClick={handleLogout} className="dropdown-logout-button">Logout</button>
                </div>
              )}
            </div>
          </nav>

          {/* Side Menu */}
          {menuOpen && ( // Render side menu when hamburger menu is open
            <div className="side-menu">
              <a href="#home" className="side-menu-item">Home</a>
              <a href="#approvals" className="side-menu-item">Approvals</a>
              <a href="#my-ideas" className="side-menu-item">My Ideas</a>
              <a href="#groups" className="side-menu-item">Groups</a>
              <a href="#draft" className="side-menu-item">Draft</a>
              <a href="#bin" className="side-menu-item">Bin</a>
            </div>
          )}

          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="input-container"> {/* Added container for IdeaForm */}
            <IdeaForm onAddIdea={handleAddIdea} editingIdea={editingIdea} onUpdateIdea={handleUpdateIdea} />
          </div>

          <h2>View Ideas</h2>
          <IdeaList 
            ideas={filteredIdeas} 
            handleDelete={handleDelete} 
            handleEdit={handleEdit} 
            handleLike={handleLike} 
            userId={userId} // Pass userId as a prop
            username={username} // Pass username as a prop
          />
        </>
      ) : (
        <Login onLogin={handleLogin} /> // Show the login component if not authenticated
      )}
    </div>
  );
};

export default App;
