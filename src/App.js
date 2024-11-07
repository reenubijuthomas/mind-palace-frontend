import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IdeaForm from './components/IdeaForm';
import IdeaList from './components/IdeaList';
import Login from './components/Login';
import Drafts from './components/Drafts';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserCircle, faCog, faQuestionCircle, faBars } from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Import Router and Route components
import MyIdeas from './components/MyIdeas'; // Adjust the import path based on your file structure
import Approvals from './components/Approvals'; 
import BinPage from './components/BinPage';  // This import should be correct if the component is in the "components" folder

const App = () => {
  const [ideas, setIdeas] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIdea, setEditingIdea] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to manage authentication
  const [userId, setUserId] = useState(null); // State for userId
  const [username, setUsername] = useState(''); // State for username
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown
  const [menuOpen, setMenuOpen] = useState(false); // State for hamburger menu
  const [roleId, setRole] = useState(null);  // Add state to store user role
  
  useEffect(() => {
    const fetchIdeas = async () => {
      if (!isAuthenticated) return; // Prevent fetching ideas if not authenticated
      try {
        const response = await axios.get('http://localhost:5050/api/ideas?is_draft=false');
        setIdeas(response.data);
      } catch (error) {
        console.error('Error fetching ideas:', error);
      }
    };

    // Poll every 5 seconds for updated ideas
    const interval = setInterval(fetchIdeas, 1000);
    fetchIdeas(); // Call fetchIdeas function
    return () => clearInterval(interval); // Cleanup on component unmount

  }, [isAuthenticated]); // Fetch ideas when authentication state changes

  const handleAddIdea = async (newIdea) => {
    try {
      const ideaWithCreator = {
        ...newIdea,
        createdBy: userId, // Add the userId here
        username: username
      };
      const response = await axios.post('http://localhost:5050/api/ideas', ideaWithCreator);
      response.data.username = username;
      setIdeas((prevIdeas) => [response.data, ...prevIdeas]); // Add the new idea to the beginning of the list
    } catch (error) {
      console.error('Error adding new idea:', error);
    }
  };

  const handleAddDraft = async (newDraft) => {
    try {
      const draftWithCreator = {
        ...newDraft,
        createdBy: userId,
        username: username
      };
      const response = await axios.post('http://localhost:5050/api/ideas', draftWithCreator);
      response.data.username = username;
      
      // Update drafts state instead of ideas state
      setDrafts((prevDrafts) => [response.data, ...prevDrafts]);
  
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const handleUpdateIdea = async (updatedIdea) => {
    try {
      const ideaWithCreator = {
        ...updatedIdea,
        createdBy: userId,
        username: username
      };
      const response = await axios.put(`http://localhost:5050/api/ideas/${updatedIdea.id}`, ideaWithCreator);
      response.data.username = username;
      setIdeas((prevIdeas) =>
        prevIdeas.map((idea) => (idea.id === updatedIdea.id ? response.data : idea))
      );
      setEditingIdea(null); 
  
      return response.data; 
    } catch (error) {
      console.error('Error updating idea:', error);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5050/api/auth/login', { username, password });
      if (response.data.message === 'Login successful') {
        setIsAuthenticated(true);
        setUserId(response.data.userId); // Set userId
        setUsername(response.data.username); // Set username
        setRole(response.data.roleId);  // Store the user's role
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

  const filteredIdeas = ideas.filter(
    (idea) =>
      !idea.is_draft && 
      (idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       idea.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Router> {/* Wrap everything in Router */}
      <div className="app-container">
        {isAuthenticated ? (
          <>
            {/* Navigation Bar */}
            <nav className="navbar">
              <div className="side-menu-icon" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} />
              </div>
              <h1 className="navbar-title">Mind Palace</h1>
              <div className="nav-user" onClick={toggleDropdown}>
                <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
                <span>{username}</span>
                {dropdownOpen && (
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
            {menuOpen && (
              <div className="side-menu">
                {/* Use Link component to navigate */}
                <Link to="/" className="side-menu-item">Home</Link>
                
                {/* Only render the Approvals link if the user's role is 3 */}
                {roleId === 3 && (
                  <Link to="/approvals" className="side-menu-item">Approvals</Link>
                )}
                
                <Link to="/my-ideas" className="side-menu-item">My Ideas</Link>
                <Link to="/groups" className="side-menu-item">Groups</Link>
                <Link to="/draft" className="side-menu-item">Draft</Link>
                <Link to="/bin" className="side-menu-item">Bin</Link>
              </div>
            )}

            <Routes> {/* Define routes for different pages */}
              {/* Home Route with IdeaForm and IdeaList */}
              <Route
                path="/"
                element={
                  <>
            <div className="search-bar">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search ideas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="input-container">
              <IdeaForm onAddIdea={handleAddIdea} onAddDraft={handleAddDraft} editingIdea={editingIdea} onUpdateIdea={handleUpdateIdea} />
            </div>
                    <h2>View Ideas</h2>
                    <IdeaList
                      ideas={filteredIdeas}
                      handleDelete={handleDelete}
                      handleEdit={handleUpdateIdea}
                      handleLike={handleLike}
                      userId={userId} // Pass userId as prop
                      username={username} // Pass username as prop
                    />
                  </>
                }
              />
              {/* Other Routes for Approvals, My Ideas, etc. */}
              <Route path="/approvals" element={<Approvals/>} />
              <Route path="/draft" element={<Drafts drafts={drafts} setDrafts={setDrafts} userId={userId} username={username} handleDelete={handleDelete}
                  handleEdit={handleUpdateIdea} /> } />
              <Route path="/my-ideas" element={<MyIdeas userId={userId} handleDelete={handleDelete} handleEdit={handleUpdateIdea} handleLike={handleLike} />} />
              <Route path="/groups" element={<div>Groups Page</div>} />
              <Route path="/bin" element={<BinPage userId={userId}/>} />
            </Routes>
          </>
        ) : (
          <Login onLogin={handleLogin} /> // Show the login component if not authenticated
        )}
      </div>
    </Router>
  );
};

export default App;
