import React, { useEffect, useState } from "react";
import axios from "axios";
import IdeaList from "./IdeaList";
import BASE_URL from "../config.jsx";

const Drafts = ({ userId, handleDelete, handleEdit, theme }) => {
  const [drafts, setDrafts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/ideas?createdBy=${userId}&&is_draft=true`
        );
        if (response.data && response.data.length === 0) {
          setMessage('No drafts found.');
        } else {
          setDrafts(response.data);
          setMessage('');
        }
      } catch (error) {
        console.error("Error fetching drafts:", error);
        setMessage('Failed to load drafts.');
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, [userId]);

  const submitDraft = async (ideaId) => {
    try {
      await axios.put(`${BASE_URL}/api/drafts/submit/${ideaId}`);
      setDrafts((prevDrafts) => prevDrafts.filter((draft) => draft.id !== ideaId));
      setMessage('Draft submitted successfully!');
    } catch (error) {
      console.error("Error submitting draft:", error);
      setMessage('Failed to submit draft.');
    }
  };

  const handleDeleteIdea = async (id) => {
    try {
      await handleDelete(id);
      setDrafts((prevIdeas) => prevIdeas.filter((idea) => idea.id !== id));
      setMessage('Draft deleted successfully!');
    } catch (error) {
      console.error("Error deleting idea:", error);
      setMessage('Failed to delete draft.');
    }
  };

  const handleEditIdea = async (updatedIdea) => {
    try {
      const savedIdea = await handleEdit(updatedIdea);
      if (savedIdea) {
        setDrafts((prevIdeas) =>
          prevIdeas.map((idea) => (idea.id === savedIdea.id ? savedIdea : idea))
        );
        setMessage('Draft updated successfully!');
      }
    } catch (error) {
      console.error("Error editing idea:", error);
      setMessage('Failed to update draft.');
    }
  };

  const filteredDrafts = drafts.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen py-10 px-6 ${theme === "dark"
          ? "bg-gradient-to-b from-[#1e293b] via-[#151f2d] to-[#0f172a] text-[#e2e8f0]"
          : "bg-gradient-to-b from-[#f3f8ff] via-[#d1e3ff] to-[#a9c9ff] text-[#2d3748]"
        }`}
    >
      {/* Title Section */}
      <div className="pt-24 pb-8 text-center">
        <h1
          className={`text-4xl font-extrabold tracking-wide ${theme === "dark" ? "text-indigo-300" : "text-indigo-700"
            }`}
        >
          My Drafts
        </h1>
        <p
          className={`mt-4 text-lg font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
        >
          Manage and finalize your draft ideas
        </p>
      </div>

      {/* Search Bar */}
      <div className="search-bar mx-auto">
        <i className="fa fa-search search-icon"></i>
        <input
          type="text"
          placeholder="Search draft ideas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`search-input ${theme === "dark" ? "dark-search-bar" : "light-search-bar"
            }`}
        />
      </div>

      {/* Loading or Ideas */}
      {loading ? (
        <div className="text-center text-gray-500">Loading drafts...</div>
      ) : filteredDrafts.length > 0 ? (
        <IdeaList
          ideas={filteredDrafts}
          handleDelete={handleDeleteIdea}
          handleEdit={handleEditIdea}
          userId={userId}
          isDraftPage={true}
          setDrafts={setDrafts}
          isDarkMode={theme === "dark"}
          submitDraft={submitDraft}
        />
      ) : (
        <div
          className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-lg text-center mx-auto w-full max-w-md ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
            }`}
        >
          <p className="text-lg font-medium mb-2">No drafts found</p>
          <p className="text-gray-400 mb-4">
            You haven't created any drafts yet. Start by adding some ideas to save them as drafts.
          </p>
          {/* Create New Idea Button */}
          <button
            onClick={() => window.location.href = "/"} // Navigate to homepage
            className={`mt-6 px-6 py-3 rounded-full text-white font-semibold hover:bg-indigo-600 transition ${
              theme === "dark" ? "bg-indigo-700" : "bg-indigo-500"
            }`}
          >
            Create New Idea
          </button>
        </div>
      )}
    </div>
  );
};

export default Drafts;
