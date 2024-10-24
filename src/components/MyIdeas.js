// MyIdeas.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IdeaList from './IdeaList'; // Adjust the import path as needed
import { Link } from 'react-router-dom'; // Import Link from React Router
import './MyIdeas.css'; // Import CSS for styling

const MyIdeas = ({ userId, handleDelete, handleEdit, handleLike }) => {
  const [myIdeas, setMyIdeas] = useState([]);

  useEffect(() => {
    const fetchMyIdeas = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/api/ideas?createdBy=${userId}`);
        setMyIdeas(response.data);
      } catch (error) {
        console.error('Error fetching my ideas:', error);
      }
    };

    fetchMyIdeas();
  }, [userId]); // Fetch ideas when userId changes

  return (
    <div>
      <h2>My Ideas</h2>
      {myIdeas.length > 0 ? (
        <IdeaList
          ideas={myIdeas}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
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
