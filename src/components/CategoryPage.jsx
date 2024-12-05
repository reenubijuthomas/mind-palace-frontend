import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import IdeaList from "./IdeaList";

const CategoryPage = ({ theme }) => {
  const { categoryName, categoryID } = useParams();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch(
          `http://localhost:5050/api/groups/categories/${categoryID}`
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
      className={`p-6 ${theme} min-h-screen flex flex-col items-center`}
    >
      <h2 className="text-2xl font-bold mb-6">
        Ideas in <span className="text-indigo-500">"{categoryName}"</span>
      </h2>

      {/* Search Bar */}
      <div className="relative max-w-md w-full mb-6">
        <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input
          type="text"
          placeholder="Search ideas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Idea List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading ideas...</p>
      ) : filteredIdeas.length > 0 ? (
        <IdeaList ideas={filteredIdeas} isDarkMode={theme === "dark"} />
      ) : (
        <div className="text-center bg-white p-4 rounded shadow">
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
  );
};

export default CategoryPage;
