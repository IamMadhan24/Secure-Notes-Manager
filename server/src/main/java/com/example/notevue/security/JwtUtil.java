package com.example.notevue.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // For learning/demo only: simple secret. Replace in production.
    private final String secret = "my-super-secret-key-which-should-be-long-enough-1234567890";

    // Use a Key instance (jjwt supports both ways)
    private Key getSigningKey() {
        // Using the bytes of secret to create a simple key
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String username) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(username)
                .setIssuer("notevue")
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + 24 * 60 * 60 * 1000)) // 1 day
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (JwtException e) {
            return null;
        }
    }

    public Date extractExpiration(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration();
        } catch (JwtException e) {
            return null;
        }
    }

    private boolean isTokenExpired(String token) {
        Date exp = extractExpiration(token);
        if (exp == null) return true;
        return exp.before(new Date());
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        if (username == null) return false;
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }
}
