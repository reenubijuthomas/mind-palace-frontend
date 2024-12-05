import { useEffect, useState } from "react";
import axios from "axios";
import IdeaList from "./IdeaList";

const BinPage = ({ userId, handleRestore, handleDelete, theme }) => {
  const [deletedIdeas, setDeletedIdeas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeletedIdeas = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/api/bin?createdBy=${userId}`);
        if (response.data && response.data.length === 0) {
          setDeletedIdeas([]);  // No deleted ideas
        } else {
          setDeletedIdeas(response.data);
        }
      } catch (error) {
        console.error('Error fetching deleted ideas:', error);
      } finally {
        setLoading(false);  // Set loading to false after data is fetched
      }
    };

    fetchDeletedIdeas();
  }, [userId]);

  // Filter ideas based on the search term (title or description)
  const filteredIdeas = deletedIdeas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`p-6 ${theme} min-h-screen flex flex-col items-center transition-all`}
    >
      <h2 className="text-3xl font-bold mb-6 text-center">My Bin</h2>

      {/* Search Bar */}
      <div className="relative max-w-lg mx-auto mb-6">
        <i className="fa fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg"></i>
        <input
          type="text"
          placeholder="Search ideas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-12 py-3 rounded-lg border-2 ${
            theme === "dark"
              ? "border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500"
              : "border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500"
          }`}
        />
      </div>

      {/* Loading, Empty State, and Ideas List */}
      {loading ? (
        <div className="text-center text-gray-500 text-xl">Loading deleted ideas...</div>
      ) : filteredIdeas.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <IdeaList
            ideas={filteredIdeas}
            handleDelete={handleDelete}
            handleLike={null}
            userId={userId}
            isBinPage={true}  // Flag for BinPage to handle restore/delete actions
            setDeletedIdeas={setDeletedIdeas}
            isDarkMode={theme === 'dark'}
          />
        </div>
      ) : (
        <div className="mx-auto p-6 bg-white rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-lg">No deleted ideas in the bin.</p>
        </div>
      )}
    </div>
  );
};

export default BinPage;
