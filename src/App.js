import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IdeaForm from './components/IdeaForm';
import IdeaList from './components/IdeaList';
import Login from './components/Login';
import Drafts from './components/Drafts';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserCircle, faCog, faQuestionCircle, faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyIdeas from './components/MyIdeas';
import Approvals from './components/Approvals';
import BinPage from './components/BinPage';
import GroupsPage from './components/GroupsPage'; //ardra edit 1
import CategoryPage from './components/CategoryPage'; //ardra edit 2
import { NavLink } from 'react-router-dom';
import { faHome, faThumbsUp, faLightbulb, faUsers, faFileAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [ideas, setIdeas] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIdea, setEditingIdea] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [userId, setUserId] = useState(null); 
  const [username, setUsername] = useState(''); 
  const [menuOpen, setMenuOpen] = useState(true); 
  const [roleId, setRole] = useState(null);  

  useEffect(() => {
    const fetchIdeas = async () => {
      if (!isAuthenticated) return; 
      try {
        const response = await axios.get('http://localhost:5050/api/ideas?is_draft=false&&isApproved=2');
        const ideasWithCategories = await Promise.all(response.data.map(async (idea) => {
          const categories = await fetchCategoriesForIdea(idea.id);
          return { ...idea, categories };
        }));
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
      tagIdea(response.data.id); 
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
                <div className="side-menu-main">
                  <NavLink to="/" activeClassName="active" className="side-menu-item">
                    <FontAwesomeIcon icon={faHome} className="menu-icon" /> <span>Home</span>
                  </NavLink>
                  {(roleId === 3 || roleId === 1) && (
                    <NavLink to="/approvals" activeClassName="active" className="side-menu-item">
                      <FontAwesomeIcon icon={faThumbsUp} className="menu-icon" /> <span>Approvals</span>
                    </NavLink>
                  )}
                  <NavLink to="/my-ideas" activeClassName="active" className="side-menu-item">
                    <FontAwesomeIcon icon={faLightbulb} className="menu-icon" /> <span>My Ideas</span>
                  </NavLink>
                  <NavLink to="/groups" activeClassName="active" className="side-menu-item">
                    <FontAwesomeIcon icon={faUsers} className="menu-icon" /> <span>Groups</span>
                  </NavLink>
                  <NavLink to="/draft" activeClassName="active" className="side-menu-item">
                    <FontAwesomeIcon icon={faFileAlt} className="menu-icon" /> <span>My Drafts</span>
                  </NavLink>
                  <NavLink to="/bin" activeClassName="active" className="side-menu-item">
                    <FontAwesomeIcon icon={faTrash} className="menu-icon" /> <span>My Bin</span>
                  </NavLink>
                </div>

                <div className="side-menu-bottom">
                  <NavLink to="/settings" className="side-menu-item">
                    <FontAwesomeIcon icon={faCog} className="menu-icon" /> <span>Settings</span>
                  </NavLink>
                  <NavLink to="/help" className="side-menu-item">
                    <FontAwesomeIcon icon={faQuestionCircle} className="menu-icon" /> <span>Help</span>
                  </NavLink>
                  <button onClick={handleLogout} className="side-menu-logout">
                    <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" /> <span>Logout</span>
                  </button>
                </div>
              </div>
            )}

            <div className={`main-content ${menuOpen ? "shifted" : ""}`}>
              <nav className="navbar">
                <div className="side-menu-icon" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} className="side-menu-icon" onClick={toggleMenu} />
                </div>
                <h1 className="navbar-title">MIND PALACE</h1>
                <div className="nav-user">
                  <FontAwesomeIcon icon={faUserCircle} className="user-icon" />
                  <span>{username}</span>
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
                      <div className="ideas-section">
                        <h2>View Ideas</h2>
                        <IdeaList
                          ideas={filteredIdeas}
                          handleDelete={handleDelete}
                          handleEdit={handleUpdateIdea}
                          handleLike={handleLike}
                          userId={userId}
                          username={username}
                        />
                      </div>
                    </>
                  }
                />
                <Route path="/approvals" element={<Approvals userId={userId} />} />
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
                <Route path="/groups" element={<GroupsPage />} /> 
                <Route path="/groups/:categoryName/:categoryID" element={<CategoryPage />} />
                <Route path="/bin" element={<BinPage userId={userId} />} />
                <Route path="/settings" element={<div>Settings Page</div>} />
                <Route path="/help" element={<div>Help Page</div>} />
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