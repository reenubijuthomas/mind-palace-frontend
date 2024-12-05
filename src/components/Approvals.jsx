import React, { useState, useEffect } from "react";
import axios from "axios";
import IdeaList from "./IdeaList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faAngleDown, faAngleUp, faTimes } from "@fortawesome/free-solid-svg-icons";

const Approvals = ({ userId, theme }) => {
  const [approvalIdeas, setApprovalIdeas] = useState([]);
  const [comments, setComments] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(null);
  const [notification, setNotification] = useState("");
  const [commentVisibility, setCommentVisibility] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(null);
  const [actionType, setActionType] = useState("");
  const [showPendingDropdown, setShowPendingDropdown] = useState(true);
  const [showApprovedRejectedDropdown, setShowApprovedRejectedDropdown] = useState(true);
  const [approvalComment, setApprovalComment] = useState("");

  useEffect(() => {
    const fetchApprovalIdeas = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/approvals");
        const ideas = Array.isArray(response.data) ? response.data : [];
        setApprovalIdeas(ideas);

        const commentsResponses = await Promise.all(
          ideas.map((idea) => axios.get(`http://localhost:5050/api/comments/${idea.id}`))
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
      const commentResponse = await axios.post(`http://localhost:5050/api/comments`, {
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

      await axios.put(`http://localhost:5050/api/approvals/approve/${ideaId}`);
      setApprovalIdeas((prev) =>
        prev.map((idea) =>
          idea.id === ideaId ? { ...idea, status: "Approved", isApproved: 1 } : idea
        )
      );

      setShowConfirmation(null);
      closeModal();
      showNotification("Idea approved successfully!");
    } catch (error) {
      console.error("Error approving idea:", error);
    }
  };

  const handleReject = async (ideaId) => {
    try {
      const commentResponse = await axios.post(`http://localhost:5050/api/comments`, {
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

      await axios.put(`http://localhost:5050/api/approvals/reject/${ideaId}`);
      setApprovalIdeas((prev) =>
        prev.map((idea) =>
          idea.id === ideaId ? { ...idea, status: "Rejected", isApproved: 2 } : idea
        )
      );

      setShowConfirmation(null);
      closeModal();
      showNotification("Idea rejected successfully!");
    } catch (error) {
      console.error("Error rejecting idea:", error);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 5000);
  };

  const filteredIdeas = approvalIdeas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingIdeas = filteredIdeas.filter(
    (idea) => idea.isApproved === 0 || idea.isApproved === null
  );
  const approvedRejectedIdeas = filteredIdeas.filter(
    (idea) => idea.isApproved === 1 || idea.isApproved === 2
  );

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
    setActionType("");
  };

  return (
    <div className={`min-h-screen p-6 ${theme} flex flex-col items-center transition-all`}>
      <h2 className="text-2xl font-bold mb-6">Approvals Page</h2>

      {/* Search Bar */}
      <div className="relative w-full max-w-md mb-6">
        <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
        <input
          type="text"
          placeholder="Search ideas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Pending Ideas */}
      {pendingIdeas.length > 0 && (
        <div className="mb-8">
          <h3 onClick={togglePendingDropdown} className="text-lg font-medium cursor-pointer mb-2">
            Pending Approval {showPendingDropdown ? "▼" : "▲"}
          </h3>
          {showPendingDropdown && (
            <IdeaList
              ideas={pendingIdeas}
              handleDelete={null}
              handleEdit={null}
              handleLike={null}
              userId={userId}
              isBinPage={false}
              isDraftPage={false}
              setDeletedIdeas={null}
              setDrafts={null}
              isDarkMode={theme === "dark"}
            />
          )}
        </div>
      )}

      {/* Approved / Rejected Ideas */}
      {approvedRejectedIdeas.length > 0 && (
        <div>
          <h3 onClick={toggleApprovedRejectedDropdown} className="text-lg font-medium cursor-pointer mb-2">
            Approved / Rejected {showApprovedRejectedDropdown ? "▼" : "▲"}
          </h3>
          {showApprovedRejectedDropdown && (
            <IdeaList
              ideas={approvedRejectedIdeas}
              handleDelete={null}
              handleEdit={null}
              handleLike={null}
              userId={userId}
              isBinPage={false}
              isDraftPage={false}
              setDeletedIdeas={null}
              setDrafts={null}
              isDarkMode={theme === "dark"}
            />
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-96 max-w-full">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={closeModal}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h3 className="text-xl font-semibold">{showModal.title}</h3>
            <p className="mt-2">{showModal.description}</p>
            <div className="mt-4 space-x-4">
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                onClick={() => openConfirmation(showModal, "approve")}
              >
                Approve
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                onClick={() => openConfirmation(showModal, "reject")}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
            <p className="text-center">Are you sure you want to {actionType} this idea?</p>
            <div className="flex justify-between mt-4">
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                onClick={() => {
                  if (actionType === "approve") {
                    handleApprove(showConfirmation.id);
                  } else if (actionType === "reject") {
                    handleReject(showConfirmation.id);
                  }
                }}
              >
                Confirm
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                onClick={closeConfirmation}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-lg">
          {notification}
        </div>
      )}
    </div>
  );
};

export default Approvals;
