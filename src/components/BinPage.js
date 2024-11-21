import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IdeaList from './IdeaList';
import './BinPage.css'; 

const BinPage = ({ userId, handleRestore, handleDelete }) => {
  const [deletedIdea, setDeletedIdeas] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const deletedIdeas = deletedIdea.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bin-page-container"> {/* Updated class name */}
      <h2>My Bin</h2>
      <input
        type="text"
        placeholder="Search ideas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar-new"
      />
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
