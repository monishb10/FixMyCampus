package com.fixmycampus.dto;

public record AuthResponse(
        Long id,
        String name,
        String email,
        String role,
        String department,
        String idNumber,
        String message
) {}
