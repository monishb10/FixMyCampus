package com.fixmycampus.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "issues")
public class Issue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String ticketCode;

    @Column(nullable = false)
    private String title;

    @Column(length = 2500)
    private String description;

    private String category;
    private String location;
    private String priority;
    private String status;
    private String reporterName;
    private String reporterEmail;
    private String reporterRole; // STUDENT, TEACHER, ADMIN
    private int severity;
    private boolean safetyRisk;
    private int affectedCount;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String imageUrl; // Can store file path /api/uploads/... or base64 data URI

    private String assignedTo; // e.g. "Electrical Dept", "IT Services", "Civil & Plumbing"

    @Column(length = 2000)
    private String adminNotes;

    @Column(columnDefinition = "boolean default false")
    private Boolean teacherEndorsed = false;

    @Column(length = 2000)
    private String endorsementNote;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Issue() {}

    public Issue(Long id, String ticketCode, String title, String description, String category,
                 String location, String priority, String status, String reporterName,
                 String reporterEmail, String reporterRole, int severity, boolean safetyRisk,
                 int affectedCount, String imageUrl, String assignedTo, String adminNotes,
                 Boolean teacherEndorsed, String endorsementNote,
                 LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.ticketCode = ticketCode;
        this.title = title;
        this.description = description;
        this.category = category;
        this.location = location;
        this.priority = priority;
        this.status = status;
        this.reporterName = reporterName;
        this.reporterEmail = reporterEmail;
        this.reporterRole = reporterRole;
        this.severity = severity;
        this.safetyRisk = safetyRisk;
        this.affectedCount = affectedCount;
        this.imageUrl = imageUrl;
        this.assignedTo = assignedTo;
        this.adminNotes = adminNotes;
        this.teacherEndorsed = teacherEndorsed;
        this.endorsementNote = endorsementNote;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTicketCode() { return ticketCode; }
    public void setTicketCode(String ticketCode) { this.ticketCode = ticketCode; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }
    public String getReporterEmail() { return reporterEmail; }
    public void setReporterEmail(String reporterEmail) { this.reporterEmail = reporterEmail; }
    public String getReporterRole() { return reporterRole; }
    public void setReporterRole(String reporterRole) { this.reporterRole = reporterRole; }
    public int getSeverity() { return severity; }
    public void setSeverity(int severity) { this.severity = severity; }
    public boolean isSafetyRisk() { return safetyRisk; }
    public void setSafetyRisk(boolean safetyRisk) { this.safetyRisk = safetyRisk; }
    public int getAffectedCount() { return affectedCount; }
    public void setAffectedCount(int affectedCount) { this.affectedCount = affectedCount; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }
    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
    public Boolean isTeacherEndorsed() { return Boolean.TRUE.equals(teacherEndorsed); }
    public void setTeacherEndorsed(Boolean teacherEndorsed) { this.teacherEndorsed = teacherEndorsed != null ? teacherEndorsed : false; }
    public String getEndorsementNote() { return endorsementNote; }
    public void setEndorsementNote(String endorsementNote) { this.endorsementNote = endorsementNote; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
