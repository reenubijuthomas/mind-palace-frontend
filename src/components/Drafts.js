import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IdeaList from './IdeaList'; 
import './MyIdeas.css'; 

const Drafts = ({ userId, handleDelete, handleEdit }) => {
  const [drafts, setDrafts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/api/ideas?createdBy=${userId}&&is_draft=true`);
        setDrafts(response.data);
      } catch (error) {
        console.error('Error fetching drafts:', error);
      }
    };

    fetchDrafts();
  }, [userId]);

  const handleDeleteIdea = async (id) => {
    try {
      await handleDelete(id);
      setDrafts((prevIdeas) => prevIdeas.filter((idea) => idea.id !== id));
    } catch (error) {
      console.error('Error deleting idea:', error);
    }
  };

  const handleEditIdea = async (updatedIdea) => {
    try {
      const savedIdea = await handleEdit(updatedIdea);
      if (savedIdea) {
        setDrafts((prevIdeas) =>
          prevIdeas.map((idea) => (idea.id === savedIdea.id ? savedIdea : idea))
        );
      }
    } catch (error) {
      console.error('Error editing idea:', error);
    }
  };

  const draftIdeas = drafts.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

return (
    <div>
      <h2>My Drafts</h2>
      <input
        type="text"
        placeholder="Search ideas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar-new"
      />
      {draftIdeas.length > 0 ? (
        <IdeaList
          ideas={draftIdeas}
          handleDelete={handleDeleteIdea}
          handleEdit={handleEditIdea}
          userId={userId}
          isDraftPage={true}
          setDrafts={setDrafts}
        />
      ) : (
        <div className="no-ideas-container">
          <p>No drafts found.</p>
        </div>
      )}
    </div>
  );
};

export default Drafts;