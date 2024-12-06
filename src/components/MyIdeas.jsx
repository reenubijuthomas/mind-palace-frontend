import React, { useEffect, useState } from "react";
import axios from "axios";
import IdeaList from "./IdeaList";
import BASE_URL from "../config.jsx";

const MyIdeas = ({ userId, handleDelete, handleEdit, handleLike, theme }) => {
  const [myIdeas, setMyIdeas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [toggleSections, setToggleSections] = useState({
    approved: false,
    rejected: false,
    pending: true, // Default open tab is "Pending"
  });
  const [activeIdea, setActiveIdea] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyIdeas = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BASE_URL}/api/ideas?createdBy=${userId}&&is_draft=false`
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
      approved: false,
      rejected: false,
      pending: false,
      [section]: true, // Only one tab will be active at a time
    }));
  };

  const openModal = (idea) => setActiveIdea(idea);
  const closeModal = () => setActiveIdea(null);

  return (
    <div
      className={`p-6 ${theme} min-h-screen flex flex-col items-center`}
    >

      {/* Title Section */}
      <div className="pt-24 pb-8 text-center">
        <h1
          className={`
      text-4xl font-extrabold tracking-wide
      ${theme === "dark" ? "text-indigo-300" : "text-indigo-700"}
    `}
        >
          My Ideas
        </h1>
        <p
          className={`
      mt-4 text-lg font-medium
      ${theme === "dark" ? "text-gray-400" : "text-gray-600"}
    `}
        >
          Manage and track the progress of your ideas
        </p>
      </div>

      <div className="search-bar mx-auto">
        <i className="fa fa-search search-icon"></i>
        <input
          type="text"
          placeholder="Search ideas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`search-input ${theme === 'dark' ? 'dark-search-bar' : 'light-search-bar'}`}
        />
      </div>

      {/* Loading or Ideas */}
      {loading ? (
        <div className="text-center text-gray-500">Loading ideas...</div>
      ) : (
        <>
          {/* Tabs for Pending, Approved, Rejected */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => toggleSection("pending")}
              className={`px-4 py-2 rounded-md font-semibold transition-all duration-300 ${toggleSections.pending
                ? theme === "dark"
                  ? "bg-gray-800 text-indigo-400"
                  : "bg-gray-200 text-indigo-600"
                : theme === "dark"
                  ? "bg-gray-700 text-gray-400"
                  : "bg-gray-100 text-gray-500"
                }`}
            >
              Pending Approval
            </button>
            <button
              onClick={() => toggleSection("approved")}
              className={`px-4 py-2 rounded-md font-semibold transition-all duration-300 ${toggleSections.approved
                ? theme === "dark"
                  ? "bg-gray-800 text-indigo-400"
                  : "bg-gray-200 text-indigo-600"
                : theme === "dark"
                  ? "bg-gray-700 text-gray-400"
                  : "bg-gray-100 text-gray-500"
                }`}
            >
              Approved Ideas
            </button>
            <button
              onClick={() => toggleSection("rejected")}
              className={`px-4 py-2 rounded-md font-semibold transition-all duration-300 ${toggleSections.rejected
                ? theme === "dark"
                  ? "bg-gray-800 text-indigo-400"
                  : "bg-gray-200 text-indigo-600"
                : theme === "dark"
                  ? "bg-gray-700 text-gray-400"
                  : "bg-gray-100 text-gray-500"
                }`}
            >
              Rejected Ideas
            </button>
          </div>

          {/* Pending Ideas */}
          {toggleSections.pending && (
            pendingIdeas.length > 0 ? (
              <IdeaList
                ideas={pendingIdeas}
                handleDelete={handleDeleteIdea}
                handleEdit={handleEditIdea}
                handleLike={handleLike}
                userId={userId}
                openModal={openModal}
                isDarkMode={theme === "dark"}
              />
            ) : (
              <div
                className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-lg text-center mx-auto w-full max-w-md ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
                  }`}
              >
                <p className="text-lg font-medium">No pending ideas found</p>
                <button
                  onClick={() => window.location.href = "/"} // Navigate to homepage
                  className={`mt-6 px-6 py-3 rounded-full text-white font-semibold hover:bg-indigo-600 transition ${theme === "dark" ? "bg-indigo-700" : "bg-indigo-500"
                    }`}
                >
                  Back to Homepage
                </button>
              </div>
            )
          )}

          {/* Approved Ideas */}
          {toggleSections.approved && (
            approvedIdeas.length > 0 ? (
              <IdeaList
                ideas={approvedIdeas}
                handleDelete={handleDeleteIdea}
                handleEdit={handleEditIdea}
                handleLike={handleLike}
                userId={userId}
                openModal={openModal}
                isDarkMode={theme === "dark"}
              />
            ) : (
              <div
                className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-lg text-center mx-auto w-full max-w-md ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
                  }`}
              >
                <p className="text-lg font-medium">No approved ideas found</p>
                <button
                  onClick={() => window.location.href = "/"} // Navigate to homepage
                  className={`mt-6 px-6 py-3 rounded-full text-white font-semibold hover:bg-indigo-600 transition ${theme === "dark" ? "bg-indigo-700" : "bg-indigo-500"
                    }`}
                >
                  Back to Homepage
                </button>
              </div>
            )
          )}

          {/* Rejected Ideas */}
          {toggleSections.rejected && (
            rejectedIdeas.length > 0 ? (
              <IdeaList
                ideas={rejectedIdeas}
                handleDelete={handleDeleteIdea}
                handleEdit={handleEditIdea}
                handleLike={handleLike}
                userId={userId}
                openModal={openModal}
                isDarkMode={theme === "dark"}
              />
            ) : (
              <div
                className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-lg text-center mx-auto w-full max-w-md ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
                  }`}
              >
                <p className="text-lg font-medium">No rejected ideas found</p>
                <button
                  onClick={() => window.location.href = "/"} // Navigate to homepage
                  className={`mt-6 px-6 py-3 rounded-full text-white font-semibold hover:bg-indigo-600 transition ${theme === "dark" ? "bg-indigo-700" : "bg-indigo-500"
                    }`}
                >
                  Back to Homepage
                </button>
              </div>
            )
          )}

        </>
      )}

      {/* Modal for Active Idea */}
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
