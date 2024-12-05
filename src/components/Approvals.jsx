import React, { useState, useEffect } from "react";
import axios from "axios";
import IdeaList from "./IdeaList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Approvals = ({ userId, theme }) => {
  const [approvalIdeas, setApprovalIdeas] = useState([]);
  const [comments, setComments] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(null);
  const [notification, setNotification] = useState("");
  const [toggleSections, setToggleSections] = useState({
    pending: true,
    approved: false,
    rejected: false,
  });
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

      setShowModal(null);
      setApprovalComment("");
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

      setShowModal(null);
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

  const filteredIdeas = approvalIdeas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingIdeas = filteredIdeas.filter((idea) => idea.isApproved === 0 || idea.isApproved === null);
  const approvedIdeas = filteredIdeas.filter((idea) => idea.isApproved === 1);
  const rejectedIdeas = filteredIdeas.filter((idea) => idea.isApproved === 2);

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

  return (
    <div className={`min-h-screen p-6 ${theme} flex flex-col items-center transition-all`}>
      {/* Title Section */}
      <div className="pt-24 pb-4 text-center">
        <h1
          className={`text-4xl font-extrabold tracking-wide mb-6 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"
            }`}
        >
          Approvals
        </h1>
        <p className="mt-2 text-lg font-medium text-gray-500 dark:text-gray-300">
          Manage and approve or reject ideas.
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

      {/* Tabs for Pending, Approved, Rejected */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => toggleSection("pending")}
          className={`px-4 py-2 rounded-md font-semibold transition-all duration-300 ${toggleSections.pending
              ? theme === "dark"
                ? "bg-gray-800 text-indigo-400"
                : "bg-gray-200 text-indigo-600"
              : theme === "dark"
                ? "bg-gray-700 text-gray-400"
                : "bg-gray-100 text-gray-500"
            }`}
        >
          Pending Approval
        </button>
        <button
          onClick={() => toggleSection("approved")}
          className={`px-4 py-2 rounded-md font-semibold transition-all duration-300 ${toggleSections.approved
              ? theme === "dark"
                ? "bg-gray-800 text-indigo-400"
                : "bg-gray-200 text-indigo-600"
              : theme === "dark"
                ? "bg-gray-700 text-gray-400"
                : "bg-gray-100 text-gray-500"
            }`}
        >
          Approved Ideas
        </button>
        <button
          onClick={() => toggleSection("rejected")}
          className={`px-4 py-2 rounded-md font-semibold transition-all duration-300 ${toggleSections.rejected
              ? theme === "dark"
                ? "bg-gray-800 text-indigo-400"
                : "bg-gray-200 text-indigo-600"
              : theme === "dark"
                ? "bg-gray-700 text-gray-400"
                : "bg-gray-100 text-gray-500"
            }`}
        >
          Rejected Ideas
        </button>
      </div>

      {/* Pending Ideas */}
      {pendingIdeas.length > 0 && toggleSections.pending && (
        <div>
          <IdeaList
            ideas={pendingIdeas}
            handleDelete={null}
            handleEdit={null}
            handleLike={null}
            userId={userId}
            isDarkMode={theme === "dark"}
            renderActions={(idea) => (
              <div className="flex space-x-4">
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                  onClick={() => openModal(idea)}
                >
                  Approve
                </button>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                  onClick={() => openModal(idea)}
                >
                  Reject
                </button>
              </div>
            )}
          />
        </div>
      )}

      {/* Approved Ideas */}
      {approvedIdeas.length > 0 && toggleSections.approved && (
        <div>
          <IdeaList
            ideas={approvedIdeas}
            handleDelete={null}
            handleEdit={null}
            handleLike={null}
            userId={userId}
            isDarkMode={theme === "dark"}
          />
        </div>
      )}

      {/* Rejected Ideas */}
      {rejectedIdeas.length > 0 && toggleSections.rejected && (
        <div>
          <IdeaList
            ideas={rejectedIdeas}
            handleDelete={null}
            handleEdit={null}
            handleLike={null}
            userId={userId}
            isDarkMode={theme === "dark"}
          />
        </div>
      )}

      {/* No Ideas Found */}
      {approvalIdeas.length === 0 && (
        <div
          className={`text-center p-4 rounded shadow ${theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-white text-gray-800"
            }`}
        >
          <p>No ideas found for approval.</p>
        </div>
      )}

      {/* Modal for Active Idea */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96 max-w-full">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={closeModal}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h3 className="text-xl font-semibold dark:text-white">{showModal.title}</h3>
            <p className="mt-2 dark:text-gray-300">{showModal.description}</p>

            {/* Approval Comment Input */}
            <textarea
              value={approvalComment}
              onChange={(e) => setApprovalComment(e.target.value)}
              placeholder="Optional comment (optional)"
              className="w-full mt-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
              rows="3"
            />

            <div className="mt-4 space-x-4 flex justify-end">
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                onClick={() => handleApprove(showModal.id)}
              >
                Approve
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                onClick={() => handleReject(showModal.id)}
              >
                Reject
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