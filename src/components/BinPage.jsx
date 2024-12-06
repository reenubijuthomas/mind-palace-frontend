import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IdeaList from './IdeaList';
import BASE_URL from '../config.jsx';

const BinPage = ({ userId, theme }) => {
  const [deletedIdeas, setDeletedIdeas] = useState([]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeletedIdeas = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/bin?createdBy=${userId}`);
        if (response.data && response.data.length === 0) {
          setMessage('No deleted ideas found.');
        } else {
          setDeletedIdeas(response.data);
          setMessage('');
        }
      } catch (error) {
        console.error('Error fetching deleted ideas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeletedIdeas();
  }, [userId]);

  const handleRestore = async (ideaId) => {
    try {
      await axios.put(`${BASE_URL}/api/bin/restore/${ideaId}`);
      setDeletedIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== ideaId));
      setMessage('Idea restored successfully!');
    } catch (error) {
      console.error('Error restoring idea:', error);
      setMessage('Failed to restore the idea.');
    }
  };

  const handlePermanentDelete = async (ideaId) => {
    try {
      await axios.delete(`${BASE_URL}/api/bin/permanent-delete/${ideaId}`);
      setDeletedIdeas((prevIdeas) => prevIdeas.filter((idea) => idea.id !== ideaId));
      setMessage('Idea permanently deleted.');
    } catch (error) {
      console.error('Error permanently deleting idea:', error);
      setMessage('Failed to delete the idea.');
    }
  };

  const filteredIdeas = deletedIdeas.filter(
    (idea) =>
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen py-10 px-6 ${theme === 'dark'
        ? 'bg-gradient-to-b from-[#1e293b] via-[#151f2d] to-[#0f172a] text-[#e2e8f0]'
        : 'bg-gradient-to-b from-[#f3f8ff] via-[#d1e3ff] to-[#a9c9ff] text-[#2d3748]'
        }`}
    >
      {/* Title Section */}
      <div className="pt-24 pb-8 text-center">
        <h1
          className={`text-4xl font-extrabold tracking-wide ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'
            }`}
        >
          Deleted Ideas
        </h1>
        <p
          className={`mt-4 text-lg font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
        >
          Manage and restore your ideas from the bin
        </p>
      </div>

      {/* Search Bar */}
      <div className="search-bar mx-auto">
        <i className="fa fa-search search-icon"></i>
        <input
          type="text"
          placeholder="Search deleted ideas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`search-input ${theme === 'dark' ? 'dark-search-bar' : 'light-search-bar'}`}
        />
      </div>

      {/* Loading, Ideas, or No Deleted Ideas */}
      {loading ? (
        <div className="text-center text-gray-500">Loading deleted ideas...</div>
      ) : filteredIdeas.length > 0 ? (
        <IdeaList
          ideas={filteredIdeas}
          handleDelete={handlePermanentDelete}
          handleRestore={handleRestore}
          userId={userId}
          isBinPage={true} // Enables restore and permanent delete actions
          setDeletedIdeas={setDeletedIdeas}
          isDarkMode={theme === 'dark'}
        />
      ) : (
        <div
          className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-lg text-center mx-auto w-full max-w-md ${theme === 'dark'
            ? 'bg-gray-800 text-gray-200'
            : 'bg-white text-gray-800'
            }`}
        >
          <p className="text-lg font-medium">
            {message || 'No deleted ideas in the bin'}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className={`mt-6 px-6 py-3 rounded-full text-white font-semibold hover:bg-indigo-600 transition ${theme === 'dark'
              ? 'bg-indigo-700'
              : 'bg-indigo-500'
              }`}
          >
            Back to Homepage
          </button>
        </div>
      )}
    </div>
  );
};

export default BinPage;
