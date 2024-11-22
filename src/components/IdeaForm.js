import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css'; 

const IdeaForm = ({ onAddIdea, onAddDraft, onUpdateIdea, editingIdea }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingIdea) {
      setTitle(editingIdea.title);
      setDescription(editingIdea.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editingIdea]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = description;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
  
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
    setTitle('');
    setDescription('');
  };

  const handleSaveAsDraft = async (e) => {
    e.preventDefault();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = description;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
  
    if (!plainText.trim()) {
      setError("Please add your idea in the description area!");
      return;
    }
  
    setError("");
    const newDraft = {
      title,
      description,
      is_draft: true 
    };
  
    try {
      setTitle('');
      setDescription('');
      await onAddDraft(newDraft);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Give a title!"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <div className="textarea-idea">
        <ReactQuill
          value={description}
          onChange={setDescription}
          required
          placeholder="Add your new idea here..."
          modules={{
            toolbar: [
              [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
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
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="action-buttons-container">
        <button
          type="submit"
          className="action-button action-button-primary"
        >
          {editingIdea ? 'Update' : 'Submit'}
        </button>
        <button
          type="button"
          className="action-button action-button-secondary"
          onClick={handleSaveAsDraft}
        >
          Save as Draft
        </button>
      </div>
    </form>
  );
};

export default IdeaForm;