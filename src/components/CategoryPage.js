import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import IdeaList from './IdeaList';
import BASE_URL from '../config';

const CategoryPage = ({ theme }) => {
  const { categoryName, categoryID } = useParams();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/groups/categories/${categoryID}`);
        const data = await response.json();
        setIdeas(data);
      } catch (error) {
        console.error('Error fetching ideas:', error);
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
    <div className={`category-page-container ${theme}`}>
      <h2 className={`category-page-title ${theme}`}>Ideas in "{categoryName}"</h2>
      <div className="search-bar-container">
        <i className="fa fa-search search-icon"></i>
        <input
          type="text"
          placeholder="Search ideas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`search-bar-new ${theme}`}
        />
      </div>
      {loading ? (
        <div className={`loading-message ${theme}`}>Loading ideas...</div>
      ) : (
        <div className="ideas-container">
          {filteredIdeas.length > 0 && (
            <>
              <IdeaList
                ideas={filteredIdeas}
                isDarkMode={theme === 'dark'}
              />
              <div
                className="no-ideas-container browse-categories-tile"
                onClick={() => navigate('/groups')}
              >
                <p>
                Browse other{' '}
                <span
                  className="browse-link"
                  onClick={() => navigate('/groups')}
                >
                  categories
                </span>
                !
                </p>
              </div>
            </>
          )}

          {filteredIdeas.length === 0 && (
            <div className={`no-ideas-container ${theme}`}>
              <p>No ideas found for this category.</p>
              <p>
                Browse other{' '}
                <span
                  className="browse-link"
                  onClick={() => navigate('/groups')}
                >
                  categories
                </span>
                !
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
