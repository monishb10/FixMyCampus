package com.fixmycampus.service;

import com.fixmycampus.dto.AuthResponse;
import com.fixmycampus.dto.LoginRequest;
import com.fixmycampus.dto.RegisterRequest;
import com.fixmycampus.model.User;
import com.fixmycampus.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;

@Service
public class AuthService {
    private final UserRepository repository;
    private static final String SALT = "FixMyCampusSecureSalt2026";

    public AuthService(UserRepository repository) {
        this.repository = repository;
    }

    public AuthResponse register(RegisterRequest request) {
        String cleanEmail = request.email().trim().toLowerCase();
        if (repository.existsByEmailIgnoreCase(cleanEmail)) {
            throw new IllegalArgumentException("An account with this email address already exists.");
        }

        String role = request.role() != null && !request.role().isBlank()
                ? request.role().trim().toUpperCase()
                : "STUDENT";

        if (!role.equals("STUDENT") && !role.equals("TEACHER") && !role.equals("ADMIN")) {
            role = "STUDENT";
        }

        String hashed = hashPassword(request.password());

        User user = new User(
                null,
                request.name().trim(),
                cleanEmail,
                hashed,
                role,
                request.department() != null ? request.department().trim() : "",
                request.idNumber() != null ? request.idNumber().trim() : "",
                LocalDateTime.now()
        );

        User saved = repository.save(user);

        return new AuthResponse(
                saved.getId(),
                saved.getName(),
                saved.getEmail(),
                saved.getRole(),
                saved.getDepartment(),
                saved.getIdNumber(),
                "Registration successful."
        );
    }

    public AuthResponse login(LoginRequest request) {
        String cleanEmail = request.email().trim().toLowerCase();
        User user = repository.findByEmailIgnoreCase(cleanEmail)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        String candidateHash = hashPassword(request.password());
        if (!user.getPasswordHash().equals(candidateHash)) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        return new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getDepartment(),
                user.getIdNumber(),
                "Login successful."
        );
    }

    public String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest((SALT + password).getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm missing", e);
        }
    }
}
