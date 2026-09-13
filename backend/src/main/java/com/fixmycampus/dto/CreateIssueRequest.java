package com.fixmycampus.dto;

import jakarta.validation.constraints.*;

public record CreateIssueRequest(
        @NotBlank String title,
        @NotBlank String description,
        @NotBlank String category,
        @NotBlank String location,
        @NotBlank String reporterName,
        @Email @NotBlank String reporterEmail,
        String reporterRole,
        @Min(1) @Max(5) int severity,
        boolean safetyRisk,
        String imageUrl
) {}
