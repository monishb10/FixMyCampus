package com.fixmycampus.repository;

import com.fixmycampus.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface IssueRepository extends JpaRepository<Issue, Long> {
    Optional<Issue> findByTicketCodeIgnoreCase(String ticketCode);
    long countByStatusIgnoreCase(String status);
    long countByPriorityIgnoreCase(String priority);
}
