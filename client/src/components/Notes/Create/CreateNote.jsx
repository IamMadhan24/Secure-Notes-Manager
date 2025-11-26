import { useState } from "react";
import "../Notes.css";

const CreateNote = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onCreate({ title, content: description });
    setTitle("");
    setDescription("");
  }

  return (
    <div className="modal-container">
      <div className="modal-card-container">
        <button onClick={onClose} className="modal-close-btn">
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">Create Note</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="modal-note-title"
          />

          <textarea
            placeholder="Description"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="modal-note-description"
          ></textarea>

          <button type="submit" className="modal-submit">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNote;
