import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faThumbsUp, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import './IdeaList.css';

const IdeaList = ({ ideas, handleDelete, handleEdit, handleLike, userId }) => {
  const [commentData, setCommentData] = useState({});
  const [newComment, setNewComment] = useState({});
  const [showComments, setShowComments] = useState({}); // State to toggle comments visibility

  // Function to fetch comments for a specific idea
  const fetchComments = async (ideaId) => {
    try {
      const response = await axios.get(`http://localhost:5050/api/comments/${ideaId}`);
      setCommentData((prevComments) => ({ ...prevComments, [ideaId]: response.data }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Function to handle adding a new comment
  const handleAddComment = async (ideaId) => {
    try {
      await axios.post(`http://localhost:5050/api/comments`, {
        comment: newComment[ideaId],
        commentedBy: userId, // Replace with the logged-in userId
        commentedOn: ideaId,
      });
      setNewComment({ ...newComment, [ideaId]: '' });
      fetchComments(ideaId); // Fetch updated comments
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Function to handle deleting a comment
  const handleDeleteComment = async (commentId, ideaId) => {
    try {
      await axios.delete(`http://localhost:5050/api/comments/${commentId}`);
      // Fetch updated comments after deletion
      fetchComments(ideaId);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Function to toggle comment visibility
  const toggleComments = (ideaId) => {
    if (!showComments[ideaId]) {
      fetchComments(ideaId);
    }
    setShowComments((prevState) => ({
      ...prevState,
      [ideaId]: !prevState[ideaId],
    }));
  };

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

            {/* Likes and Comments Section */}
            <div className="idea-likes-comments">
              <div className="like-section">
                <button className="like-btn" onClick={() => handleLike(idea.id)}>
                  <FontAwesomeIcon icon={faThumbsUp} />
                  <span className="likes-count">{idea.likes}</span>
                </button>
              </div>

              {/* Dropdown arrow for comments */}
              <div className="comment-toggle-section">
                <button className="comment-toggle-btn" onClick={() => toggleComments(idea.id)}>
                  <FontAwesomeIcon icon={showComments[idea.id] ? faAngleUp : faAngleDown} className="comment-arrow" />
                </button>
              </div>
            </div>

            {/* Add new comment section always visible */}
            <div className="add-comment">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment[idea.id] || ''}
                onChange={(e) => setNewComment({ ...newComment, [idea.id]: e.target.value })}
              />
              <button className="add-comment-btn" onClick={() => handleAddComment(idea.id)}>Add</button>
            </div>

            {/* Comments Section (conditionally rendered based on toggle) */}
            {showComments[idea.id] && (
              <div className="comments-section">
                <ul className="comments-list">
                  {commentData[idea.id] && commentData[idea.id].map((comment) => (
                    <li key={comment.id}>
                      <strong>{comment.username}</strong>: {comment.comment}
                      {/* Delete button for each comment */}
                      <button className="delete-comment-btn" onClick={() => handleDeleteComment(comment.id, idea.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};


export default IdeaList;
