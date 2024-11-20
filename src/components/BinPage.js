import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IdeaList from './IdeaList';
import './BinPage.css'; 

const BinPage = ({ userId, handleRestore, handleDelete }) => {
  const [deletedIdeas, setDeletedIdeas] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDeletedIdeas = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/api/bin?createdBy=${userId}`); 
        if (response.data && response.data.length === 0) {
          setMessage('No deleted ideas found.');
        } else {
          setDeletedIdeas(response.data); 
          setMessage(''); 
        }
      } catch (error) {
        console.error('Error fetching deleted ideas:', error);
      }
    };

    fetchDeletedIdeas(); 
  }, [userId]); 

  return (
    <div className="bin-page-container"> {/* Updated class name */}
      <h2>My Bin</h2>
      {message && <p>{message}</p>} 
      
      {deletedIdeas.length > 0 ? (
        <IdeaList
          ideas={deletedIdeas}
          handleDelete={handleDelete}
          handleLike={null}
          userId={userId} 
          isBinPage={true}
          setDeletedIdeas={setDeletedIdeas}
        />
      ) : (
        <div className="no-ideas-container">
          <p>No deleted ideas in the bin.</p>
        </div>
      )}
    </div>
  );
};

export default BinPage;
