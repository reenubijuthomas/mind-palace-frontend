// src/components/IdeaForm.js
import React, { useState, useEffect } from 'react';

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
      <textarea
        placeholder="Add your new idea here..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit" style={{ marginTop: '5px' }}>{editingIdea ? 'Update' : 'Submit'}</button>
    </form>
  );
};

export default IdeaForm;
