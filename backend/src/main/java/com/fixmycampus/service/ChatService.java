package com.fixmycampus.service;

import com.fixmycampus.model.Issue;
import com.fixmycampus.repository.IssueRepository;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ChatService {
    private static final Pattern TICKET_PATTERN = Pattern.compile("FMC-\\d+", Pattern.CASE_INSENSITIVE);

    private final IssueRepository repository;

    public ChatService(IssueRepository repository) {
        this.repository = repository;
    }

    public String reply(String message) {
        String text = message.toLowerCase(Locale.ROOT).trim();
        Matcher matcher = TICKET_PATTERN.matcher(message);
        if (matcher.find()) {
            String ticket = matcher.group().toUpperCase(Locale.ROOT);
            Optional<Issue> issue = repository.findByTicketCodeIgnoreCase(ticket);
            if (issue.isPresent()) {
                Issue i = issue.get();
                return ticket + " is currently " + i.getStatus().replace('_', ' ') + ". Priority: "
                        + i.getPriority() + ". Location: " + i.getLocation() + ". "
                        + i.getAffectedCount() + " people have marked themselves affected.";
            }
            return "I could not find " + ticket + ". Check the ticket number and try again.";
        }

        if (text.contains("how") && text.contains("report")) {
            return "Open Report Issue, choose a category and location, describe the problem, set severity from 1 to 5, mark any safety risk, and submit. The system will automatically assign a priority and ticket number.";
        }
        if (text.contains("priority")) {
            return "Priority is calculated from severity, safety risk, and how many people are affected. Safety hazards and issues affecting many students move toward High or Critical automatically.";
        }
        if (text.contains("critical")) {
            long count = repository.countByPriorityIgnoreCase("CRITICAL");
            return "There are currently " + count + " critical issue(s) in the system.";
        }
        if (text.contains("resolved")) {
            long count = repository.countByStatusIgnoreCase("RESOLVED");
            return count + " issue(s) are currently marked Resolved.";
        }
        if (text.contains("wifi") || text.contains("wi-fi") || text.contains("internet")) {
            return "For Wi-Fi problems, report the exact block/lab, whether the network is missing or connected without internet, and how many devices are affected. This helps the IT team diagnose faster.";
        }
        if (text.contains("water") || text.contains("leak")) {
            return "For water leaks, mark Safety Risk if the floor is slippery or electrical equipment is nearby. Those reports receive a higher automatic priority.";
        }
        if (text.matches(".*\\b(hi|hello|hey)\\b.*")) {
            return "Hi! I’m CampusBot. Ask me how to report an issue, how priority works, how many critical issues exist, or give me a ticket like FMC-1002.";
        }
        return "I can help with campus issue reporting, ticket status, priority, Wi-Fi, plumbing, electrical problems, and current issue statistics. Try asking: ‘What is the status of FMC-1002?’";
    }
}
