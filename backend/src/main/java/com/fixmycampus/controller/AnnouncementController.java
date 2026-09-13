package com.fixmycampus.controller;

import com.fixmycampus.dto.AnnouncementRequest;
import com.fixmycampus.model.Announcement;
import com.fixmycampus.repository.AnnouncementRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {
    private final AnnouncementRepository repository;

    public AnnouncementController(AnnouncementRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Announcement> getAll() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Announcement create(@Valid @RequestBody AnnouncementRequest request) {
        Announcement announcement = new Announcement(
                null,
                request.title(),
                request.message(),
                request.category() != null ? request.category() : "General",
                request.targetRole() != null ? request.targetRole() : "ALL",
                request.createdBy() != null ? request.createdBy() : "Admin Office",
                LocalDateTime.now()
        );
        return repository.save(announcement);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
