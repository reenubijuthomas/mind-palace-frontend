import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { BookPlus, Save } from "lucide-react";

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

  // Custom Quill theme classes
  const quillThemeClasses =
    theme === "dark"
      ? "bg-gray-800 text-gray-200 border-gray-700 [&_.ql-toolbar]:bg-gray-700 [&_.ql-editor]:bg-gray-800 [&_.ql-editor]:text-gray-200 [&_.ql-stroke]:stroke-gray-300 [&_.ql-fill]:fill-gray-300 [&_.ql-editor]:h-40"
      : "bg-white text-gray-800 border-gray-200 [&_.ql-toolbar]:bg-gray-100 [&_.ql-editor]:bg-white [&_.ql-editor]:text-gray-800 [&_.ql-editor]:h-40";

  return (
    <div className="container mx-auto px-4 py-4 pt-32 flex justify-center items-start"> {/* Changed min-h-screen to flex start */}

      <form
        onSubmit={handleSubmit}
        className={`w-full h-full max-w-full mx-auto p-8 rounded-2xl shadow-xl transition-all duration-300 
          ${theme === "dark"
            ? "bg-gray-900 border-2 border-gray-800 text-gray-100 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
            : "bg-white border border-gray-200 text-gray-900 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]"
          } space-y-6 transform hover:scale-[1.01]`}
      >
        <h2 className={`text-3xl font-bold text-center mb-6 
          ${theme === "dark" ? "text-indigo-300" : "text-indigo-600"}`}
        >
          {editingIdea ? "Edit Your Idea" : "Share a New Idea"}
        </h2>

        <div className="space-y-4 w-full"> {/* Full width form content */}
          <input
            type="text"
            placeholder="Give a title to your idea"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={`w-full px-4 py-3 rounded-xl transition-all duration-300 
    ${theme === "dark"
                ? "bg-gray-800 text-gray-200 border-2 border-gray-700 placeholder-gray-500 focus:border-gray-300 focus:ring-2 focus:ring-indigo-500"
                : "bg-gray-100 text-gray-800 border border-gray-200 placeholder-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              }`}
          />

          <div className="relative">
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
              className={`rounded-xl overflow-hidden transition-all duration-300 ${quillThemeClasses}`}
              style={{
                height: "auto", // Let the height auto-adjust as you type
                minHeight: "150px", // Set the initial minimum height
                width: "auto", // Make the editor span the full width of the container
              }}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-2 pl-2 animate-pulse">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button
            type="submit"
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl 
      transition-all duration-300 group 
      ${theme === "dark"
                ? "bg-indigo-700 text-gray-100 hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500"
                : "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
              } shadow-md hover:shadow-lg`}
          >
            <BookPlus className="w-5 h-5 group-hover:rotate-6 transition-transform" />
            {editingIdea ? "Update Idea" : "Submit Idea"}
          </button>

          <button
            type="button"
            onClick={handleSaveAsDraft}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl 
      transition-all duration-300 group 
      ${theme === "dark"
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-2 focus:ring-gray-500"
                : "bg-gray-500 text-white hover:bg-gray-600 focus:ring-2 focus:ring-gray-500"
              } shadow-md hover:shadow-lg`}
          >
            <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  );
};

export default IdeaForm;
