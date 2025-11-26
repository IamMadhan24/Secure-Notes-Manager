import React, { useState } from "react";
import "../Notes.css";

const UpdateNote = ({ note, onClose, onUpdate }) => {
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.content);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdate({ ...note, title, content: description });
    onClose();
  }

  return (
    <div className="modal-container">
      <div className="modal-card-container max-h-[80vh] overflow-y-auto relative">
        <button onClick={onClose} className="modal-close-btn">
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-center mb-4">Edit Note</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="modal-note-title"
          />

          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="modal-note-description"
          ></textarea>

          <button type="submit" className="modal-submit">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateNote;
