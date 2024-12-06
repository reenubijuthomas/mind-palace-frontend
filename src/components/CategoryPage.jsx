import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import BASE_URL from "../config.jsx";
import IdeaList from './IdeaList';

const CategoryPage = ({ theme, handleDelete, handleEdit, handleLike}) => {
  const { categoryName, categoryID } = useParams();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/groups/categories/${categoryID}`
        );
        const data = await response.json();
        setIdeas(data);
      } catch (error) {
        console.error("Error fetching ideas:", error);
      } finally {
        setTimeout(() => setLoading(false), 0);
      }
    };

    fetchIdeas();
  }, [categoryName, categoryID]);

  const filteredIdeas = ideas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditIdea = async (updatedIdea) => {
    try {
      const savedIdea = await handleEdit(updatedIdea);
      if (savedIdea) {
        setIdeas((prevIdeas) =>
          prevIdeas.map((idea) => (idea.id === savedIdea.id ? savedIdea : idea))
        );
        setMessage('Idea updated successfully!')
      }
    } catch (error) {
      console.error("Error editing idea:", error);
      setMessage('Failed to update idea')
    }
  };

  const handleDeleteIdea = async (id) => {
    try {
      await handleDelete(id);
      setIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== id));
      setMessage('Idea deleted successfully!');
    } catch (error) {
      console.error("Error deleting idea:", error);
      setMessage('Failed to delete draft.');
    }
  };

  return (
    <div
      className={`p-6 min-h-screen flex flex-col items-center ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-[#1e293b] via-[#151f2d] to-[#0f172a] text-[#e2e8f0]'
          : 'bg-gradient-to-b from-[#f3f8ff] via-[#d1e3ff] to-[#a9c9ff] text-[#2d3748]'
      }`}
    >
      <div className="pt-24 pb-8 text-center">
        <h1
          className={`text-4xl font-extrabold tracking-wide ${
            theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'
          }`}
        >
          Ideas in <span className="text-indigo-500">"{categoryName}"</span>
        </h1>
        <p
          className={`mt-4 text-lg font-medium ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Browse and explore the ideas in this category
        </p>
      </div>

      <button
        onClick={() => navigate("/groups")}
        className="px-4 py-2 bg-indigo-500 text-white rounded-md mb-6 hover:bg-indigo-600 transition-all"
      >
        Go Back to Categories
      </button>

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

      {loading ? (
  <p className="text-center text-gray-500">Loading ideas...</p>
) : filteredIdeas.length > 0 ? (
  <IdeaList 
    ideas={filteredIdeas} 
    isDarkMode={theme === 'dark'} 
    handleDelete={handleDeleteIdea}
    handleEdit={handleEditIdea}
  />
) : (
  <div
    className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-lg text-center mx-auto w-full max-w-md ${theme === 'dark'
      ? 'bg-gray-800 text-gray-200'
      : 'bg-white text-gray-800'
      }`}
  >
    <p className="text-lg font-medium">
      {message || 'No ideas found for this category.'}
    </p>
  </div>
)}

    </div>
  );
};

export default CategoryPage;
