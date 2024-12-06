import React, { useEffect, useState } from "react";
import axios from "axios";
import IdeaForm from "./components/IdeaForm";
import IdeaList from "./components/IdeaList";
import Login from "./components/Login";
import Drafts from "./components/Drafts";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MyIdeas from "./components/MyIdeas";
import Approvals from "./components/Approvals";
import BinPage from "./components/BinPage";
import GroupsPage from "./components/GroupsPage";
import CategoryPage from "./components/CategoryPage";
import Navbar from "./components/Navbar";
import Help from "./components/Help";
import Settings from "./components/Settings";
import "./index.css";
import BASE_URL from "./config.jsx";
import 'font-awesome/css/font-awesome.min.css';

const App = () => {
  const [ideas, setIdeas] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingIdea, setEditingIdea] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [menuOpen, setMenuOpen] = useState(true);
  const [roleId, setRole] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark" : "light";
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const storedSession = JSON.parse(localStorage.getItem("loginSession"));
    if (storedSession) {
      const { username, password, expiry } = storedSession;
      if (new Date().getTime() < expiry) {
        setIsAuthenticated(true);
        setUsername(username);
        setUserId(storedSession.userId);
        setRole(storedSession.roleId);
      } else {
        localStorage.removeItem("loginSession");
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const fetchIdeas = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await axios.get(`${BASE_URL}/api/ideas?is_draft=false&&isApproved=2`);
        const ideasWithCategories = await Promise.all(
          response.data.map(async (idea) => {
            const categories = await fetchCategoriesForIdea(idea.id);
            return { ...idea, categories };
          })
        );
        setIdeas(ideasWithCategories);
      } catch (error) {
        console.error("Error fetching ideas:", error);
      }
    };

    const interval = setInterval(fetchIdeas, 500);
    fetchIdeas();
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const fetchCategoriesForIdea = async (ideaId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/tags/getTags/${ideaId}`);
      return response.data.categories || [];
    } catch (error) {
      console.error(`Error fetching categories for idea ${ideaId}:`, error);
      return [];
    }
  };

  const handleLike = async (id) => {
    try {
      await axios.post(`${BASE_URL}/api/ideas/${id}/like`);
      const response = await axios.get(`${BASE_URL}/api/ideas/${id}`);
      setIdeas((prevIdeas) =>
        prevIdeas.map((idea) =>
          idea.id === id ? { ...idea, ...response.data } : idea
        )
      );
    } catch (error) {
      console.error('Error liking idea:', error);
    }
  };

  const handleAddIdea = async (newIdea) => {
    try {
      const ideaWithCreator = { ...newIdea, createdBy: userId, username: username };
      const response = await axios.post(`${BASE_URL}/api/ideas`, ideaWithCreator);
      response.data.username = username;
      setIdeas((prevIdeas) => [response.data, ...prevIdeas]);
      tagIdea(response.data.id);
    } catch (error) {
      console.error("Error adding new idea:", error);
    }
  };

  const tagIdea = async (ideaId) => {
    try {
      axios.get(`${BASE_URL}/api/tags/updateTags/${ideaId}`);
    } catch (error) {
      console.error('Error tagging idea:', error);
    }
  };

  const handleAddDraft = async (newDraft) => {
    try {
      const draftWithCreator = { ...newDraft, createdBy: userId, username: username };
      const response = await axios.post(`${BASE_URL}/api/ideas`, draftWithCreator);
      response.data.username = username;
      setDrafts((prevDrafts) => [response.data, ...prevDrafts]);
      tagIdea(response.data.id);
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  const handleUpdateIdea = async (updatedIdea) => {
    try {
      const ideaWithCreator = { ...updatedIdea, createdBy: userId, username: username };
      const response = await axios.put(`${BASE_URL}/api/ideas/${updatedIdea.id}`, ideaWithCreator);
      response.data.username = username;
      setIdeas((prevIdeas) => prevIdeas.map((idea) => (idea.id === updatedIdea.id ? response.data : idea)));
      setEditingIdea(null);
      return response.data;
    } catch (error) {
      console.error("Error updating idea:", error);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, { username, password });
      if (response.data.message === "Login successful") {
        setIsAuthenticated(true);
        setUserId(response.data.userId);
        setUsername(response.data.username);
        setRole(response.data.roleId);
        const expiry = new Date().getTime() + 24 * 60 * 60 * 1000;
        localStorage.setItem(
          "loginSession",
          JSON.stringify({
            username: response.data.username,
            password,
            userId: response.data.userId,
            roleId: response.data.roleId,
            expiry,
          })
        );
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error logging in:", error);
      return false;
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/ideas/${id}`);
      setIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== id));
    } catch (error) {
      console.error("Error deleting idea:", error);
    }
  };

  const filteredIdeas = ideas.filter((idea) => {
    const titleMatch = idea.title.toLowerCase().includes(searchTerm.toLowerCase());
    const descriptionMatch = idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = idea.categories?.some((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return !idea.is_draft && (titleMatch || descriptionMatch || categoryMatch);
  });

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("loginSession");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Router>
      <div className={`app-container ${theme}`}>
        {isAuthenticated ? (
          <>
            <Navbar
              theme={theme}
              toggleTheme={toggleTheme}
              username={username}
              menuOpen={menuOpen}
              toggleMenu={toggleMenu}
              handleLogout={handleLogout}
              roleId={roleId}
            />
            <div className={`main-content ${menuOpen ? "lg:ml-64" : ""} transition-all`}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <div className="input-container p-3">
                        <IdeaForm
                          onAddIdea={handleAddIdea}
                          onAddDraft={handleAddDraft}
                          editingIdea={editingIdea}
                          onUpdateIdea={handleUpdateIdea}
                          theme={theme}
                        />
                      </div>

                      {/* Title Section */}
                      <div className="pt-12 pb-6 text-center"> {/* Reduced pt-24 to pt-12 */}
                        <h1
                          className={`text-3xl font-extrabold tracking-wide
    ${theme === "dark" ? "text-indigo-300" : "text-indigo-700"}`}
                        >
                          View Ideas
                        </h1>
                      </div>

                      {/* Search Bar */}
                      <div className="search-bar mx-auto mt-4">
                        <i className="fa fa-search search-icon"></i>
                        <input
                          type="text"
                          placeholder="Search ideas..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className={`search-input ${theme === "dark" ? "dark-search-bar" : "light-search-bar"}`}
                        />
                      </div>

                      <IdeaList
                        ideas={filteredIdeas}
                        handleDelete={handleDelete}
                        handleEdit={handleUpdateIdea}
                        handleLike={handleLike}
                        userId={userId}
                        username={username}
                        isDarkMode={theme === "dark"}
                      />
                    </>
                  }
                />
                <Route path="/approvals" element={<Approvals userId={userId} theme={theme} />} />
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
                      theme={theme}
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
                      theme={theme}
                    />
                  }
                />
                <Route path="/groups" element={<GroupsPage theme={theme} />} />
                <Route path="/groups/:categoryName/:categoryID" element={<CategoryPage
                  theme={theme}
                  userId={userId}
                  handleDelete={handleDelete}
                  handleEdit={handleUpdateIdea} 
                  handleLike={handleLike}
                  />} />
                <Route path="/bin" element={<BinPage userId={userId} theme={theme} />} />
                <Route path="/settings" element={<Settings theme={theme} toggleTheme={toggleTheme} />} />
                <Route path="/help" element={<Help theme={theme} />} />
              </Routes>
            </div>
          </>
        ) : (
          <Login onLogin={handleLogin} theme={theme} />
        )}
      </div>
    </Router>
  );
};

export default App;
