import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const IdeaForm = ({ onAddIdea, onAddDraft, onUpdateIdea, editingIdea, theme }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingIdea) {
      setTitle(editingIdea.title);
      setDescription(editingIdea.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [editingIdea]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = description;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    if (!plainText.trim()) {
      setError("Please add your idea in the description area!");
      return;
    }

    setError("");

    const newIdea = { title, description };
    if (editingIdea) {
      newIdea.id = editingIdea.id;
      onUpdateIdea(newIdea);
    } else {
      onAddIdea(newIdea);
    }
    setTitle("");
    setDescription("");
  };

  const handleSaveAsDraft = async (e) => {
    e.preventDefault();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = description;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    if (!plainText.trim()) {
      setError("Please add your idea in the description area!");
      return;
    }

    setError("");
    const newDraft = {
      title,
      description,
      is_draft: true,
    };

    try {
      setTitle("");
      setDescription("");
      await onAddDraft(newDraft);
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`max-w-2xl mx-auto p-6 rounded-lg shadow-md space-y-6 border 
      ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800"} 
      mt-16`} // Added margin from navbar
    >
      <h2 className="text-2xl font-semibold text-center">
        {editingIdea ? "Edit Your Idea" : "Share a New Idea"}
      </h2>
      <input
        type="text"
        placeholder="Give a title to your idea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
          theme === "dark"
            ? "bg-gray-700 border-gray-600 focus:ring-indigo-500"
            : "bg-gray-100 border-gray-300 focus:ring-indigo-500"
        }`}
      />
      <div>
        <ReactQuill
          value={description}
          onChange={setDescription}
          placeholder="Add your idea description here..."
          modules={{
            toolbar: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["bold", "italic", "underline"],
              [{ align: [] }],
              ["link"],
              [{ color: [] }, { background: [] }],
              ["blockquote"],
              ["code-block"],
            ],
          }}
          className={`rounded-lg shadow-md focus:outline-none ${
            theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"
          }`}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end gap-4 mt-4">
        <button
          type="submit"
          className="px-6 py-2 text-sm font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500
          bg-indigo-600 text-white hover:bg-indigo-700"
        >
          {editingIdea ? "Update Idea" : "Submit Idea"}
        </button>
        <button
          type="button"
          className="px-6 py-2 text-sm font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500
          bg-gray-500 text-white hover:bg-gray-600"
          onClick={handleSaveAsDraft}
        >
          Save as Draft
        </button>
      </div>
    </form>
  );
};

export default IdeaForm;
