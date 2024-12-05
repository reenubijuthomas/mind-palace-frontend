import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faThumbsUp, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const IdeaList = ({ ideas, handleDelete, handleEdit, handleLike, userId, isBinPage, isDraftPage, setDeletedIdeas, setDrafts, isDarkMode = false }) => {
  const [commentData, setCommentData] = useState({});
  const [newComment, setNewComment] = useState({});
  const [showModal, setShowModal] = useState(null);
  const [showComments, setShowComments] = useState({});
  const [notification, setNotification] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIdeaId, setDeleteIdeaId] = useState(null);
  const [showDeleteCommentConfirm, setShowDeleteCommentConfirm] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableTitle, setEditableTitle] = useState('');
  const [editableDescription, setEditableDescription] = useState('');

  useEffect(() => {
    if (showModal) {
      const updatedIdea = ideas.find((idea) => idea.id === showModal.id);
      if (updatedIdea) setShowModal(updatedIdea);
    }
  }, [ideas, showModal]);

  const fetchComments = async (ideaId) => {
    try {
      const response = await axios.get(`http://localhost:5050/api/comments/${ideaId}`);
      const generalComments = response.data.filter(comment => !comment.isApproverComment);
      const approverComment = response.data.find(comment => comment.isApproverComment);
      setCommentData((prevComments) => ({
        ...prevComments,
        [ideaId]: {
          generalComments: generalComments,
          approverComment: approverComment || null,
        },
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async (ideaId) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newComment[ideaId];
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    if (!plainText.trim()) {
      showNotification('Please add a comment before submitting!');
      return;
    }
    try {
      await axios.post(`http://localhost:5050/api/comments`, {
        comment: newComment[ideaId],
        commentedBy: userId,
        commentedOn: ideaId,
      });
      setNewComment({ ...newComment, [ideaId]: '' });
      fetchComments(ideaId);
      showNotification("New comment has been added!");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 5000);
  };

  const handleDeleteClick = (ideaId) => {
    setDeleteIdeaId(ideaId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await handleDelete(deleteIdeaId);
      setShowDeleteConfirm(false);
      setDeleteIdeaId(null);
      showNotification("Idea has been deleted!");
      closeModal();
    } catch (error) {
      console.error("Error deleting idea:", error);
      showNotification("Failed to delete idea");
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteIdeaId(null);
  };

  const handleDeleteComment = async () => {
    try {
      await axios.delete(`http://localhost:5050/api/comments/${deleteCommentId}`);
      setShowDeleteCommentConfirm(false);
      setDeleteCommentId(null);
      showNotification("Comment has been deleted!");
      fetchComments(deleteIdeaId);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const toggleComments = (ideaId) => {
    setShowComments((prev) => ({
      ...prev,
      [ideaId]: !prev[ideaId],
    }));
    if (!showComments[ideaId]) fetchComments(ideaId);
  };

  const openModal = (idea) => {
    fetchComments(idea.id);
    setShowModal(idea);
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
      showNotification("Idea has been updated!");
    } catch (error) {
      console.error("Error updating idea:", error);
      showNotification("Failed to update idea");
    }
  };

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
    <div className="flex flex-wrap justify-center gap-4">
      {ideas.map((idea) => (
        <div
          key={idea.id}
          className={`relative flex flex-col justify-between p-4 rounded-lg shadow-lg transition-all hover:shadow-xl cursor-pointer card ${isDarkMode ? "dark" : ""}`}
          style={{ height: "230px", width: "230px" }}
          onClick={() => openModal(idea)}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              <strong>By: {idea.username}</strong>
            </span>
            <span className="text-sm text-gray-500">
              {new Date(idea.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold truncate">{idea.title}</h3>
            <p
              className="mt-2 text-sm text-gray-600 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: idea.description }}
            ></p>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              className={`px-3 py-1 rounded-md text-white ${idea.isApproved === 1
                ? "bg-green-500"
                : idea.isApproved === 2
                  ? "bg-red-500"
                  : "bg-yellow-500"
                }`}
            >
              {idea.isApproved === 1
                ? "Approved"
                : idea.isApproved === 2
                  ? "Rejected"
                  : "Pending"}
            </button>
            {userId === idea.createdBy && !isBinPage && (
              <button
                className="text-sm px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(idea.id);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Modal */}
      {showModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center modal ${isDarkMode ? "dark" : ""}`}
          onClick={closeModal}
        >
          <div
            className="relative w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-lg modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-3xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>

            {isEditMode ? (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2" htmlFor="editableTitle">Title:</label>
                  <input
                    id="editableTitle"
                    type="text"
                    value={editableTitle}
                    onChange={(e) => setEditableTitle(e.target.value)}
                    placeholder="Enter idea title"
                    className="input-field"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Description:</label>
                  <ReactQuill
                    value={editableDescription}
                    onChange={setEditableDescription}
                    placeholder="Enter idea description"
                    className="bg-white"
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
                <div className="flex space-x-2 mt-4">
                  <button
                    className="button-primary"
                    onClick={() => handleSave(showModal.id)}
                  >
                    Save
                  </button>
                  <button
                    className="button-secondary"
                    onClick={() => setIsEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">{showModal.title}</h2>
                <div
                  className="prose max-w-none mb-4"
                  dangerouslySetInnerHTML={{ __html: showModal.description }}
                ></div>
              </>
            )}

            <div className="flex space-x-4 mt-4">
              <button
                className="button-primary"
                onClick={() => toggleComments(showModal.id)}
              >
                <FontAwesomeIcon
                  icon={showComments[showModal.id] ? faAngleUp : faAngleDown}
                />{" "}
                Comments
              </button>
              <button
                className="button-primary"
                onClick={() => handleLike(showModal.id)}
              >
                <FontAwesomeIcon icon={faThumbsUp} /> Like ({showModal.likes})
              </button>
              {userId === showModal.createdBy && !isBinPage && !isEditMode && (
                <>
                  <button
                    className="button-primary bg-yellow-500 hover:bg-yellow-600"
                    onClick={() => handleEditClick(showModal)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="button-primary bg-red-500 hover:bg-red-600"
                    onClick={() => handleDeleteClick(showModal.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </>
              )}
            </div>

            {/* Comments Section */}
            {showComments[showModal.id] && (
              <div className="mt-4">
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment[showModal.id] || ''}
                    onChange={(e) => setNewComment({ ...newComment, [showModal.id]: e.target.value })}
                    className="input-field"
                  />
                  <button
                    className="button-primary mt-2"
                    onClick={() => handleAddComment(showModal.id)}
                  >
                    Add Comment
                  </button>
                </div>

                {commentData[showModal.id]?.generalComments?.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md mb-2 flex justify-between items-center"
                  >
                    <div>
                      <strong>{comment.username}</strong>: {comment.comment}
                    </div>
                    {userId === comment.commentedBy && !isBinPage && (
                      <button
                        className="text-red-500 hover:text-red-700 dark:text-red-400"
                        onClick={() => confirmDeleteComment(comment.id, showModal.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md">
          {notification}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-xl">
            <p className="mb-4">Are you sure you want to delete this idea?</p>
            <div className="flex space-x-4">
              <button
                className="button-primary bg-red-500 hover:bg-red-600"
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
              <button
                className="button-secondary"
                onClick={cancelDelete}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comment Delete Confirmation Modal */}
      {showDeleteCommentConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-xl">
            <p className="mb-4">Are you sure you want to delete this comment?</p>
            <div className="flex space-x-4">
              <button
                className="button-primary bg-red-500 hover:bg-red-600"
                onClick={handleDeleteComment}
              >
                Yes
              </button>
              <button
                className="button-secondary"
                onClick={closeDeleteCommentConfirm}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaList;