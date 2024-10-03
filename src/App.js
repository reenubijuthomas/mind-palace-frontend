// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IdeaForm from './components/IdeaForm';
import IdeaList from './components/IdeaList';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const [ideas, setIdeas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIdea, setEditingIdea] = useState(null); // State to manage the idea being edited

  // Fetch ideas from the backend
  const fetchIdeas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ideas');
      setIdeas(response.data);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  // Handle adding a new idea
  const handleAddIdea = async (newIdea) => {
    try {
      const response = await axios.post('http://localhost:5000/api/ideas', newIdea);
      setIdeas((prevIdeas) => [...prevIdeas, response.data]);
    } catch (error) {
      console.error('Error adding new idea:', error);
    }
  };

  // Handle deleting an idea
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/ideas/${id}`);
      setIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== id));
    } catch (error) {
      console.error('Error deleting idea:', error);
    }
  };

  // Handle updating an idea
  const handleUpdateIdea = async (updatedIdea) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/ideas/${updatedIdea.id}`, updatedIdea);
      setIdeas((prevIdeas) =>
        prevIdeas.map((idea) => (idea.id === updatedIdea.id ? response.data : idea))
      );
      setEditingIdea(null); // Reset editing state after update
    } catch (error) {
      console.error('Error updating idea:', error);
    }
  };

  // Handle setting the idea to be edited
  const handleEdit = (idea) => {
    setEditingIdea(idea); // Set the selected idea to the editing state
  };

  // Filter ideas based on search term
  const filteredIdeas = ideas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Mind Palace</h1>
      {/* Search bar */}
      <div className="search-bar">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          placeholder="Search ideas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* Pass editingIdea and onUpdateIdea to IdeaForm */}
      <IdeaForm onAddIdea={handleAddIdea} editingIdea={editingIdea} onUpdateIdea={handleUpdateIdea} />
      <h2>View Ideas</h2>
      {/* Pass handleEdit to IdeaList */}
      <IdeaList ideas={filteredIdeas} handleDelete={handleDelete} handleEdit={handleEdit} />
    </div>
  );
};

export default App;
