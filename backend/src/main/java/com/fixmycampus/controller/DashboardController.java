package com.fixmycampus.controller;

import com.fixmycampus.model.Issue;
import com.fixmycampus.repository.IssueRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    private final IssueRepository repository;

    public DashboardController(IssueRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() {
        var issues = repository.findAll();
        long total = issues.size();
        long resolved = issues.stream().filter(i -> isDone(i.getStatus())).count();
        long critical = issues.stream().filter(i -> "CRITICAL".equalsIgnoreCase(i.getPriority())).count();
        long active = total - resolved;
        int affected = issues.stream().mapToInt(Issue::getAffectedCount).sum();
        double resolutionRate = total == 0 ? 0 : Math.round((resolved * 1000.0 / total)) / 10.0;

        Map<String, Long> byCategory = new LinkedHashMap<>();
        issues.forEach(i -> byCategory.merge(i.getCategory(), 1L, Long::sum));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalIssues", total);
        result.put("activeIssues", active);
        result.put("resolvedIssues", resolved);
        result.put("criticalIssues", critical);
        result.put("peopleAffected", affected);
        result.put("resolutionRate", resolutionRate);
        result.put("byCategory", byCategory);
        return result;
    }

    private boolean isDone(String status) {
        return "RESOLVED".equalsIgnoreCase(status) || "VERIFIED".equalsIgnoreCase(status) || "CLOSED".equalsIgnoreCase(status);
    }
}
