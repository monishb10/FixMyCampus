package com.fixmycampus.controller;

import com.fixmycampus.dto.*;
import com.fixmycampus.model.Issue;
import com.fixmycampus.service.IssueService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
public class IssueController {
    private final IssueService service;

    public IssueController(IssueService service) {
        this.service = service;
    }

    @GetMapping
    public List<Issue> all() {
        return service.getAll();
    }

    @GetMapping("/{ticketCode}")
    public Issue one(@PathVariable String ticketCode) {
        return service.getByTicket(ticketCode);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Issue create(@Valid @RequestBody CreateIssueRequest request) {
        return service.create(request);
    }

    @PatchMapping("/{ticketCode}/status")
    public Issue updateStatus(@PathVariable String ticketCode,
                              @Valid @RequestBody StatusUpdateRequest request) {
        return service.updateStatus(ticketCode, request.status());
    }

    @PatchMapping("/{ticketCode}/assign")
    public Issue assignIssue(@PathVariable String ticketCode,
                             @Valid @RequestBody AssignRequest request) {
        return service.assignIssue(ticketCode, request.assignedTo());
    }

    @PatchMapping("/{ticketCode}/admin-note")
    public Issue addAdminNote(@PathVariable String ticketCode,
                              @Valid @RequestBody AdminNoteRequest request) {
        return service.addAdminNote(ticketCode, request.adminNotes());
    }

    @PatchMapping("/{ticketCode}/endorse")
    public Issue endorseIssue(@PathVariable String ticketCode,
                              @RequestBody EndorseRequest request) {
        return service.endorseIssue(ticketCode, request.facultyName(), request.endorsementNote());
    }

    @DeleteMapping("/{ticketCode}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String ticketCode) {
        service.deleteIssue(ticketCode);
    }

    @PostMapping("/{ticketCode}/affected")
    public Issue affected(@PathVariable String ticketCode) {
        return service.addAffected(ticketCode);
    }
}
