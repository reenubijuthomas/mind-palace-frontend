import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GroupsPage.css';

const GroupsPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/groups/categories');
      const data = await response.json();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      alert('Please enter a valid category name');
      return;
    }

    try {
      const response = await fetch('http://localhost:5050/api/groups/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory.trim() }),
      });

      const result = await response.json();
      if (response.status === 201) {
        fetchCategories();

        setIsModalOpen(false);
        setNewCategory('');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewCategory('');
  };

  if (loading) {
    return <div>Loading categories...</div>;
  }

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="category-container">
      <h2>Categories</h2>
      <div className="search-bar-container">
        <i className="fa fa-search search-icon"></i>
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar-new"
        />
      </div>
      <div className="category-list">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, index) => (
            <div
              key={index}
              className="category-tile"
              onClick={() => navigate(`/groups/${category.name}/${category.id}`)}
            >
              {category.name}
            </div>
          ))
        ) : (
          <div>No categories available.</div>
        )}

        <div
          className="category-tile add-category"
          onClick={() => setIsModalOpen(true)}
        >
          + Add category...
        </div>
      </div>

      {isModalOpen && (
        <div className="modals">
          <div className="modals-content">
            <h3>Add a New Category</h3>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
            />
            <button onClick={handleAddCategory}>Add</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;