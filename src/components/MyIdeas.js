import React, { useEffect, useState } from "react";
import axios from "axios";
import IdeaList from "./IdeaList";
import { Link } from "react-router-dom";
import "../App.css";

const MyIdeas = ({ userId, handleDelete, handleEdit, handleLike, theme }) => {
  const [myIdeas, setMyIdeas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [toggleSections, setToggleSections] = useState({
    approved: true,
    rejected: true,
    pending: true,
  });
  const [activeIdea, setActiveIdea] = useState(null);

  useEffect(() => {
    const fetchMyIdeas = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/api/ideas?createdBy=${userId}&&is_draft=false`
        );
        setMyIdeas(response.data);
      } catch (error) {
        console.error("Error fetching my ideas:", error);
      }
    };

    fetchMyIdeas();
  }, [userId]);

  const handleDeleteIdea = async (id) => {
    try {
      await handleDelete(id);
      setMyIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== id));
    } catch (error) {
      console.error("Error deleting idea:", error);
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
      console.error("Error editing idea:", error);
    }
  };

  const filteredIdeas = myIdeas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const approvedIdeas = filteredIdeas.filter((idea) => idea.isApproved === 1); // Approved
  const rejectedIdeas = filteredIdeas.filter((idea) => idea.isApproved === 2); // Rejected
  const pendingIdeas = filteredIdeas.filter((idea) => idea.isApproved === 0); // Pending

  const toggleSection = (section) => {
    setToggleSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const openModal = (idea) => setActiveIdea(idea);
  const closeModal = () => setActiveIdea(null);

  return (
    <div className={`my-ideas-container ${activeIdea ? "modal-active" : ""} ${theme}`}>
      <h2>My Ideas</h2>
      <div className="search-bar-container">
        <i className="fa fa-search search-icon"></i>
        <input
          type="text"
          placeholder="Search ideas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`search-bar-new ${theme}`}
        />
      </div>
      {/* Pending Approval Section */}
      {pendingIdeas.length > 0 && (
        <section className="section-divider">
          <h3
            onClick={() => toggleSection("pending")}
            style={{ cursor: "pointer" }}
          >
            Pending Approval {toggleSections.pending ? "▼" : "▲"}
          </h3>
          {toggleSections.pending && (
            <IdeaList
              ideas={pendingIdeas}
              handleDelete={handleDeleteIdea}
              handleEdit={handleEditIdea}
              handleLike={handleLike}
              userId={userId}
              openModal={openModal}
              isDarkMode={theme === "dark"}
            />
          )}
        </section>
      )}

      {/* Approved Ideas Section */}
      {approvedIdeas.length > 0 && (
        <section className="section-divider">
          <h3
            onClick={() => toggleSection("approved")}
            style={{ cursor: "pointer" }}
          >
            Approved Ideas {toggleSections.approved ? "▼" : "▲"}
          </h3>
          {toggleSections.approved && (
            <IdeaList
              ideas={approvedIdeas}
              handleDelete={handleDeleteIdea}
              handleEdit={handleEditIdea}
              handleLike={handleLike}
              userId={userId}
              openModal={openModal}
              isDarkMode={theme === "dark"} // Pass isDarkMode prop
            />
          )}
        </section>
      )}

      {/* Rejected Ideas Section */}
      {rejectedIdeas.length > 0 && (
        <section className="section-divider">
          <h3
            onClick={() => toggleSection("rejected")}
            style={{ cursor: "pointer" }}
          >
            Rejected Ideas {toggleSections.rejected ? "▼" : "▲"}
          </h3>
          {toggleSections.rejected && (
            <IdeaList
              ideas={rejectedIdeas}
              handleDelete={handleDeleteIdea}
              handleEdit={handleEditIdea}
              handleLike={handleLike}
              userId={userId}
              openModal={openModal}
              isDarkMode={theme === "dark"}
            />
          )}
        </section>
      )}

      {/* No Ideas Found */}
      {myIdeas.length === 0 && (
        <div className="no-ideas-container">
          <p>No ideas found.</p>
          <p>
            Start creating some <Link to="/">here</Link>!
          </p>
        </div>
      )}

      {/* Modal */}
      {activeIdea && (
        <div className={`modal-overlay ${theme}`} onClick={closeModal}>
          <div
            className={`modal-content ${theme}`}
            onClick={(e) => e.stopPropagation()} // Prevent closing modal on content click
          >
            <h2>{activeIdea.title}</h2>
            <p>{activeIdea.description}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyIdeas;
