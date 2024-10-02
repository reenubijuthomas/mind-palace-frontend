// src/components/IdeaList.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import './IdeaList.css'; // Create this CSS file to add custom styles

const IdeaList = ({ ideas, handleDelete, handleEdit }) => {
  return (
    <div>
      <ul className="idea-list">
        {ideas.map((idea) => (
          <li key={idea.id} className="idea-item">
            <div className="idea-content">
              <h3>{idea.title}</h3>
              <p>{idea.description}</p>
            </div>
            <div className="idea-actions">
              {/* Edit button with pencil icon */}
              <button className="edit-btn" onClick={() => handleEdit(idea)}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              {/* Delete button with trash icon */}
              <button className="delete-btn" onClick={() => handleDelete(idea.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IdeaList;
