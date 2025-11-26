package com.example.notevue.service;

import com.example.notevue.model.User;
import com.example.notevue.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Signup helper
    public User signup(User user) {
        // encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return repo.save(user);
    }

    // Find by username or email (helper)
    public User findByUsernameOrEmail(String value) {
        return repo.findByUsername(value).orElseGet(() ->
                repo.findByEmail(value).orElse(null));
    }

    // Compare raw password with hashed
    public boolean comparePassword(String raw, String hashed) {
        return passwordEncoder.matches(raw, hashed);
    }

    // UserDetailsService method - used by Spring Security
    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = repo.findByUsername(usernameOrEmail)
                .orElse(repo.findByEmail(usernameOrEmail).orElse(null));
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + usernameOrEmail);
        }
        return user;
    }
}
