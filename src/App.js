import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IdeaForm from './components/IdeaForm';
import IdeaList from './components/IdeaList';
import Login from './components/Login';
import Drafts from './components/Drafts';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserCircle, faCog, faQuestionCircle, faBars } from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyIdeas from './components/MyIdeas';
import Approvals from './components/Approvals';
import BinPage from './components/BinPage';
import { NavLink } from 'react-router-dom';

const App = () => {
  const [ideas, setIdeas] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIdea, setEditingIdea] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [userId, setUserId] = useState(null); 
  const [username, setUsername] = useState(''); 
  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const [menuOpen, setMenuOpen] = useState(true); 
  const [roleId, setRole] = useState(null);  

  useEffect(() => {
    const fetchIdeas = async () => {
      if (!isAuthenticated) return; 
      try {
        const response = await axios.get('http://localhost:5050/api/ideas?is_draft=false');
        const ideasWithCategories = await Promise.all(response.data.map(async (idea) => {
          const categories = await fetchCategoriesForIdea(idea.id);
          return { ...idea, categories };
        }));
        console.log(ideasWithCategories)
        setIdeas(ideasWithCategories);
  
      } catch (error) {
        console.error('Error fetching ideas:', error);
      }
    };
  
    const interval = setInterval(fetchIdeas, 800);
    fetchIdeas(); 
    return () => clearInterval(interval); 
  
  }, [isAuthenticated]);

  const fetchCategoriesForIdea = async (ideaId) => {
    try {
      const response = await axios.get(`http://localhost:5050/api/tags/getTags/${ideaId}`);
      return response.data.categories || [];
    } catch (error) {
      console.error(`Error fetching categories for idea ${ideaId}:`, error);
      return [];
    }
  };

  const handleAddIdea = async (newIdea) => {
    try {
      const ideaWithCreator = {
        ...newIdea,
        createdBy: userId, 
        username: username
      };
      const response = await axios.post('http://localhost:5050/api/ideas', ideaWithCreator);
      response.data.username = username;
      setIdeas((prevIdeas) => [response.data, ...prevIdeas]);
      tagIdea(response.data.id); 
    } catch (error) {
      console.error('Error adding new idea:', error);
    }
  };

  const tagIdea = async (ideaId) => {
    try {
      axios.get(`http://localhost:5050/api/tags/updateTags/${ideaId}`);
    } catch (error) {
      console.error('Error tagging idea:', error);
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
        setUserId(response.data.userId); 
        setUsername(response.data.username); 
        setRole(response.data.roleId);  
        return true; 
      }
    } catch (error) {
      console.error('Error logging in:', error);
      return false; 
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

  const filteredIdeas = ideas.filter((idea) => {
    const titleMatch = idea.title.toLowerCase().includes(searchTerm.toLowerCase());
    const descriptionMatch = idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = idea.categories?.some((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return !idea.is_draft && (titleMatch || descriptionMatch || categoryMatch);
  });

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
    <Router> 
      <div className="app-container">
        {isAuthenticated ? (
          <>
            {menuOpen && (
              <div className="side-menu">
                <NavLink to="/" activeClassName="active" className="side-menu-item">Home</NavLink>

                {(roleId === 3 || roleId === 1) && (
                  <NavLink to="/approvals" activeClassName="active" className="side-menu-item">Approvals</NavLink>
                )}

                <NavLink to="/my-ideas" activeClassName="active" className="side-menu-item">My Ideas</NavLink>
                <NavLink to="/groups" activeClassName="active" className="side-menu-item">Groups</NavLink>
                <NavLink to="/draft" activeClassName="active" className="side-menu-item">Drafts</NavLink>
                <NavLink to="/bin" activeClassName="active" className="side-menu-item">Bin</NavLink>
              </div>
            )}

            <div className={`main-content ${menuOpen ? "shifted" : ""}`}>
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
              <Routes>
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
                        userId={userId} 
                        username={username} 
                      />
                    </>
                  }
                />
                <Route path="/approvals" element={<Approvals />} />
                <Route
                  path="/draft"
                  element={
                    <Drafts
                      drafts={drafts}
                      setDrafts={setDrafts}
                      userId={userId}
                      username={username}
                      handleDelete={handleDelete}
                      handleEdit={handleUpdateIdea}
                    />
                  }
                />
                <Route
                  path="/my-ideas"
                  element={
                    <MyIdeas
                      userId={userId}
                      handleDelete={handleDelete}
                      handleEdit={handleUpdateIdea}
                      handleLike={handleLike}
                    />
                  }
                />
                <Route path="/groups" element={<div>Groups Page</div>} />
                <Route path="/bin" element={<BinPage userId={userId} />} />
              </Routes>
            </div>
          </>
        ) : (
          <Login onLogin={handleLogin} /> 
        )}
      </div>
    </Router>

  );
};

export default App;
