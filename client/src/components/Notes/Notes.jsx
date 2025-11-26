import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import CreateNote from "./Create/CreateNote";
import ViewNote from "./Read/ViewNote";
import UpdateNote from "./Update/UpdateNote";
import DeleteNote from "./Delete/DeleteNote";

import Search from "../Search/Search";
import "./Notes.css";

const API_URL = "http://localhost:8080/notes";

const Notes = () => {
  const { token } = useContext(AuthContext);

  const [notes, setNotes] = useState([]);

  const [showCreateBtn, setShowCreateBtn] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [selectedNote, setSelectedNote] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  // LOAD NOTES (GET)
  async function loadNotes() {
    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) {
        console.error("Failed to load notes");
        return;
      }

      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error("Error loading notes:", error);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  // TRUNCATE TEXT HELPER
  function truncate(text, limit) {
    return text.length <= limit ? text : text.substring(0, limit) + "...";
  }

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // CREATE (POST)
  async function handleAddNote(newNote) {
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(newNote),
    });

    setShowCreateModal(false);
    loadNotes();
  }

  // VIEW
  function handleView(note) {
    setSelectedNote(note);
    setShowViewModal(true);
  }

  // EDIT
  function handleEdit(note) {
    setSelectedNote(note);
    setShowEditModal(true);
  }

  async function handleUpdate(updatedNote) {
    await fetch(`${API_URL}/${updatedNote.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(updatedNote),
    });

    setShowEditModal(false);
    loadNotes();
  }

  // DELETE
  function handleDelete(note) {
    setSelectedNote(note);
    setShowDeleteModal(true);
  }

  async function handleConfirmDelete(id) {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    setShowDeleteModal(false);
    loadNotes();
  }

  // FLOATING CREATE BUTTON
  function handleAddClickBtn(e) {
    e.stopPropagation();
    setShowCreateBtn(!showCreateBtn);
  }

  useEffect(() => {
    function handleOutsideClick() {
      setShowCreateBtn(false);
    }

    if (showCreateBtn) {
      document.addEventListener("click", handleOutsideClick);
    }
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [showCreateBtn]);

   // UI RENDER
  return (
    <>
      {/* Search Input */}
      <Search searchTerm={searchTerm} onSearch={setSearchTerm} />

      {/* Welcome Message When 0 Notes */}
      {notes.length === 0 && (
        <div className="w-full flex flex-col items-center justify-center text-center text-white/80 mt-20 sm:mt-24 md:mt-32 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            Welcome to Notevue 👋
          </h2>

          <p className="text-base sm:text-lg md:text-xl max-w-xl">
            Start by adding your very first note using the{" "}
            <span className="font-semibold">+</span> button below.
          </p>
        </div>
      )}

      {/* Notes Grid */}
      <div className="notes-container">
        {filteredNotes.map((note) => (
          <div key={note.id} className="note-container">
            <h1 className="note-title">{truncate(note.title, 25)}</h1>
            <p className="note-content">{truncate(note.content, 80)}</p>

            <div className="note-btns flex gap-2">
              <button
                className="bg-blue-200 note-btn"
                onClick={() => handleView(note)}
              >
                View
              </button>

              <button
                className="bg-green-50 note-btn"
                onClick={() => handleEdit(note)}
              >
                Edit
              </button>

              <button
                className="bg-red-300 note-btn"
                onClick={() => handleDelete(note)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button onClick={handleAddClickBtn} className="add-btn">
        +
      </button>

      {showCreateBtn && (
        <button onClick={() => setShowCreateModal(true)} className="create-btn">
          Create
        </button>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateNote
          onClose={() => setShowCreateModal(false)}
          onCreate={handleAddNote}
        />
      )}

      {showViewModal && (
        <ViewNote note={selectedNote} onClose={() => setShowViewModal(false)} />
      )}

      {showEditModal && (
        <UpdateNote
          note={selectedNote}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdate}
        />
      )}

      {showDeleteModal && (
        <DeleteNote
          note={selectedNote}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleConfirmDelete}
        />
      )}
    </>
  );
};

export default Notes;
