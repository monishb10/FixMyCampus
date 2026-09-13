package com.fixmycampus.dto;

import jakarta.validation.constraints.NotBlank;

public record AnnouncementRequest(
        @NotBlank String title,
        @NotBlank String message,
        String category,
        String targetRole,
        String createdBy
) {}
