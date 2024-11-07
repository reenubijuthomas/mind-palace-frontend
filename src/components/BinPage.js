import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IdeaList from './IdeaList'; // Reusing IdeaList component for displaying ideas
import './BinPage.css'; // Optional: Add custom styles

const BinPage = ({ userId, handleRestore, handleDelete, handleLike }) => {
  const [deletedIdeas, setDeletedIdeas] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDeletedIdeas = async () => {
      try {
        // Pass the userId in the query to fetch deleted ideas only for this user
        const response = await axios.get(`http://localhost:5050/api/bin?createdBy=${userId}`); // Added userId query parameter
        if (response.data && response.data.length === 0) {
          setMessage('No deleted ideas found.');
        } else {
          setDeletedIdeas(response.data); // Populate the state with deleted ideas
          setMessage(''); // Clear the message if there are deleted ideas
        }
      } catch (error) {
        console.error('Error fetching deleted ideas:', error);
      }
    };

    fetchDeletedIdeas(); // Fetch deleted ideas on component mount
  }, [userId]); // Runs when userId changes

  return (
    <div>
      <h2>My Bin</h2>
      {message && <p>{message}</p>} {/* Display any messages (e.g., no ideas or error) */}
      
      {deletedIdeas.length > 0 ? (
        <IdeaList
          ideas={deletedIdeas}
          handleDelete={handleDelete}
          handleLike={null}
          userId={userId}  // Pass the userId for permissions
          isBinPage={true}
        />
      ) : (
        <div className="no-ideas-container">
          <p>No deleted ideas in the bin.</p> {/* Message if no deleted ideas */}
        </div>
      )}
    </div>
  );
};

export default BinPage;
