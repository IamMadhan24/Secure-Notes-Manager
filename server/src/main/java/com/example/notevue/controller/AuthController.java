package com.example.notevue.controller;

import com.example.notevue.model.User;
import com.example.notevue.security.JwtUtil;
import com.example.notevue.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // Signup: expects JSON with username, email, password
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        // Simple checks (you can expand)
        if (user.getUsername() == null || user.getPassword() == null || user.getEmail() == null) {
            return ResponseEntity.badRequest().body("Missing fields");
        }

        // You might want to check duplicates
        if (userService.findByUsernameOrEmail(user.getUsername()) != null ||
                userService.findByUsernameOrEmail(user.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username or email already taken");
        }

        userService.signup(user);
        return ResponseEntity.ok("Signup successful!");
    }

    // Login: accepts JSON { "username": "<username or email>", "password": "<pwd>" }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User request) {

        if (request.getUsername() == null || request.getPassword() == null) {
            return ResponseEntity.badRequest().body("Missing credentials");
        }

        var dbUser = userService.findByUsernameOrEmail(request.getUsername());
        if (dbUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("INVALID_CREDENTIALS");
        }

        if (!userService.comparePassword(request.getPassword(), dbUser.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("INVALID_CREDENTIALS");
        }

        String token = jwtUtil.generateToken(dbUser.getUsername());
        return ResponseEntity.ok(Map.of("token", token));
    }
}
