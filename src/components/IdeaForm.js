// src/components/IdeaForm.js
import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill'; // Import React Quill
import 'react-quill/dist/quill.snow.css'; // Import the required Quill styles

const IdeaForm = ({ onAddIdea, onUpdateIdea, editingIdea }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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
    const newIdea = { title, description };
    if (editingIdea) {
      newIdea.id = editingIdea.id; // Add id for updating
      onUpdateIdea(newIdea); // Call update function
    } else {
      onAddIdea(newIdea); // Call add function
    }
    setTitle('');
    setDescription('');
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
      <button type="submit" style={{ marginTop: '5px' }}>
        {editingIdea ? 'Update' : 'Submit'}
      </button>
    </form>
  );
};

export default IdeaForm;
