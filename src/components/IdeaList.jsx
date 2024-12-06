import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faThumbsUp, faAngleDown, faAngleUp, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import BASE_URL from '../config.jsx';

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
      const response = await axios.get(`${BASE_URL}/api/comments/${ideaId}`);
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
      await axios.post(`${BASE_URL}/api/comments`, {
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

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 5000);
  };

  const handleDeleteClick = (ideaId) => {
    setDeleteIdeaId(ideaId);
    setShowDeleteConfirm(true);
  };

  const permanentDelete = async (ideaId) => {
    try {
      await axios.delete(`${BASE_URL}/api/bin/${ideaId}`);
      showNotification('Idea has been permanently deleted!');
      setDeletedIdeas((prevDeletedIdeas) => prevDeletedIdeas.filter((idea) => idea.id !== ideaId));
      setShowDeleteConfirm(false);
      closeModal();
    } catch (error) {
      console.error('Error deleting idea:', error);
      showNotification('Failed to delete idea');
    }
  };

  const confirmDelete = async () => {
    try {
      await handleDelete(deleteIdeaId);
      setShowDeleteConfirm(false);
      setDeleteIdeaId(null);
      showNotification('Idea has been deleted!');
      closeModal();
    } catch (error) {
      console.error('Error deleting idea:', error);
      showNotification('Failed to delete idea');
    }
  };

  const handleRestore = async (ideaId) => {
    try {
      await axios.put(`${BASE_URL}/api/bin/restore/${ideaId}`);
      setDeletedIdeas((prevDeletedIdeas) =>
        prevDeletedIdeas.filter((idea) => idea.id !== ideaId)
      );
      showNotification('Idea has been restored!');
    } catch (error) {
      console.error('Error restoring idea:', error);
      showNotification('Failed to restore idea');
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteIdeaId(null);
  };

  const handleDeleteComment = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/comments/${deleteCommentId}`);
      setShowDeleteCommentConfirm(false);
      setDeleteCommentId(null);
      showNotification('Comment has been deleted!');
      fetchComments(deleteIdeaId);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const confirmDeleteComment = (commentId, ideaId) => {
    setDeleteCommentId(commentId);
    setDeleteIdeaId(ideaId);
    setShowDeleteCommentConfirm(true);
  };

  const closeDeleteCommentConfirm = () => {
    setShowDeleteCommentConfirm(false);
    setDeleteCommentId(null);
    setDeleteIdeaId(null);
  };

  const submitDraft = async (ideaId) => {
    try {
      await axios.put(`${BASE_URL}/api/drafts/submit/${ideaId}`);
      setDrafts((prevIdeas) => prevIdeas.filter((idea) => idea.id !== ideaId));
      showNotification('Idea has been saved successfully!');
    } catch (error) {
      console.error('Error submitting draft:', error);
    }
  };

  const toggleComments = (ideaId) => {
    if (!showComments[ideaId]) {
      fetchComments(ideaId);
    }
    setShowComments((prevState) => ({
      ...prevState,
      [ideaId]: !prevState[ideaId],
    }));
  };

  const openModal = (idea) => {
    fetchComments(idea.id);
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

  const getApprovalStatus = (status) => {
    switch (status) {
      case 1:
        return 'Approved';
      case 2:
        return 'Rejected';
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 pb-16">
      {ideas.map((idea) => (
        <div
          key={idea.id}
          className={`relative flex flex-col justify-between p-4 rounded-lg shadow-lg transition-all hover:shadow-xl cursor-pointer card 
      ${isDarkMode
              ? "bg-gray-800 text-gray-100 border border-gray-700"
              : "bg-white text-gray-900"
            }`}
          style={{ height: "280px", width: "280px" }}
          onClick={() => openModal(idea)}
        >
          <div className="flex justify-between items-center mb-2">
            <span className={`card-metadata ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              <strong>By: {idea.username}</strong>
            </span>
            <span className={`card-metadata ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              {new Date(idea.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex flex-col overflow-hidden min-h-[180px]">
            <h3 className={`card-title ${isDarkMode ? "text-white" : "text-gray-900"} truncate`}>{idea.title}</h3>
            <div
              className={`card-description overflow-hidden line-clamp-6 ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 6,
                WebkitBoxOrient: 'vertical',
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}
              dangerouslySetInnerHTML={{ __html: idea.description }}
            ></div>
          </div>
          <div className="absolute bottom-4 left-4 flex items-center space-x-2">
            <button
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm transition-all 
      ${isDarkMode
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent the modal from opening
                handleLike(idea.id);
              }}
            >
              <FontAwesomeIcon icon={faThumbsUp} />
              <span>({idea.likes})</span>
            </button>
          </div>

          {/* Approved status moved to the bottom right */}
          <div className="absolute bottom-4 right-4">
            {(idea.isApproved === 1 || idea.isApproved === 2) && !isDraftPage && (
              <span
                className={`px-3 py-1 rounded-md text-white font-semibold ${idea.isApproved === 1 ? "bg-green-600" : "bg-red-600"}`}
              >
                {idea.isApproved === 1 ? "Approved" : "Rejected"}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center mt-4">
            {isDraftPage && (
              <div className="absolute bottom-4 right-4">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    submitDraft(idea.id);
                  }}
                >
                  Submit
                </button>
              </div>
            )}

            {isBinPage && (
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button
                  className="text-sm px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(idea.id);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button
                  className="text-sm px-2 py-1 rounded bg-green-500 hover:bg-green-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestore(idea.id);
                  }}
                >
                  Restore
                </button>
              </div>
            )}

          </div>
        </div>
      ))}

      {/* Modal */}
      {showModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center modal 
          ${isDarkMode
              ? "bg-gray-900 bg-opacity-80 text-gray-100"
              : "bg-black bg-opacity-50"
            }`}
          onClick={closeModal}
        >
          <div
            className={`relative w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-lg modal-content 
            ${isDarkMode
                ? "bg-gray-800 text-gray-100 border border-gray-700"
                : "bg-white text-gray-900"
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-3xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>

            <div className="mb-4 flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-600">
                  <strong>By: {showModal.username}</strong>
                </span>
                <span className="ml-4 text-sm text-gray-500">
                  {new Date(showModal.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {/* Approval Status - Bottom Right (Only in Modal) */}
              {showModal && getApprovalStatus(showModal.isApproved) && !isBinPage && (
                <div className="absolute bottom-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-md font-semibold text-white 
        ${showModal.isApproved === 1
                        ? "bg-green-600"
                        : "bg-red-600"
                      }`}
                  >
                    {showModal.isApproved === 1 ? "Approved" : "Rejected"}
                  </span>
                </div>
              )}

            </div>

            {isEditMode ? (
              <div>
                <div className="mb-4">
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-800"
                      }`}
                    htmlFor="editableTitle"
                  >
                    Title:
                  </label>
                  <input
                    id="editableTitle"
                    type="text"
                    value={editableTitle}
                    onChange={(e) => setEditableTitle(e.target.value)}
                    placeholder="Enter idea title"
                    className={`w-full px-3 py-2 border rounded-md ${isDarkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"
                      }`}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-800"
                      }`}
                  >
                    Description:
                  </label>
                  <ReactQuill
                    value={editableDescription}
                    onChange={setEditableDescription}
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
                    className={`react-quill ${isDarkMode ? "dark-react-quill" : "light-react-quill"}`}
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={() => handleSave(showModal.id)}
                  >
                    Save
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    onClick={() => setIsEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2
                  className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                >
                  {showModal.title}
                </h2>
                <div
                  className="prose max-w-none mb-4"
                  dangerouslySetInnerHTML={{ __html: showModal.description }}
                ></div>
              </>
            )}

            {isBinPage && (
              <div className="absolute bottom-4 right-4 flex space-x-4">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  onClick={() => {
                    handleRestore(showModal.id);
                    closeModal();
                  }}
                >
                  Restore
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => {
                    permanentDelete(showModal.id);
                    closeModal();
                  }}
                >
                  Delete
                </button>
              </div>
            )}

            <div className="flex space-x-4 mt-4 items-center">
              <button
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all 
                  ${isDarkMode
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  }`}
                onClick={() => handleLike(showModal.id)}
              >
                <FontAwesomeIcon icon={faThumbsUp} />
                <span>({showModal.likes})</span>
              </button>
              <button
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all 
                  ${isDarkMode
                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  }`}
                onClick={() => toggleComments(showModal.id)}
              >
                <FontAwesomeIcon icon={faCommentDots} />
                <span>Comments</span>
              </button>
              {/* Edit and Delete buttons */}
              {userId === showModal.createdBy && !isBinPage && !isEditMode && (
                <>
                  <button
                    className={`px-3 py-2 rounded-lg transition-all 
                      ${isDarkMode
                        ? "bg-yellow-700 text-yellow-100 hover:bg-yellow-600"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      }`}
                    onClick={() => handleEditClick(showModal)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className={`px-3 py-2 rounded-lg transition-all 
                      ${isDarkMode
                        ? "bg-red-700 text-red-100 hover:bg-red-600"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    onClick={() => handleDeleteClick(showModal.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </>
              )}
            </div>

            {showComments[showModal.id] && (
              <div className="mt-4">
                <div className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment[showModal.id] || ''}
                    onChange={(e) => setNewComment({ ...newComment, [showModal.id]: e.target.value })}
                    className={`flex-grow px-3 py-2 rounded-md border transition-all ${isDarkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
                      : "bg-gray-100 text-gray-900 border-gray-300 placeholder-gray-600 focus:border-indigo-500 focus:ring-indigo-500"
                      }`}
                  />
                  <button
                    className={`px-4 py-2 rounded-md whitespace-nowrap ${isDarkMode
                      ? "bg-indigo-600 text-gray-200 hover:bg-indigo-500"
                      : "bg-indigo-500 text-white hover:bg-indigo-600"
                      }`}
                    onClick={() => handleAddComment(showModal.id)}
                  >
                    Add Comment
                  </button>
                </div>

                {/* Add space between comment input and comments list */}
                <div className="space-y-2 mt-4">
                  {commentData[showModal.id]?.generalComments?.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-3 rounded-md flex justify-between items-center transition-all ${isDarkMode
                        ? "bg-gray-800 text-gray-200 border border-gray-700"
                        : "bg-gray-100 text-gray-900 border border-gray-300"
                        }`}
                    >
                      <div>
                        <strong className={`${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                          {comment.username}
                        </strong>
                        : {comment.comment}
                      </div>
                      {userId === comment.commentedBy && !isBinPage && (
                        <button
                          className={`px-3 py-2 rounded-lg transition-all 
                ${isDarkMode
                              ? "bg-red-700 text-red-100 hover:bg-red-600"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                            }`}
                          onClick={() => confirmDeleteComment(comment.id, showModal.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
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
          <div className={`p-6 rounded-lg shadow-xl 
      ${isDarkMode
              ? "bg-gray-800 text-gray-200"
              : "bg-white text-gray-900"
            }`}
          >
            <p className="mb-4">Are you sure you want to delete this idea?</p>
            <div className="flex justify-center space-x-4"> {/* Updated to justify-center */}
              <button
                className={`px-4 py-2 rounded-md text-white 
            ${isDarkMode
                    ? "bg-red-700 hover:bg-red-600"
                    : "bg-red-500 hover:bg-red-600"
                  }`}
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
                className={`px-4 py-2 rounded-md 
            ${isDarkMode
                    ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                  }`}
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
          <div className={`p-6 rounded-lg shadow-xl 
      ${isDarkMode
              ? "bg-gray-800 text-gray-200"
              : "bg-white text-gray-900"
            }`}
          >
            <p className="mb-4">Are you sure you want to delete this comment?</p>
            <div className="flex justify-center space-x-4"> {/* Updated to justify-center */}
              <button
                className={`px-4 py-2 rounded-md text-white 
            ${isDarkMode
                    ? "bg-red-700 hover:bg-red-600"
                    : "bg-red-500 hover:bg-red-600"
                  }`}
                onClick={handleDeleteComment}
              >
                Yes
              </button>
              <button
                className={`px-4 py-2 rounded-md 
            ${isDarkMode
                    ? "bg-gray-600 text-gray-200 hover:bg-gray-500"
                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                  }`}
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