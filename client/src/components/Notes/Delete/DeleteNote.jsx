import React from "react";
import "../Notes.css";

const DeleteNote = ({ note, onClose, onDelete }) => {
  if (!note) return null;

  return (
    <div className="modal-container">
      <div className="modal-card-container relative">
        <button onClick={onClose} className="modal-close-btn">
          ✕
        </button>

        <h2 className="text-xl font-semibold text-center mb-4">Delete Note</h2>

        <p className="text-gray-700 mb-6 text-center">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{note.title}</span>?
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={() => onDelete(note.id)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteNote;
