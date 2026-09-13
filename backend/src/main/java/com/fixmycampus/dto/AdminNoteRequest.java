package com.fixmycampus.dto;

import jakarta.validation.constraints.NotBlank;

public record AdminNoteRequest(
        @NotBlank String adminNotes
) {}
