import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faThumbsUp, faAngleDown, faAngleUp, faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import BASE_URL from "../config.jsx";

const Approvals = ({ userId, theme }) => {
  const [approvalIdeas, setApprovalIdeas] = useState([]);
  const [comments, setComments] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [showModal, setShowModal] = useState(null);
  const [notification, setNotification] = useState("");
  const [commentVisibility, setCommentVisibility] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(null);
  const [actionType, setActionType] = useState('');
  const [toggleSections, setToggleSections] = useState({
    pending: true,
    approved: false,
    rejected: false,
  });
  const [approvalComment, setApprovalComment] = useState("");
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [showDeleteCommentConfirm, setShowDeleteCommentConfirm] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [deleteIdeaId, setDeleteIdeaId] = useState(null);

  const isDarkMode = theme === 'dark';
  useEffect(() => {
    const fetchApprovalIdeas = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/approvals`);
        const ideas = Array.isArray(response.data) ? response.data : [];
        setApprovalIdeas(ideas);

        const commentsResponses = await Promise.all(
          ideas.map((idea) => axios.get(`${BASE_URL}/api/comments/${idea.id}`))
        );

        const commentsMap = {};
        commentsResponses.forEach(({ data }, index) => {
          const generalComments = data.filter((comment) => !comment.isApproverComment);
          const approverComment = data.find((comment) => comment.isApproverComment);

          commentsMap[ideas[index].id] = {
            generalComments: generalComments,
            approverComment: approverComment || null,
          };
        });

        setComments(commentsMap);
      } catch (error) {
        console.error("Error fetching approval ideas or comments:", error);
      }
    };

    fetchApprovalIdeas();
  }, []);

  const handleApprove = async (ideaId) => {
    try {
      const commentResponse = await axios.post(`${BASE_URL}/api/comments`, {
        comment: approvalComment || "",
        commentedBy: userId,
        commentedOn: ideaId,
        isApproverComment: true,
      });

      const newComment = commentResponse.data;

      setComments((prev) => ({
        ...prev,
        [ideaId]: {
          ...prev[ideaId],
          approverComment: newComment,
        },
      }));

      await axios.put(`${BASE_URL}/api/approvals/approve/${ideaId}`);
      setApprovalIdeas((prev) =>
        prev.map((idea) =>
          idea.id === ideaId ? { ...idea, status: "Approved", isApproved: 1 } : idea
        )
      );

      setShowModal(false); // Close the idea modal
      setShowConfirmation(false); // Close the confirmation modal
      setApprovalComment("");
      showNotification("Idea approved successfully!");
    } catch (error) {
      console.error("Error approving idea:", error);
    }
  };

  const handleReject = async (ideaId) => {
    try {
      const commentResponse = await axios.post(`${BASE_URL}/api/comments`, {
        comment: approvalComment || "",
        commentedBy: userId,
        commentedOn: ideaId,
        isApproverComment: true,
      });

      const newComment = commentResponse.data;

      setComments((prev) => ({
        ...prev,
        [ideaId]: {
          ...prev[ideaId],
          approverComment: newComment,
        },
      }));

      await axios.put(`${BASE_URL}/api/approvals/reject/${ideaId}`);
      setApprovalIdeas((prev) =>
        prev.map((idea) =>
          idea.id === ideaId ? { ...idea, status: "Rejected", isApproved: 2 } : idea
        )
      );

      setShowModal(false); // Close the idea modal
      setShowConfirmation(false); // Close the confirmation modal
      setApprovalComment("");
      showNotification("Idea rejected successfully!");
    } catch (error) {
      console.error("Error rejecting idea:", error);
    }
  };
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 5000);
  };

  const toggleCommentsVisibility = (ideaId) => {
    setCommentVisibility((prev) => ({
      ...prev,
      [ideaId]: !prev[ideaId],
    }));
  };

  const openConfirmation = (idea, action) => {
    setShowConfirmation(idea);
    setActionType(action);
    //closeModal();
  };

  const closeConfirmation = () => {
    setShowConfirmation(null);
    setActionType('');
  };

  const toggleSection = (section) => {
    setToggleSections({
      pending: false,
      approved: false,
      rejected: false,
      [section]: true,
    });
  };

  const openModal = (idea) => {
    setShowModal(idea);
    setApprovalComment("");
  };

  const closeModal = () => setShowModal(null);

  const handleAddComment = async (ideaId) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/comments`, {
        comment: newComment[ideaId],
        commentedBy: userId,
        commentedOn: ideaId,
      });

      setComments((prev) => ({
        ...prev,
        [ideaId]: {
          ...prev[ideaId],
          generalComments: [...prev[ideaId].generalComments, response.data],
        },
      }));

      setNewComment((prev) => ({ ...prev, [ideaId]: '' }));
      showNotification('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const confirmDeleteComment = (commentId, ideaId) => {
    setDeleteCommentId(commentId);
    setDeleteIdeaId(ideaId);
    setShowDeleteCommentConfirm(true);
  };

  const handleDeleteComment = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/comments/${deleteCommentId}`);

      setComments((prev) => ({
        ...prev,
        [deleteIdeaId]: {
          ...prev[deleteIdeaId],
          generalComments: prev[deleteIdeaId].generalComments.filter(
            (comment) => comment.id !== deleteCommentId
          ),
        },
      }));

      setShowDeleteCommentConfirm(false);
      showNotification('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const closeDeleteCommentConfirm = () => {
    setShowDeleteCommentConfirm(false);
    setDeleteCommentId(null);
    setDeleteIdeaId(null);
  };

  const filteredIdeas = approvalIdeas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingIdeas = filteredIdeas.filter((idea) => idea.isApproved === 0 || idea.isApproved === null);
  const approvedIdeas = filteredIdeas.filter((idea) => idea.isApproved === 1);
  const rejectedIdeas = filteredIdeas.filter((idea) => idea.isApproved === 2);

  const getApprovalStatus = (status) => {
    switch (status) {
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
      default:
        return "Pending";
    }
  };
  const renderCard = (idea) => (
    <div
      key={idea.id}
      className={`relative flex flex-col justify-between p-4 rounded-lg shadow-lg transition-all hover:shadow-xl cursor-pointer
        ${isDarkMode
          ? "bg-gray-800 text-gray-100 border border-gray-700"
          : "bg-white text-gray-900"
        }`}
      style={{ height: "280px", width: "280px" }}
      onClick={() => openModal(idea)}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-2">
        <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          <strong>By: {idea.username}</strong>
        </span>
        <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          {new Date(idea.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Title and Description Section */}
      <div className="flex flex-col overflow-hidden min-h-[205px]">
        <h3 className={`card-title ${isDarkMode ? "text-white" : "text-gray-900"} truncate`}>
          {idea.title}
        </h3>
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


      {/* Footer Section */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
        {/* Like Button */}
        <div className="flex items-center space-x-2">
          <button
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm transition-all 
        ${isDarkMode
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
            disabled
          >
            <FontAwesomeIcon icon={faThumbsUp} />
            <span>({idea.likes})</span>
          </button>
        </div>

        {/* Status Section */}
        <div>
          <span
            className={`px-3 py-1 rounded-md text-sm font-semibold text-white 
        ${idea.isApproved === 1
                ? "bg-green-600"
                : idea.isApproved === 2
                  ? "bg-red-600"
                  : "bg-yellow-600"
              }`}
          >
            {getApprovalStatus(idea.isApproved)}
          </span>
        </div>
      </div>

    </div>
  );


  return (
    <div className={`min-h-screen p-6 ${theme} flex flex-col items-center transition-all`}>
      {/* Title Section */}
      <div className="pt-24 pb-8 text-center">
        <h1 className={`text-4xl font-extrabold tracking-wide ${isDarkMode ? "text-indigo-300" : "text-indigo-700"}`}>
          Approvals
        </h1>
        <p className={`mt-4 text-lg font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          Manage and approve or reject ideas
        </p>
      </div>

      {/* Search Bar */}
      <div className="search-bar mx-auto">
        <i className="fa fa-search search-icon"></i>
        <input
          type="text"
          placeholder="Search ideas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`search-input ${theme === 'dark' ? 'dark-search-bar' : 'light-search-bar'}`}
        />
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        {["pending", "approved", "rejected"].map((section) => (
          <button
            key={section}
            onClick={() => toggleSection(section)}
            className={`px-4 py-2 rounded-md font-semibold transition-all duration-300 ${toggleSections[section]
              ? isDarkMode
                ? "bg-gray-800 text-indigo-400"
                : "bg-gray-200 text-indigo-600"
              : isDarkMode
                ? "bg-gray-700 text-gray-400"
                : "bg-gray-100 text-gray-500"
              }`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>

      {/* Ideas Grid */}
      <div className="w-full max-w-7xl">
        <div className="flex flex-wrap justify-center gap-4">
          {toggleSections.pending && pendingIdeas.map(renderCard)}
          {toggleSections.approved && approvedIdeas.map(renderCard)}
          {toggleSections.rejected && rejectedIdeas.map(renderCard)}
        </div>
      </div>
      {/* Modal */}

      {showModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 ${isDarkMode ? "bg-gray-900" : "bg-black"}`}
          onClick={closeModal}
        >
          <div
            className={`relative w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-lg ${isDarkMode
              ? "bg-gray-800 text-gray-100 border border-gray-700"
              : "bg-white text-gray-900"
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Comments Section with Font Awesome Icon */}
            {showModal && (
              <div
                className={`fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 ${isDarkMode ? "bg-gray-900" : "bg-black"}`}
                onClick={closeModal}
              >
                <div
                  className={`relative w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-lg flex flex-col ${isDarkMode
                    ? "bg-gray-800 text-gray-100 border border-gray-700"
                    : "bg-white text-gray-900"
                    }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="absolute top-4 right-4 text-3xl font-bold text-gray-500 hover:text-gray-700"
                    onClick={closeModal}
                  >
                    &times;
                  </button>

                  {/* Content Container - Aligned to Top */}
                  <div className="flex flex-col items-start space-y-4">
                    {/* Title Section */}
                    <div className="mb-4">
                      <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                        <strong>By: {showModal.username}</strong>
                      </span>
                      <span className={`ml-4 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {new Date(showModal.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold">{showModal.title}</h2>

                    <div
                      className="prose max-w-none mb-6"
                      dangerouslySetInnerHTML={{ __html: showModal.description }}
                    />
                  </div>

                  {(showModal.isApproved === 1 || showModal.isApproved === 2) &&
  comments[showModal.id]?.approverComment?.comment && (
    <div
      className={`mt-6 mb-2 p-6 rounded-lg shadow-md transition-all ${
        showModal.isApproved === 1
          ? "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-200"
          : "bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-200"
      }`}
    >
      <div className="flex items-start space-x-4">
        <p
          className={`font-semibold text-lg ${
            showModal.isApproved === 1
              ? "text-green-900 dark:text-green-200"
              : "text-red-900 dark:text-red-200"
          }`}
        >
          {showModal.isApproved === 1 ? "Approval" : "Rejection"} Comment:
        </p>
        <p className={`text-sm mt-1 ${
          showModal.isApproved === 1
            ? "text-green-800 dark:text-green-300"
            : "text-red-800 dark:text-red-300"
        }`}>
          {comments[showModal.id]?.approverComment?.comment}
        </p>
      </div>
    </div>
  )}

                  {/* Approval comment input */}
                  {showModal.isApproved === 0 && (
                    <div className="space-y-4 mb-6">
                      <label
                        htmlFor="approval-comment"
                        className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                      >

                      </label>
                      <textarea
                        id="approval-comment"
                        value={approvalComment}
                        onChange={(e) => setApprovalComment(e.target.value)}
                        placeholder="Add a comment for approval or rejection..."
                        className={`w-full p-4 border-2 rounded-lg text-sm font-medium resize-none shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all
        ${isDarkMode
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-indigo-400"
                            : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-indigo-500"
                          }`}
                        rows="4"
                      />

                      <div className="flex justify-end space-x-6">
                        <button
                          className={`px-4 py-2 rounded-md text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-all`}
                          onClick={() => openConfirmation(showModal, "approve")}
                        >
                          Approve
                        </button>
                        <button
                          className={`px-4 py-2 rounded-md text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-all`}
                          onClick={() => openConfirmation(showModal, "reject")}
                        >
                          Reject
                        </button>
                      </div>

                    </div>
                  )}

                  {/* Comments Section */}
                  <div className="mt-4 border-t pt-4 flex items-center space-x-4">
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
                      onClick={() => setIsCommentsOpen(!isCommentsOpen)} // Toggle comments visibility
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all 
    ${isDarkMode
                          ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        }`}
                    >
                      <FontAwesomeIcon
                        icon={faCommentDots} // Comment icon
                        className="mr-2"
                      />
                      <span>{isCommentsOpen ? 'Hide Comments' : 'Comments'}</span>
                    </button>

                  </div>

                  {isCommentsOpen && comments[showModal.id]?.generalComments?.length > 0 && (
                    <div className="mt-4">
                      {comments[showModal.id]?.generalComments.map((comment) => (
                        <div
                          key={comment.id}
                          className={`p-3 rounded mb-2 flex justify-between items-center ${isDarkMode
                            ? "bg-gray-700 border border-gray-600"
                            : "bg-gray-50 border border-gray-200"
                            }`}
                        >
                          <div className="flex-grow">
                            <strong className={isDarkMode ? "text-indigo-400" : "text-indigo-600"}>
                              {comment.username}
                            </strong>
                            : {comment.comment}
                          </div>
                          {userId === comment.commentedBy && (
                            <button
                              className="text-red-500 hover:text-red-700"
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

            {/* Confirmation Dialog */}
            {showConfirmation && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className={`p-6 rounded-lg shadow-xl ${isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
                  }`}>
                  <p className="mb-4">
                    Are you sure you want to {actionType} this idea?
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button
                      className={`px-4 py-2 rounded ${actionType === 'approve'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-red-500 hover:bg-red-600'
                        } text-white`}
                      onClick={() => {
                        if (actionType === 'approve') {
                          handleApprove(showModal.id); // Calls handleApprove
                        } else {
                          handleReject(showModal.id); // Calls handleReject
                        }
                        closeConfirmation(); // Close the confirmation dialog after action
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      className={`px-4 py-2 rounded ${isDarkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      onClick={closeConfirmation}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
      {/* Comment Delete Confirmation */}
      {showDeleteCommentConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`p-6 rounded-lg shadow-xl ${isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
            }`}>
            <p className="mb-4">Are you sure you want to delete this comment?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
                onClick={handleDeleteComment}
              >
                Yes
              </button>
              <button
                className={`px-4 py-2 rounded ${isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
                  }`}
                onClick={closeDeleteCommentConfirm}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
{/* Notification */}
{notification && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-md shadow-md">
          {notification}
        </div>
      )}
    </div>
  );
};

export default Approvals;