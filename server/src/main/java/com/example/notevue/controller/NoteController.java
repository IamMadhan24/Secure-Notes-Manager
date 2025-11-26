package com.example.notevue.controller;

import com.example.notevue.model.Note;
import com.example.notevue.model.User;
import com.example.notevue.repository.NoteRepository;
import com.example.notevue.repository.UserRepository;
import com.example.notevue.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notes")
@CrossOrigin(origins = "http://localhost:5173")
public class NoteController {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // Helper: Get user from JWT token
    private User getUserFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing token");
        }

        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // GET ALL NOTES FOR LOGGED-IN USER
    @GetMapping
    public List<Note> getNotes(@RequestHeader("Authorization") String authHeader) {
        User user = getUserFromToken(authHeader);
        return noteRepository.findByUser(user);
    }

    // CREATE NOTE
    @PostMapping
    public Note createNote(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Note note) {

        User user = getUserFromToken(authHeader);
        note.setUser(user);
        return noteRepository.save(note);
    }

    // UPDATE NOTE
    @PutMapping("/{id}")
    public Note updateNote(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Note updatedNote) {

        User user = getUserFromToken(authHeader);

        Note existing = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!existing.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        existing.setTitle(updatedNote.getTitle());
        existing.setContent(updatedNote.getContent());

        return noteRepository.save(existing);
    }

    // DELETE NOTE
    @DeleteMapping("/{id}")
    public String deleteNote(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        User user = getUserFromToken(authHeader);

        Note existing = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!existing.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        noteRepository.delete(existing);
        return "Deleted";
    }
}
