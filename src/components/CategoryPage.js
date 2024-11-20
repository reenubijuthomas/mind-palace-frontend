import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom'; 
import IdeaList from './IdeaList';

const CategoryPage = () => {
  const { categoryName, categoryID } = useParams();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="category-page-container">
      <h2>Ideas in "{categoryName}"</h2>
      {loading ? (
        <div>Loading ideas...</div>
      ) : ideas.length > 0 ? (
        <IdeaList ideas={ideas} />
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
