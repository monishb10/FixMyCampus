package com.fixmycampus.service;

import com.fixmycampus.dto.CreateIssueRequest;
import com.fixmycampus.model.Issue;
import com.fixmycampus.repository.IssueRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class IssueService {
    private final IssueRepository repository;

    public IssueService(IssueRepository repository) {
        this.repository = repository;
    }

    public List<Issue> getAll() {
        return repository.findAll().stream()
                .sorted(Comparator.comparing(Issue::getCreatedAt).reversed())
                .toList();
    }

    public Issue getByTicket(String ticketCode) {
        return repository.findByTicketCodeIgnoreCase(ticketCode)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found: " + ticketCode));
    }

    public Issue create(CreateIssueRequest request) {
        Issue issue = new Issue();
        issue.setTitle(request.title());
        issue.setDescription(request.description());
        issue.setCategory(request.category());
        issue.setLocation(request.location());
        issue.setReporterName(request.reporterName());
        issue.setReporterEmail(request.reporterEmail());
        
        String role = (request.reporterRole() != null && !request.reporterRole().isBlank()) 
                ? request.reporterRole().toUpperCase() 
                : "STUDENT";
        issue.setReporterRole(role);
        
        issue.setSeverity(request.severity());
        issue.setSafetyRisk(request.safetyRisk());
        issue.setImageUrl(request.imageUrl());
        issue.setAffectedCount(1);
        issue.setStatus("REPORTED");
        issue.setTeacherEndorsed("TEACHER".equalsIgnoreCase(role));
        
        // Calculate priority factoring in teacher reporting
        issue.setPriority(calculatePriority(request.severity(), request.safetyRisk(), 1, "TEACHER".equalsIgnoreCase(role)));
        
        issue.setCreatedAt(LocalDateTime.now());
        issue.setUpdatedAt(LocalDateTime.now());
        // Temporary ticketCode
        issue.setTicketCode("TMP-" + java.util.UUID.randomUUID());

        Issue saved = repository.save(issue);
        saved.setTicketCode("FMC-" + (1000 + saved.getId()));
        return repository.save(saved);
    }

    public Issue updateStatus(String ticketCode, String status) {
        Issue issue = getByTicket(ticketCode);
        issue.setStatus(status.trim().toUpperCase().replace(' ', '_'));
        issue.setUpdatedAt(LocalDateTime.now());
        return repository.save(issue);
    }

    public Issue assignIssue(String ticketCode, String assignedTo) {
        Issue issue = getByTicket(ticketCode);
        issue.setAssignedTo(assignedTo);
        if ("REPORTED".equalsIgnoreCase(issue.getStatus())) {
            issue.setStatus("ASSIGNED");
        }
        issue.setUpdatedAt(LocalDateTime.now());
        return repository.save(issue);
    }

    public Issue addAdminNote(String ticketCode, String adminNotes) {
        Issue issue = getByTicket(ticketCode);
        issue.setAdminNotes(adminNotes);
        issue.setUpdatedAt(LocalDateTime.now());
        return repository.save(issue);
    }

    public Issue endorseIssue(String ticketCode, String facultyName, String note) {
        Issue issue = getByTicket(ticketCode);
        issue.setTeacherEndorsed(true);
        String currentNote = issue.getEndorsementNote();
        String newNote = (facultyName != null ? facultyName + ": " : "") + (note != null ? note : "Endorsed by faculty for urgent attention");
        issue.setEndorsementNote(currentNote == null || currentNote.isBlank() ? newNote : currentNote + " | " + newNote);
        
        // Recalculate priority with teacher endorsement boost
        issue.setPriority(calculatePriority(issue.getSeverity(), issue.isSafetyRisk(), issue.getAffectedCount(), true));
        issue.setUpdatedAt(LocalDateTime.now());
        return repository.save(issue);
    }

    public void deleteIssue(String ticketCode) {
        Issue issue = getByTicket(ticketCode);
        repository.delete(issue);
    }

    public Issue addAffected(String ticketCode) {
        Issue issue = getByTicket(ticketCode);
        issue.setAffectedCount(issue.getAffectedCount() + 1);
        issue.setPriority(calculatePriority(issue.getSeverity(), issue.isSafetyRisk(), issue.getAffectedCount(), issue.isTeacherEndorsed()));
        issue.setUpdatedAt(LocalDateTime.now());
        return repository.save(issue);
    }

    public String calculatePriority(int severity, boolean safetyRisk, int affectedCount, boolean teacherEndorsed) {
        int score = severity * 2;
        if (safetyRisk) score += 5;
        if (teacherEndorsed) score += 4; // Faculty endorsement weight
        if (affectedCount >= 25) score += 4;
        else if (affectedCount >= 10) score += 2;
        else if (affectedCount >= 5) score += 1;

        if (score >= 13) return "CRITICAL";
        if (score >= 9) return "HIGH";
        if (score >= 5) return "MEDIUM";
        return "LOW";
    }

    // Overload for backward compatibility
    public String calculatePriority(int severity, boolean safetyRisk, int affectedCount) {
        return calculatePriority(severity, safetyRisk, affectedCount, false);
    }
}
