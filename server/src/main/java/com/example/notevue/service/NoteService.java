package com.example.notevue.service;

import com.example.notevue.model.Note;
import com.example.notevue.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteService {

    @Autowired
    private NoteRepository repo;

    // CREATE
    public Note create(Note note) {
        return repo.save(note);
    }

    // READ ALL
    public List<Note> getAllNotes() {
        return repo.findAll();
    }

    // UPDATE
    public Note update(Long id, Note note) {
        note.setId(id);
        return repo.save(note);
    }

    // DELETE
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
