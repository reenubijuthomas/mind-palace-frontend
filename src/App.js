import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IdeaForm from './components/IdeaForm';
import IdeaList from './components/IdeaList';
import Login from './components/Login'; // Import Login component
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [ideas, setIdeas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIdea, setEditingIdea] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to manage authentication

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
      response.data.username = username
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
      response.data.username = username
      console.log(response.data)
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
  
  // Add state for userId and username
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');

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
      
      console.log('Updated Idea Data:', response.data); // Log the fetched updated data
  
      setIdeas((prevIdeas) => {
        console.log('Previous Ideas:', prevIdeas); // Log the previous state
        return prevIdeas.map((idea) =>
          idea.id === id ? { ...idea, ...response.data } : idea
        );
      });
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

  return (
    <div className="app-container"> {/* Added class for styling */}
      <div className="header-container"> {/* Added a container for the heading */}
        <h1 className="mind-palace-title">Mind Palace</h1> {/* Added class for styling */}
      </div>
      {isAuthenticated ? (
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
        
          {/* Logout Button */}
          <button onClick={handleLogout} style={{ marginTop: '20px', padding: '10px', borderRadius: '8px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}>
            Logout
          </button>
        </>
      ) : (
        <Login onLogin={handleLogin} /> // Show the login component if not authenticated
      )}
    </div>
  );
};

export default App;
