import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import BASE_URL from "../config.jsx";
import IdeaList from './IdeaList';

const CategoryPage = ({ theme }) => {
  const { categoryName, categoryID } = useParams();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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

  return (
    <div
      className={`p-6 min-h-screen flex flex-col items-center ${
        theme === "dark"
          ? "bg-gradient-to-b from-[#1e293b] via-[#151f2d] to-[#0f172a] text-[#e2e8f0]"
          : "bg-gradient-to-b from-[#f3f8ff] via-[#d1e3ff] to-[#a9c9ff] text-[#2d3748]"
      }`}
    >
      {/* Title Section */}
      <div className="pt-24 pb-8 text-center">
        <h1
          className={`text-4xl font-extrabold tracking-wide ${
            theme === "dark" ? "text-indigo-300" : "text-indigo-700"
          }`}
        >
          Ideas in <span className="text-indigo-500">"{categoryName}"</span>
        </h1>
        <p
          className={`mt-4 text-lg font-medium ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Browse and explore the ideas in this category
        </p>
      </div>

      {/* Go Back Button */}
      <button
        onClick={() => navigate("/groups")}
        className="px-4 py-2 bg-indigo-500 text-white rounded-md mb-6 hover:bg-indigo-600 transition-all"
      >
        Go Back to Categories
      </button>

      {/* Search Bar */}
      <div className="search-bar mx-auto">
        <i className="fa fa-search search-icon"></i>
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`search-input ${theme === 'dark' ? 'dark-search-bar' : 'light-search-bar'}`}
        />
      </div>

      {/* Idea List */}
      <div className="mt-8 w-full flex flex-wrap justify-center gap-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading ideas...</p>
        ) : filteredIdeas.length > 0 ? (
          filteredIdeas.map((idea) => (
            <div
              key={idea.id}
              className={`relative flex flex-col items-center justify-center p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-100 border border-gray-700"
                  : "bg-white text-gray-900 border border-gray-200"
              }`}
              style={{ width: "260px", height: "160px" }}
            >
              <h3 className="text-lg font-bold mb-2">{idea.title}</h3>
              <p className="text-sm text-center line-clamp-3">{idea.description}</p>
            </div>
          ))
        ) : (
          <div
            className={`text-center p-4 rounded shadow ${
              theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-white text-gray-800"
            }`}
          >
            <p>No ideas found for this category.</p>
            <p>
              Browse other{" "}
              <Link to="/groups" className="text-indigo-500 underline">
                categories
              </Link>
              !
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
