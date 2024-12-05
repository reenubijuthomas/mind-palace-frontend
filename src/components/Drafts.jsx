import React, { useEffect, useState } from "react";
import axios from "axios";
import IdeaList from "./IdeaList";

const Drafts = ({ userId, handleDelete, handleEdit, theme }) => {
  const [drafts, setDrafts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/api/ideas?createdBy=${userId}&&is_draft=true`
        );
        setDrafts(response.data);
      } catch (error) {
        console.error("Error fetching drafts:", error);
      } finally {
        setTimeout(() => setLoading(false), 0);
      }
    };

    fetchDrafts();
  }, [userId]);

  const handleDeleteIdea = async (id) => {
    try {
      await handleDelete(id);
      setDrafts((prevIdeas) => prevIdeas.filter((idea) => idea.id !== id));
    } catch (error) {
      console.error("Error deleting idea:", error);
    }
  };

  const handleEditIdea = async (updatedIdea) => {
    try {
      const savedIdea = await handleEdit(updatedIdea);
      if (savedIdea) {
        setDrafts((prevIdeas) =>
          prevIdeas.map((idea) => (idea.id === savedIdea.id ? savedIdea : idea))
        );
      }
    } catch (error) {
      console.error("Error editing idea:", error);
    }
  };

  const draftIdeas = drafts.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen p-6 flex flex-col items-center ${theme} transition-all`}
    >
      <h2 className="text-xl font-bold mb-6">My Drafts</h2>

      {/* Search Bar */}
      <div className="relative w-full max-w-md mb-6">
        <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
        <input
          type="text"
          placeholder="Search ideas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-12 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Loading or Ideas */}
      {loading ? (
        <div className="text-center text-gray-500 py-4">Loading drafts...</div>
      ) : draftIdeas.length > 0 ? (
        <IdeaList
          ideas={draftIdeas}
          handleDelete={handleDeleteIdea}
          handleEdit={handleEditIdea}
          userId={userId}
          isDraftPage={true}
          setDrafts={setDrafts}
          isDarkMode={theme === "dark"}
        />
      ) : (
        <div className="text-center bg-white p-4 rounded shadow">
          <p>No drafts found.</p>
        </div>
      )}
    </div>
  );
};

export default Drafts;
