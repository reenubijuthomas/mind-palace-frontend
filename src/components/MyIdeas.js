import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IdeaList from './IdeaList';
import { Link } from 'react-router-dom';
import './MyIdeas.css';

const MyIdeas = ({ userId, handleDelete, handleEdit, handleLike }) => {
  const [myIdeas, setMyIdeas] = useState([]);
  const [toggleSections, setToggleSections] = useState({
    approved: true,
    rejected: true,
    pending: true,
  });

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

  // Categorize ideas based on their status
  const approvedIdeas = myIdeas.filter((idea) => idea.isApproved === 1); // Approved
  const rejectedIdeas = myIdeas.filter((idea) => idea.isApproved === 2); // Rejected
  const pendingIdeas = myIdeas.filter((idea) => idea.isApproved === 0); // Pending

  // Toggle section visibility
  const toggleSection = (section) => {
    setToggleSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div>
      <h2>My Ideas</h2>

      {/* Pending Approval Section */}
      <section>
        <h3 onClick={() => toggleSection('pending')} style={{ cursor: 'pointer' }}>
          Pending Approval {toggleSections.pending ? '▼' : '▲'}
        </h3>
        {toggleSections.pending && (
          pendingIdeas.length > 0 ? (
            <IdeaList
              ideas={pendingIdeas}
              handleDelete={handleDeleteIdea}
              handleEdit={handleEditIdea}
              handleLike={handleLike}
              userId={userId}
            />
          ) : (
            <p>No pending ideas found.</p>
          )
        )}
      </section>

      {/* Approved Ideas Section */}
      <section>
        <h3 onClick={() => toggleSection('approved')} style={{ cursor: 'pointer' }}>
          Approved Ideas {toggleSections.approved ? '▼' : '▲'}
        </h3>
        {toggleSections.approved && (
          approvedIdeas.length > 0 ? (
            <IdeaList
              ideas={approvedIdeas}
              handleDelete={handleDeleteIdea}
              handleEdit={handleEditIdea}
              handleLike={handleLike}
              userId={userId}
            />
          ) : (
            <p>No approved ideas found.</p>
          )
        )}
      </section>

      {/* Rejected Ideas Section */}
      <section>
        <h3 onClick={() => toggleSection('rejected')} style={{ cursor: 'pointer' }}>
          Rejected Ideas {toggleSections.rejected ? '▼' : '▲'}
        </h3>
        {toggleSections.rejected && (
          rejectedIdeas.length > 0 ? (
            <IdeaList
              ideas={rejectedIdeas}
              handleDelete={handleDeleteIdea}
              handleEdit={handleEditIdea}
              handleLike={handleLike}
              userId={userId}
            />
          ) : (
            <p>No rejected ideas found.</p>
          )
        )}
      </section>

      {/* No Ideas Found */}
      {myIdeas.length === 0 && (
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
