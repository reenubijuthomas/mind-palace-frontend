import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faThumbsUp, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import './IdeaList.css';

const IdeaList = ({ ideas, handleDelete, handleEdit, handleLike, userId }) => {
  const [commentData, setCommentData] = useState({});
  const [newComment, setNewComment] = useState({});
  const [showModal, setShowModal] = useState(null);
  const [showComments, setShowComments] = useState({});
  const [notification, setNotification] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIdeaId, setDeleteIdeaId] = useState(null);
  const [showDeleteCommentConfirm, setShowDeleteCommentConfirm] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState(null);

  useEffect(() => {
    if (showModal) {
      const updatedIdea = ideas.find((idea) => idea.id === showModal.id);
      if (updatedIdea) setShowModal(updatedIdea);
    }
  }, [ideas, showModal]);  // Added 'showModal' as a dependency
  

  // Fetch comments for a specific idea
  const fetchComments = async (ideaId) => {
    try {
      const response = await axios.get(`http://localhost:5050/api/comments/${ideaId}`);
      setCommentData((prevComments) => ({ ...prevComments, [ideaId]: response.data }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Add a new comment
  const handleAddComment = async (ideaId) => {
    try {
      await axios.post(`http://localhost:5050/api/comments`, {
        comment: newComment[ideaId],
        commentedBy: userId,
        commentedOn: ideaId,
      });
      setNewComment({ ...newComment, [ideaId]: '' });
      fetchComments(ideaId);
      showNotification('New comment has been added!');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Show notification
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000); // Hide notification after 3 seconds
  };

  // Handle delete confirmation
  const handleDeleteClick = (ideaId) => {
    setDeleteIdeaId(ideaId);
    setShowDeleteConfirm(true); // Show confirmation popup
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await handleDelete(deleteIdeaId); // Delete the idea
      setShowDeleteConfirm(false);
      setDeleteIdeaId(null);
      showNotification('Idea has been deleted!');
      closeModal();
    } catch (error) {
      console.error('Error deleting idea:', error);
      showNotification('Failed to delete idea');
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteIdeaId(null);
  };

  // Delete a comment
  const handleDeleteComment = async () => {
    try {
      await axios.delete(`http://localhost:5050/api/comments/${deleteCommentId}`);
      setShowDeleteCommentConfirm(false);
      setDeleteCommentId(null);
      showNotification('Comment has been deleted!');
      fetchComments(deleteIdeaId); // Re-fetch comments for the idea
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Confirm delete comment
  const confirmDeleteComment = (commentId, ideaId) => {
    setDeleteCommentId(commentId);
    setDeleteIdeaId(ideaId);
    setShowDeleteCommentConfirm(true);
  };

  // Close delete confirmation modal
  const closeDeleteCommentConfirm = () => {
    setShowDeleteCommentConfirm(false);
    setDeleteCommentId(null);
    setDeleteIdeaId(null);
  };

  // Toggle comments in modal
  const toggleComments = (ideaId) => {
    if (!showComments[ideaId]) {
      fetchComments(ideaId);
    }
    setShowComments((prevState) => ({
      ...prevState,
      [ideaId]: !prevState[ideaId],
    }));
  };

  // Open and close modal
  const openModal = (idea) => setShowModal(idea);
  const closeModal = () => setShowModal(null);

  return (
    <div>
      <ul className="idea-list">
        {ideas.map((idea) => (
          <li key={idea.id} className="idea-item" onClick={() => openModal(idea)}>
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
              <p className="idea-description" dangerouslySetInnerHTML={{ __html: idea.description }} />
            </div>
            <div className="idea-actions">
              <button className="like-btn" onClick={(e) => { e.stopPropagation(); handleLike(idea.id); }}>
                <FontAwesomeIcon icon={faThumbsUp} />
                <span className="likes-count">{idea.likes}</span>
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for idea details */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-modal-btn" onClick={closeModal}>
            &times;
          </button>
            <div className="modal-header">
              <span className="creator-username"><strong>By: {showModal.username}</strong></span>
              <span className="created-date">
                {new Date(showModal.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <h3 className="modal-title">{showModal.title}</h3>
            <p className="modal-description" dangerouslySetInnerHTML={{ __html: showModal.description }} />
            <div className="modal-actions">
              <button className="like-btn" onClick={() => handleLike(showModal.id)}>
                <FontAwesomeIcon icon={faThumbsUp} />
                <span className="likes-count">{showModal.likes}</span>
              </button>
              <button className="comment-toggle-btn" onClick={() => toggleComments(showModal.id)}>
              <FontAwesomeIcon icon={showComments[showModal.id] ? faAngleUp : faAngleDown} />
            </button>
              {userId === showModal.createdBy && (
                <>
                  <button className="edit-btn" onClick={() => handleEdit(showModal)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteClick(showModal.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </>
              )}
            </div>
            <div className="add-comment">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment[showModal.id] || ''}
                onChange={(e) => setNewComment({ ...newComment, [showModal.id]: e.target.value })}
              />
              <button className="add-comment-btn" onClick={() => handleAddComment(showModal.id)}>Add</button>
            </div>
            {showComments[showModal.id] && (
              <ul className="comments-list">
                {commentData[showModal.id]?.map((comment) => (
                  <li className="comment-text" key={comment.id}>
                    <strong>{comment.username}</strong>: {comment.comment}
                    {userId === comment.commentedBy && (
                      <button className="delete-comment-btn" onClick={() => confirmDeleteComment(comment.id, showModal.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
       {/* Notification */}
       {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

      {/* Delete confirmation popup */}
      {showDeleteConfirm && (
        <div className="confirmation-overlay">
          <div className="confirmation-dialog">
            <p>Are you sure you want to delete this idea?</p>
            <button className="confirm-btn" onClick={confirmDelete}>Yes</button>
            <button className="cancel-btn" onClick={cancelDelete}>No</button>
          </div>
        </div>
      )}
      {/* Comment delete confirmation modal */}
      {showDeleteCommentConfirm && (
        <div className="confirmation-overlay">
          <div className="confirmation-dialog">
            <p>Are you sure you want to delete this comment?</p>
            <button className="confirm-btn" onClick={handleDeleteComment}>Yes</button>
            <button className="cancel-btn" onClick={closeDeleteCommentConfirm}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaList;
