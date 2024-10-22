import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import './IdeaList.css';

const IdeaList = ({ ideas, handleDelete, handleEdit, handleLike }) => {
  return (
    <div>
      <ul className="idea-list">
        {ideas.map((idea) => (
          <li key={idea.id} className="idea-item">
            <div className="idea-header">
              <span className="creator-username"><strong>By: {idea.username}</strong></span>
              <span className="created-date">
                {new Date(idea.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="idea-content">
              <h3>{idea.title}</h3>
              <p>{idea.description}</p>
            </div>
            <div className="idea-actions">
              <button className="edit-btn" onClick={() => handleEdit(idea)}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button className="delete-btn" onClick={() => handleDelete(idea.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            <div className="idea-likes">
              <button className="like-btn" onClick={() => handleLike(idea.id)}>
                <FontAwesomeIcon icon={faThumbsUp} />
                <span className="likes-count">{idea.likes}</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IdeaList;
