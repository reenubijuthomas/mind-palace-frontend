import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Approvals.css'; // Ensure your CSS is imported

const Approvals = () => {
  const [approvalIdeas, setApprovalIdeas] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term

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

  const handleApprove = async (ideaId) => {
    try {
      await axios.put(`http://localhost:5050/api/approvals/approve/${ideaId}`);
      setApprovalIdeas(prev => prev.filter(idea => idea.id !== ideaId));
    } catch (error) {
      console.error('Error approving idea:', error);
    }
  };

  const handleReject = async (ideaId) => {
    try {
      await axios.put(`http://localhost:5050/api/approvals/reject/${ideaId}`);
      setApprovalIdeas(prev => prev.filter(idea => idea.id !== ideaId));
    } catch (error) {
      console.error('Error rejecting idea:', error);
    }
  };

  // Filter ideas based on the search term
  const filteredIdeas = approvalIdeas.filter(idea =>
    idea.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Ideas Pending Approval</h2>
      <input
        type="text"
        placeholder="Search ideas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
      {filteredIdeas.length > 0 ? (
        <ul>
          {filteredIdeas.map((idea) => (
            <li key={idea.id} className="idea-card">
              <h3>{idea.title}</h3>
              <p>{idea.description}</p>
              <p>Likes: {idea.likes}</p>
              <div className="button-container">
                <button className="approve-button" onClick={() => handleApprove(idea.id)}>Approve</button>
                <button className="reject-button" onClick={() => handleReject(idea.id)}>Reject</button>
              </div>
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
