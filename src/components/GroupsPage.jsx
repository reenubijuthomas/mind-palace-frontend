import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config.jsx";

const GroupsPage = ({ theme }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/groups/categories`);
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
      const response = await fetch(`${BASE_URL}/api/groups/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory.trim() }),
      });

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

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      const response = await fetch(
        `${BASE_URL}/api/groups/categories/${categoryToDelete}`,
        { method: "DELETE" }
      );
  
      if (response.ok) {
        setCategories(categories.filter((category) => category.id !== categoryToDelete));
        setIsModalOpen(false);
        setCategoryToDelete(null); 
      } else {
        console.error("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };  

  const closeModal = () => {
    setIsModalOpen(false);
    setNewCategory("");
    setCategoryToDelete(null);
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading categories...</p>;
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          Categories
        </h1>
        <p
          className={`mt-4 text-lg font-medium ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Explore and create categories to organize your ideas
        </p>
      </div>

      {/* Search Bar */}
      <div className="search-bar mx-auto">
        <i className="fa fa-search search-icon"></i>
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`search-input ${
            theme === "dark" ? "dark-search-bar" : "light-search-bar"
          }`}
        />
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl justify-center">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, index) => (
            <div
              key={index}
              className={`relative p-6 rounded-xl shadow-md cursor-pointer hover:scale-105 transition duration-300 flex flex-col items-center justify-center ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-100 border border-gray-700"
                  : "bg-white text-gray-900 border border-gray-200"
                }`}
              onClick={() =>
                navigate(`/groups/${category.name}/${category.id}`)
              }
              style={{
                minHeight: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
             <button
  className="absolute bottom-2 right-2 text-red-500 hover:text-red-700"
  onClick={(e) => {
    e.stopPropagation();
    setCategoryToDelete(category.id);
    setIsModalOpen(true);
  }}
  title="Delete this category"
>
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="trash"
    className="w-6 h-6"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
  >
    <path
      fill="currentColor"
      d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"
    ></path>
  </svg>
</button>

              <h3 className="text-lg font-bold">{category.name}</h3>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No categories available.</p>
        )}

        {/* Add Category */}
        <div
          className={`p-6 rounded-xl shadow-md cursor-pointer hover:scale-105 transition duration-300 flex flex-col items-center justify-center ${
            theme === "dark"
              ? "bg-gray-800 text-gray-100 border border-gray-700"
              : "bg-white text-gray-900 border border-gray-200"
          }`}
          onClick={() => setIsModalOpen(true)}
          style={{
            minHeight: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span className="text-lg font-bold">+ Add category...</span>
        </div>
      </div>

      {/* Add Category Modal */}
      {isModalOpen && !categoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className={`p-6 rounded-lg shadow-xl max-w-sm w-full text-center ${theme === "dark" ? "bg-gray-800 dark:text-gray-200" : "bg-white text-gray-900"
              }`}
          >
            <h3 className="text-lg font-bold mb-4">Add a New Category</h3>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className={`w-full px-4 py-2 mb-4 border rounded focus:ring-2 focus:ring-indigo-500 ${
                theme === "dark"
                  ? "bg-gray-700 text-gray-200 border-gray-600"
                  : "bg-white text-gray-900 border-gray-300"
                }`}
            />
            <div className="flex gap-4 justify-center">
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                onClick={handleAddCategory}
              >
                Add
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className={`p-6 rounded-lg shadow-xl max-w-sm w-full text-center ${theme === "dark" ? "bg-gray-800 dark:text-gray-200" : "bg-white text-gray-900"
              }`}
          >
            <p className="mb-4">Are you sure you want to delete this category?</p>
            <div className="flex space-x-4 justify-center">
              <button
                className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600"
                onClick={handleDeleteCategory}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400"
                onClick={closeModal}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
