import "../Notes.css";

const ViewNote = ({ note, onClose }) => {
  if (!note) return null;

  return (
    <div className="modal-container">
      <div className="modal-card-container max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="modal-close-btn">
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center text-black whitespace-pre-wrap break-words">
          {note.title}
        </h2>

        <p className="text-gray-700 whitespace-pre-wrap break-words pb-4">
          {note.content}
        </p>
      </div>
    </div>
  );
};

export default ViewNote;
