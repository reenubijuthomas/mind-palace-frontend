import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GroupsPage.css';

const GroupsPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="category-container">
      <h2>Categories</h2>
      <div className="category-list">
        {categories.length > 0 ? (
          categories.map((category, index) => (
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
      </div>
    </div>
  );
};

export default GroupsPage;
