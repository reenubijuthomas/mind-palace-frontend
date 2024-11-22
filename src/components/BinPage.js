import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IdeaList from './IdeaList';
import './BinPage.css'; 

const BinPage = ({ userId, handleRestore, handleDelete, theme }) => {
  const [deletedIdeas, setDeletedIdeas] = useState([]);
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

  const filteredIdeas = deletedIdeas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`bin-page-container ${theme}`}>
      <h2>My Bin</h2>
      <input
        type="text"
        placeholder="Search ideas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`search-bar-new ${theme}`}
      />
      {message && <p>{message}</p>}
      {filteredIdeas.length > 0 ? (
        <IdeaList
          ideas={filteredIdeas}
          handleDelete={handleDelete}
          handleLike={null}
          userId={userId}
          isBinPage={true}
          setDeletedIdeas={setDeletedIdeas}
          isDarkMode={theme === 'dark'} 
        />
      ) : (
        <div className={`no-ideas-container ${theme}`}>
          <p>No deleted ideas in the bin.</p>
        </div>
      )}
    </div>
  );
};

export default BinPage;
