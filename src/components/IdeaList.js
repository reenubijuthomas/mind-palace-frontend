import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faThumbsUp, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import './IdeaList.css';
import ReactQuill from 'react-quill'; // Import React Quill
import 'react-quill/dist/quill.snow.css'; // Import the required Quill styles

const IdeaList = ({ ideas, handleDelete, handleEdit, handleLike, userId, isBinPage, isDraftPage, setDeletedIdeas }) => {
  const [commentData, setCommentData] = useState({});
  const [newComment, setNewComment] = useState({});
  const [showModal, setShowModal] = useState(null);
  const [showComments, setShowComments] = useState({});
  const [notification, setNotification] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIdeaId, setDeleteIdeaId] = useState(null);
  const [showDeleteCommentConfirm, setShowDeleteCommentConfirm] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState(null);

  // New state for edit mode and editable fields
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableTitle, setEditableTitle] = useState('');
  const [editableDescription, setEditableDescription] = useState('');

  useEffect(() => {
    if (showModal) {
      const updatedIdea = ideas.find((idea) => idea.id === showModal.id);
      if (updatedIdea) setShowModal(updatedIdea);
    }
  }, [ideas, showModal]);

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

  const permanentDelete = async (ideaId) => {
    try {
      await axios.delete(`http://localhost:5050/api/bin/${ideaId}`);
      showNotification('Idea has been permanently deleted!');
      setDeletedIdeas((prevDeletedIdeas) => prevDeletedIdeas.filter((idea) => idea.id !== ideaId));
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting idea:', error);
      showNotification('Failed to delete idea');
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
  const openModal = (idea) => {
    setShowModal(idea);
    setIsEditMode(false);
  };

  const closeModal = () => setShowModal(null);

  const handleEditClick = (idea) => {
    setEditableTitle(idea.title);
    setEditableDescription(idea.description);
    setIsEditMode(true);
  };

  const handleSave = async (id) => {
    try {
      await handleEdit({ id, title: editableTitle, description: editableDescription });
      setIsEditMode(false);
      showNotification('Idea has been updated!');
    } catch (error) {
      console.error('Error updating idea:', error);
      showNotification('Failed to update idea');
    }
  };
  // Function to get the approval status text
  const getApprovalStatus = (status) => {
    switch (status) {
      case 1:
        return 'Approved';
      case 2:
        return 'Rejected';
      default:
        return "";
    }
  };

  return (
    <div>
      <ul className="idea-list">
        {ideas.map((idea) => (
          <li key={idea.id} className="idea-item" onClick={() => openModal(idea)}>
            <div className="idea-header">
              <div className="creator-info">
                <span className="creator-username"><strong>By: {idea.username}</strong></span>
                <span className="created-date">
                  {new Date(idea.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              {!isBinPage && (
                <div className="approval-status-container">
                  <span
                    className={`approval-status ${idea.isApproved === 1 ? 'approved' : idea.isApproved === 0 ? 'pending' : 'rejected'
                      }`}
                  >
                    <strong>{getApprovalStatus(idea.isApproved)}</strong>
                  </span>
                </div>
              )}
            </div>
            <div className="idea-content">
              <h3>{idea.title}</h3>
              <p className="idea-description" dangerouslySetInnerHTML={{ __html: idea.description }} />
            </div>
            {isBinPage && (
              <button
                className="permanent-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(idea.id); // Trigger delete confirmation
                }}
              >
                Delete
              </button>
            )}
            {!isDraftPage && (
              <div className="idea-actions">
                <button
                  className="like-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isBinPage) return;  // Prevent like action on BinPage
                    handleLike(idea.id);  // Proceed with like action on other pages
                  }}
                  disabled={isBinPage}  // Disable the button if it's on the BinPage
                >
                  <FontAwesomeIcon icon={faThumbsUp} />
                  <span className="likes-count">{idea.likes}</span>
                </button>
              </div>
            )}
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

              {!isBinPage && (
                <div className="approval-status-container2">
                  <span
                    className={`approval-status ${showModal.isApproved === 1 ? 'approved' : showModal.isApproved === 0 ? 'pending' : 'rejected'
                      }`}
                  >
                    <strong>{getApprovalStatus(showModal.isApproved)}</strong>
                  </span>
                </div>
              )}
            </div>
            {isEditMode ? (
              <div>
                <div className="edit-input-group">
                  <label className="edit-input-title" htmlFor="editableTitle">Title:</label>
                  <input
                    id="editableTitle"
                    type="text"
                    value={editableTitle}
                    onChange={(e) => setEditableTitle(e.target.value)}
                    placeholder="Enter idea title"
                  />
                </div>

                <div className="edit-input-group">
                  <label htmlFor="editableDescription">Description:</label>
                  <ReactQuill
                    value={editableDescription} // Use editableDescription for binding
                    onChange={setEditableDescription} // Update editableDescription state
                    placeholder="Enter idea description"
                    modules={{
                      toolbar: [
                        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['bold', 'italic', 'underline'],
                        [{ 'align': [] }],
                        ['link'],
                        [{ 'color': [] }, { 'background': [] }],
                        ['blockquote'],
                        ['code-block'],
                      ],
                    }}
                  />
                </div>
              </div>
            ) : (
              <>
                <h3 className="modal-title">{showModal.title}</h3>
                <div className="modal-description" dangerouslySetInnerHTML={{ __html: showModal.description }}></div>
              </>
            )}
            <div className="modal-actions">
              <button
                className="like-btn"
                onClick={() => {
                  if (isBinPage) return;  // Prevent like action on BinPage
                  handleLike(showModal.id);  // Proceed with like action on other pages
                }}
                disabled={isBinPage}  // Disable the button if it's on the BinPage
              >
                <FontAwesomeIcon icon={faThumbsUp} />
                <span className="likes-count">{showModal.likes}</span>
              </button>
              <button className="comment-toggle-btn" onClick={() => toggleComments(showModal.id)}>
                <FontAwesomeIcon icon={showComments[showModal.id] ? faAngleUp : faAngleDown} />
              </button>
              {userId === showModal.createdBy && !isBinPage && (
                <>
                  {isEditMode ? (
                    <button className="save-btn" onClick={() => handleSave(showModal.id)}>Save</button>
                  ) : (
                    <button className="edit-btn" onClick={() => handleEditClick(showModal)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  )}
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
                    {userId === comment.commentedBy && !isBinPage && (
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
            <button
              className="confirm-btn"
              onClick={() => {
                if (isBinPage) {
                  permanentDelete(deleteIdeaId); 
                } else {
                  confirmDelete(); 
                }
              }}
            >
              Yes
            </button>
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
