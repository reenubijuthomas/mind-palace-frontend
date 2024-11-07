import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IdeaList from './IdeaList'; // Adjust the import path as needed
import './MyIdeas.css'; // Import CSS for styling

const Drafts = ({ userId, handleDelete, handleEdit }) => {
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/api/ideas?createdBy=${userId}&&is_draft=true`);
        console.log(response.data);
        setDrafts(response.data);
      } catch (error) {
        console.error('Error fetching drafts:', error);
      }
    };

    fetchDrafts();
  }, [userId]);
return (
    <div>
      <h2>My Drafts</h2>
      {drafts.length > 0 ? (
        <IdeaList
          ideas={drafts}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          userId={userId}
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