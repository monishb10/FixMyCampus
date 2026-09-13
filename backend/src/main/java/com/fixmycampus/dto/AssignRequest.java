package com.fixmycampus.dto;

import jakarta.validation.constraints.NotBlank;

public record AssignRequest(
        @NotBlank String assignedTo
) {}
