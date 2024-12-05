import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GroupsPage = ({ theme }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:5050/api/groups/categories"
      );
      const data = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      alert("Please enter a valid category name");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5050/api/groups/categories",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategory.trim() }),
        }
      );

      const result = await response.json();
      if (response.status === 201) {
        fetchCategories();
        setIsModalOpen(false);
        setNewCategory("");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewCategory("");
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading categories...</p>;
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`p-6 ${theme} min-h-screen flex flex-col items-center`}
    >
      <h2 className="text-2xl font-bold mb-6">Categories</h2>

      {/* Search Bar */}
      <div className="relative max-w-md w-full mb-6">
        <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, index) => (
            <div
              key={index}
              className="card text-center cursor-pointer hover:scale-105 transition duration-300"
              onClick={() =>
                navigate(`/groups/${category.name}/${category.id}`)
              }
            >
              {category.name}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No categories available.</p>
        )}

        {/* Add Category */}
        <div
          className="card text-center cursor-pointer hover:scale-105 transition duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          + Add category...
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-bold mb-4">Add a New Category</h3>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-4 justify-center">
              <button
                className="button-primary"
                onClick={handleAddCategory}
              >
                Add
              </button>
              <button
                className="button-secondary"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
