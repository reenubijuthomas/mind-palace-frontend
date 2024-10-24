import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Approvals = () => {
  const [approvalIdeas, setApprovalIdeas] = useState([]);

  useEffect(() => {
    const fetchApprovalIdeas = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/approvals');
        setApprovalIdeas(response.data[0]); 
      } catch (error) {
        console.error('Error fetching approval ideas:', error);
      }
    };

    fetchApprovalIdeas();
  }, []);

  return (
    <div>
      <h2>Ideas Pending Approval</h2>
      {approvalIdeas.length > 0 ? (
        <ul>
          {approvalIdeas.map((idea, index) => (
            <li key={index}>
              <h3>{idea.title}</h3>
              <p>{idea.description}</p>
              <p>Likes: {idea.likes}</p>
              <p>Created at: {new Date(idea.createdAt).toLocaleString()}</p>
              <p>Updated at: {new Date(idea.updatedAt).toLocaleString()}</p>
              {/* Add your approval buttons or logic here */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No ideas pending approval.</p>
      )}
    </div>
  );
};

export default Approvals;
