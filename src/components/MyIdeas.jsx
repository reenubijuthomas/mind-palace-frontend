import React, { useEffect, useState } from "react";
import axios from "axios";
import IdeaList from "./IdeaList";
import { Link } from "react-router-dom";

const MyIdeas = ({ userId, handleDelete, handleEdit, handleLike, theme }) => {
  const [myIdeas, setMyIdeas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [toggleSections, setToggleSections] = useState({
    approved: true,
    rejected: true,
    pending: true,
  });
  const [activeIdea, setActiveIdea] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyIdeas = async () => {
      try {
        setLoading(true); 
        const response = await axios.get(
          `http://localhost:5050/api/ideas?createdBy=${userId}&&is_draft=false`
        );
        setMyIdeas(response.data);
      } catch (error) {
        console.error("Error fetching my ideas:", error);
      } finally {
        setLoading(false);
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

  const approvedIdeas = filteredIdeas.filter((idea) => idea.isApproved === 1);
  const rejectedIdeas = filteredIdeas.filter((idea) => idea.isApproved === 2);
  const pendingIdeas = filteredIdeas.filter((idea) => idea.isApproved === 0);

  const toggleSection = (section) => {
    setToggleSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const openModal = (idea) => setActiveIdea(idea);
  const closeModal = () => setActiveIdea(null);

  return (
    <div className={`p-4 ${activeIdea ? "overflow-hidden h-screen" : ""} ${theme}`}>
      <h2 className="text-xl font-bold">My Ideas</h2>
      <div className="relative max-w-md mx-auto mt-4 mb-6">
        <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input
          type="text"
          placeholder="Search ideas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full px-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500`}
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading ideas...</p>
      ) : (
        <>
          {pendingIdeas.length > 0 && (
            <section className="mt-6">
              <h3
                onClick={() => toggleSection("pending")}
                className="cursor-pointer font-semibold text-lg"
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

          {approvedIdeas.length > 0 && (
            <section className="mt-6">
              <h3
                onClick={() => toggleSection("approved")}
                className="cursor-pointer font-semibold text-lg"
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
                  isDarkMode={theme === "dark"}
                />
              )}
            </section>
          )}

          {rejectedIdeas.length > 0 && (
            <section className="mt-6">
              <h3
                onClick={() => toggleSection("rejected")}
                className="cursor-pointer font-semibold text-lg"
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

          {!loading && myIdeas.length === 0 && (
            <div className="text-center bg-white p-4 rounded shadow">
              <p>No ideas found.</p>
              <p>
                Start creating some{" "}
                <Link to="/" className="text-indigo-500 underline">
                  here
                </Link>
                !
              </p>
            </div>
          )}
        </>
      )}

      {activeIdea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold">{activeIdea.title}</h2>
            <p className="mt-4">{activeIdea.description}</p>
            <button
              className="mt-6 bg-indigo-500 text-white px-4 py-2 rounded-lg"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyIdeas;
