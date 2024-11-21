import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom'; 
import IdeaList from './IdeaList';

const CategoryPage = () => {
  const { categoryName, categoryID } = useParams();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch(`http://localhost:5050/api/groups/categories/${categoryID}`);
        const data = await response.json();
        setIdeas(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ideas:', error);
        setLoading(false);
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
    <div className="category-page-container">
      <h2>Ideas in "{categoryName}"</h2>
      <input
        type="text"
        placeholder="Search ideas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar-new"
      />
      {loading ? (
        <div>Loading ideas...</div>
      ) : filteredIdeas.length > 0 ? (
        <IdeaList 
        ideas={filteredIdeas}
        />
      ) : (
        <div className="no-ideas-container">
          <p>No ideas found for this category.</p>
          <p>
            Browse other <Link to="/groups">categories</Link>!
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
