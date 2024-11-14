import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IdeaList from './IdeaList';
import { Link } from 'react-router-dom'; 
import './MyIdeas.css'; 

const MyIdeas = ({ userId, handleDelete, handleEdit, handleLike }) => {
  const [myIdeas, setMyIdeas] = useState([]);

  useEffect(() => {
    const fetchMyIdeas = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/api/ideas?createdBy=${userId}&&is_draft=false`);
        setMyIdeas(response.data);
      } catch (error) {
        console.error('Error fetching my ideas:', error);
      }
    };

    fetchMyIdeas();
  }, [userId]); 


  const handleDeleteIdea = async (id) => {
    try {
      await handleDelete(id); 
      setMyIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== id));
    } catch (error) {
      console.error('Error deleting idea:', error);
    }
  };

  const handleEditIdea = async (updatedIdea) => {
    try {
      const savedIdea = await handleEdit(updatedIdea);
      if (savedIdea) {
        setMyIdeas((prevIdeas) =>
          prevIdeas.map((idea) => (idea.id === savedIdea.id ? savedIdea : idea))
        );
      }
    } catch (error) {
      console.error('Error editing idea:', error);
    }
  };

  return (
    <div>
      <h2>My Ideas</h2>
      {myIdeas.length > 0 ? (
        <IdeaList
          ideas={myIdeas}
          handleDelete={handleDeleteIdea}
          handleEdit={handleEditIdea}
          handleLike={handleLike}
          userId={userId}
        />
      ) : (
        <div className="no-ideas-container">
          <p>No ideas found.</p>
          <p>
            Start creating some <Link to="/">here</Link>!
          </p>
        </div>
      )}
    </div>
  );
};

export default MyIdeas;
