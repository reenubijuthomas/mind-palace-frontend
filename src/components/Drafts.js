import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IdeaList from './IdeaList'; 
import './MyIdeas.css'; 

const Drafts = ({ userId, handleDelete, handleEdit }) => {
  const [drafts, setDrafts] = useState([]);

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


return (
    <div>
      <h2>My Drafts</h2>
      {drafts.length > 0 ? (
        <IdeaList
          ideas={drafts}
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