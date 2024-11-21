import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaThumbsUp, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './Approvals.css';

const Approvals = ({ userId }) => {
  const [approvalIdeas, setApprovalIdeas] = useState([]);
  const [comments, setComments] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(null);
  const [notification, setNotification] = useState('');
  const [commentVisibility, setCommentVisibility] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(null);
  const [actionType, setActionType] = useState('');
  const [showPendingDropdown, setShowPendingDropdown] = useState(true);
  const [showApprovedRejectedDropdown, setShowApprovedRejectedDropdown] = useState(true);
  const [approvalComment, setApprovalComment] = useState('');

  useEffect(() => {
    const fetchApprovalIdeas = async () => {
      try {
        const response = await axios.get('http://localhost:5050/api/approvals');
        const ideas = Array.isArray(response.data) ? response.data : [];
        setApprovalIdeas(ideas);

        const commentsResponses = await Promise.all(
          ideas.map((idea) =>
            axios.get(`http://localhost:5050/api/comments/${idea.id}`)
          )
        );

        const commentsMap = {};
        commentsResponses.forEach(({ data }, index) => {
          const generalComments = data.filter(comment => !comment.isApproverComment);
          const approverComment = data.find(comment => comment.isApproverComment);

          commentsMap[ideas[index].id] = {
            generalComments: generalComments,
            approverComment: approverComment || null,
          };
        });

        setComments(commentsMap);
      } catch (error) {
        console.error('Error fetching approval ideas or comments:', error);
      }
    };

    fetchApprovalIdeas();
  }, []);


  const handleApprove = async (ideaId) => {
    try {
      const commentResponse = await axios.post(`http://localhost:5050/api/comments`, {
        comment: approvalComment || '',
        commentedBy: userId,
        commentedOn: ideaId,
        isApproverComment: true,
      });

      const newComment = commentResponse.data;

      setComments((prevComments) => {
        const existingComments = prevComments[ideaId] || { generalComments: [], approverComment: null };

        const updatedComments = {
          generalComments: [...existingComments.generalComments],
          approverComment: newComment,
        };

        return {
          ...prevComments,
          [ideaId]: updatedComments,
        };
      });

      await axios.put(`http://localhost:5050/api/approvals/approve/${ideaId}`);

      setApprovalIdeas((prev) =>
        prev.map((idea) =>
          idea.id === ideaId ? { ...idea, status: 'Approved', isApproved: 1 } : idea
        )
      );

      setShowConfirmation(null);
      closeModal();
      showNotification('Idea approved successfully!');
    } catch (error) {
      console.error('Error approving idea:', error);
    }
  };

  const handleReject = async (ideaId) => {
    try {
      const commentResponse = await axios.post(`http://localhost:5050/api/comments`, {
        comment: approvalComment || '',
        commentedBy: userId,
        commentedOn: ideaId,
        isApproverComment: true,
      });

      const newComment = commentResponse.data;
      setComments((prevComments) => {
        const existingComments = prevComments[ideaId] || { generalComments: [], approverComment: null };

        const updatedComments = {
          generalComments: [...existingComments.generalComments],
          approverComment: newComment,
        };

        return {
          ...prevComments,
          [ideaId]: updatedComments,
        };
      });

      await axios.put(`http://localhost:5050/api/approvals/reject/${ideaId}`);

      setApprovalIdeas((prev) =>
        prev.map((idea) =>
          idea.id === ideaId ? { ...idea, status: 'Rejected', isApproved: 2 } : idea
        )
      );

      setShowConfirmation(null);
      closeModal();
      showNotification('Idea rejected successfully!');
    } catch (error) {
      console.error('Error rejecting idea:', error);
    }
  };


  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 5000);
  };

  const filteredIdeas = approvalIdeas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingIdeas = filteredIdeas.filter((idea) => idea.isApproved === 0 || idea.isApproved === null);
  const approvedRejectedIdeas = filteredIdeas.filter((idea) => idea.isApproved === 1 || idea.isApproved === 2);

  const togglePendingDropdown = () => setShowPendingDropdown((prev) => !prev);
  const toggleApprovedRejectedDropdown = () => setShowApprovedRejectedDropdown((prev) => !prev);
  const openModal = (idea) => setShowModal(idea);
  const closeModal = () => setShowModal(null);

  const toggleCommentsVisibility = (ideaId) => {
    setCommentVisibility((prev) => ({
      ...prev,
      [ideaId]: !prev[ideaId],
    }));
  };

  const openConfirmation = (idea, action) => {
    setShowConfirmation(idea);
    setActionType(action);
  };

  const closeConfirmation = () => {
    setShowConfirmation(null);
    setActionType('');
  };

  return (
    <div>
      <h2>Approvals Page</h2>
      <input
        type="text"
        placeholder="Search ideas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar-new"
      />


      {/* Pending Approval Ideas Section */}
      {pendingIdeas.length > 0 && (
        <div className="dropdown-section">
          <section className="section-divider">
            <h3 onClick={togglePendingDropdown} className="dropdown-title">
              Pending Approval {showPendingDropdown ? "▼" : "▲"}
            </h3>
            {showPendingDropdown && (
              <ul className="idea-list">
                {pendingIdeas.map((idea) => (
                  <li key={idea.id} className="idea-item" onClick={() => openModal(idea)}>
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
                    <div className="idea-content">
                      <h3>{idea.title}</h3>
                      <p className="idea-description" dangerouslySetInnerHTML={{ __html: idea.description }} />
                    </div>
                    <div className="idea-likes">
                      <FaThumbsUp /> <span className="approvals-likes-count">{idea.likes}</span>
                    </div>
                    <div className="idea-status">
                      {idea.isApproved === null || idea.isApproved === 0 ? (
                        <span className="status-box pending">Pending</span>
                      ) : idea.isApproved === 1 ? (
                        <span className="status-box approved">Approved</span>
                      ) : (
                        <span className="status-box rejected">Rejected</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {/* Approved/Rejected Ideas Section */}
      {approvedRejectedIdeas.length > 0 && (
        <div className="dropdown-section">
          <section className="section-divider">
            <h3 onClick={toggleApprovedRejectedDropdown} className="dropdown-title">
              Approved / Rejected {showApprovedRejectedDropdown ? "▼" : "▲"}
            </h3>
            {showApprovedRejectedDropdown && (
              <ul className="idea-list">
                {approvedRejectedIdeas.map((idea) => (
                  <li key={idea.id} className="idea-item" onClick={() => openModal(idea)}>
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
                    <div className="idea-content">
                      <h3>{idea.title}</h3>
                      <p className="idea-description" dangerouslySetInnerHTML={{ __html: idea.description }} />
                    </div>
                    <div className="idea-likes">
                      <FaThumbsUp /> {idea.likes}
                    </div>
                    <div className="idea-status">
                      {idea.isApproved === null || idea.isApproved === 0 ? (
                        <span className="status-box pending">Pending</span>
                      ) : idea.isApproved === 1 ? (
                        <span className="status-box approved">Approved</span>
                      ) : (
                        <span className="status-box rejected">Rejected</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

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
              <p className="modal-status">
                <span
                  className={`status-box ${showModal.isApproved === 1 ? 'approved' :
                    showModal.isApproved === 2 ? 'rejected' : 'pending'
                    }`}
                >
                  {showModal.isApproved === 1 ? 'Approved' :
                    showModal.isApproved === 2 ? 'Rejected' : 'Pending'}
                </span>
              </p>
            </div>

            <h3 className="modal-title">{showModal.title}</h3>
            <div className="modal-description" dangerouslySetInnerHTML={{ __html: showModal.description }} />
            <div className="modal-comment">
              {(showModal.isApproved === 1 || showModal.isApproved === 2) && comments[showModal.id]?.approverComment?.comment && (
                <strong>
                  Approver's Comment: {comments[showModal.id]?.approverComment?.comment}
                </strong>
              )}
            </div>




            <div className="modal-likes-comments">
              <div className="modal-likes">
                <FaThumbsUp /> {showModal.likes}
              </div>
              <div
                className="comments-toggle"
                onClick={() => toggleCommentsVisibility(showModal.id)}
              >
                Comments {commentVisibility[showModal.id] ? <FaChevronUp /> : <FaChevronDown />}
              </div>
            </div>

            {commentVisibility[showModal.id] && (
              <ul className="comments-list">
                {comments[showModal.id]?.generalComments
                  .map((comment, idx) => (
                    <li key={idx}>
                      <strong>{comment.username}</strong>: {comment.comment}
                    </li>
                  ))}
              </ul>
            )}

            {showModal.isApproved === 0 && (
              <div className="modal-actions">
                <textarea
                  className="approval-comment"
                  placeholder="Add a comment for approval/rejection"
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                />
                <button className="approve-btn" onClick={() => openConfirmation(showModal, 'approve')}>
                  Approve
                </button>
                <button className="reject-btn" onClick={() => openConfirmation(showModal, 'reject')}>
                  Reject
                </button>
              </div>
            )}
            { }
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <p>Are you sure you want to {actionType} this idea?</p>
            <button
              className="confirm-btn"
              onClick={() => {
                if (actionType === 'approve') {
                  handleApprove(showConfirmation.id); // Call handleApprove explicitly
                } else if (actionType === 'reject') {
                  handleReject(showConfirmation.id); // Call handleReject explicitly
                }
              }}
            >
              Confirm
            </button>
            <button className="cancel-btn" onClick={closeConfirmation}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default Approvals;
