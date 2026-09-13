package com.fixmycampus;

import com.fixmycampus.model.Announcement;
import com.fixmycampus.model.Issue;
import com.fixmycampus.repository.AnnouncementRepository;
import com.fixmycampus.repository.IssueRepository;
import com.fixmycampus.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;

@SpringBootApplication
public class FixMyCampusApplication {
    public static void main(String[] args) {
        SpringApplication.run(FixMyCampusApplication.class, args);
    }

    @Bean
    CommandLineRunner seed(IssueRepository repository, AnnouncementRepository announcementRepository,
                           UserRepository userRepository, com.fixmycampus.service.AuthService authService) {
        return args -> {
            if (userRepository.count() == 0) {
                userRepository.save(new com.fixmycampus.model.User(
                        null,
                        "Monish B",
                        "student@fixmycampus.edu",
                        authService.hashPassword("student123"),
                        "STUDENT",
                        "Computer Science & Engineering",
                        "STU-2024-41",
                        LocalDateTime.now()
                ));
                userRepository.save(new com.fixmycampus.model.User(
                        null,
                        "Prof. Sarah Jenkins",
                        "teacher@fixmycampus.edu",
                        authService.hashPassword("teacher123"),
                        "TEACHER",
                        "Dept of ECE & AI Lab Coordinator",
                        "FAC-108",
                        LocalDateTime.now()
                ));
                userRepository.save(new com.fixmycampus.model.User(
                        null,
                        "Operations Director",
                        "admin@fixmycampus.edu",
                        authService.hashPassword("admin123"),
                        "ADMIN",
                        "Campus Infrastructure & Maintenance Office",
                        "ADM-001",
                        LocalDateTime.now()
                ));
            }

            if (announcementRepository.count() == 0) {
                announcementRepository.save(new Announcement(
                        null,
                        "Scheduled Water Tank Maintenance",
                        "Water supply in Main Block and Block B will be paused on Saturday from 2:00 PM to 5:00 PM for scheduled tank sanitization.",
                        "Maintenance",
                        "ALL",
                        "Estate & Facilities Office",
                        LocalDateTime.now().minusHours(4)
                ));
                announcementRepository.save(new Announcement(
                        null,
                        "Campus Wi-Fi AP Upgrade in Progress",
                        "Network engineers are currently replacing access points in AI & DS Block. Brief connection interruptions may occur during testing.",
                        "IT / Network",
                        "ALL",
                        "Campus IT Infrastructure",
                        LocalDateTime.now().minusHours(8)
                ));
            }

            if (repository.count() == 0) {
                repository.save(new Issue(
                        null,
                        "FMC-1001",
                        "Wi-Fi unavailable in AI Lab 2",
                        "Students and faculty cannot connect to the campus network during lab hours. Practical exam prep affected.",
                        "Wi-Fi / Network",
                        "AI & DS Block - Lab 2",
                        "HIGH",
                        "IN_PROGRESS",
                        "Prof. Sarah Jenkins",
                        "s.jenkins@campus.edu",
                        "TEACHER",
                        4,
                        false,
                        31,
                        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%230f172a'/><circle cx='300' cy='200' r='90' stroke='%233b82f6' stroke-width='8' fill='none' stroke-dasharray='140 140'/><circle cx='300' cy='200' r='55' stroke='%2360a5fa' stroke-width='8' fill='none' stroke-dasharray='90 90'/><circle cx='300' cy='200' r='14' fill='%23ef4444'/><line x1='210' y1='110' x2='390' y2='290' stroke='%23ef4444' stroke-width='10'/><text x='300' y='335' fill='%23cbd5e1' font-size='18' font-family='sans-serif' text-anchor='middle'>AI Lab 2 - Cisco AP-904 Offline</text></svg>",
                        "Campus IT & Network",
                        "Technician dispatched with replacement gigabit switch. Target resolution: 4:00 PM.",
                        true,
                        "Prof. Jenkins: Urgent — AI Lab has scheduled evaluation tomorrow.",
                        LocalDateTime.now().minusHours(7),
                        LocalDateTime.now().minusHours(2)
                ));

                repository.save(new Issue(
                        null,
                        "FMC-1002",
                        "Water leakage near staircase landing",
                        "Water is leaking continuously from the overhead valve. The marble tiles are extremely slippery.",
                        "Water / Plumbing",
                        "Main Block - First Floor",
                        "CRITICAL",
                        "ASSIGNED",
                        "Priya S",
                        "priya@student.edu",
                        "STUDENT",
                        5,
                        true,
                        18,
                        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%230b192c'/><path d='M300 110 C300 110 220 220 220 270 C220 314 256 350 300 350 C344 350 380 314 380 270 C380 220 300 110 300 110 Z' fill='%2338bdf8'/><rect x='180' y='350' width='240' height='16' rx='8' fill='%230284c7'/><text x='300' y='75' fill='%23f87171' font-size='22' font-weight='bold' font-family='sans-serif' text-anchor='middle'>SLIPPERY HAZARD - VALVE LEAK</text><text x='300' y='385' fill='%2394a3b8' font-size='16' font-family='sans-serif' text-anchor='middle'>Main Block - Staircase 2 Landing</text></svg>",
                        "Civil & Plumbing Maintenance",
                        "Plumber team notified. Warning cones placed at staircase entrance.",
                        false,
                        null,
                        LocalDateTime.now().minusHours(3),
                        LocalDateTime.now().minusHours(1)
                ));

                repository.save(new Issue(
                        null,
                        "FMC-1003",
                        "Projector HDMI port damaged",
                        "Projector turns on but does not receive video input. Audio port also loose.",
                        "Classroom Equipment",
                        "Block B - Room B204",
                        "HIGH",
                        "REPORTED",
                        "Kavin R",
                        "kavin@student.edu",
                        "STUDENT",
                        3,
                        false,
                        9,
                        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%231e1e2e'/><rect x='160' y='130' width='280' height='120' rx='12' fill='%23313244' stroke='%23fab387' stroke-width='4'/><circle cx='370' cy='190' r='34' fill='%2311111b' stroke='%23fab387' stroke-width='5'/><circle cx='370' cy='190' r='14' fill='%23f38ba8'/><text x='205' y='198' fill='%23cdd6f4' font-size='16' font-family='sans-serif'>NO INPUT</text><text x='300' y='300' fill='%23a6adc8' font-size='17' font-family='sans-serif' text-anchor='middle'>Room B204 Ceiling Projector</text></svg>",
                        null,
                        null,
                        true,
                        "Prof. Sarah Jenkins: Endorsed — Lecturers need this projector for morning classes.",
                        LocalDateTime.now().minusDays(1),
                        LocalDateTime.now().minusDays(1)
                ));

                repository.save(new Issue(
                        null,
                        "FMC-1004",
                        "Broken corridor light tube",
                        "Two fluorescent lights flickering and one tube broken in second-floor corridor.",
                        "Electrical",
                        "Block C - Second Floor",
                        "LOW",
                        "RESOLVED",
                        "Monish B",
                        "monish@student.edu",
                        "STUDENT",
                        2,
                        false,
                        5,
                        null,
                        "Electrical Maintenance",
                        "Replaced with new 20W LED batten fittings. Verified and working.",
                        false,
                        null,
                        LocalDateTime.now().minusDays(2),
                        LocalDateTime.now().minusHours(12)
                ));
            }
        };
    }
}
