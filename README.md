# FixMyCampus — React + Spring Boot

A full-stack campus issue reporting and resolution website with a React frontend, Spring Boot backend, H2 database, analytics dashboard and CampusBot chatbot.

## Project structure

```text
FixMyCampus_React_SpringBoot/
├── frontend/          React + Vite UI
└── backend/           Spring Boot REST API + H2 database
```

## Features

- Professional responsive student dashboard
- Report campus problems with category, location, severity and safety risk
- Automatic priority calculation: LOW / MEDIUM / HIGH / CRITICAL
- Ticket IDs such as `FMC-1005`
- Campus-wide issue feed and search
- “I’m affected too” community impact counter
- Admin / maintenance workflow status updates
- Dashboard statistics and issue-category analytics
- CampusBot chatbot connected to Spring Boot data
- H2 persistent local database
- React and backend are completely separate folders

## Requirements

- Node.js 18+ (Node 22 is fine)
- Java 21
- Maven is optional: the included `backend/mvnw.cmd` downloads a local Maven copy automatically the first time

## Run backend

Open a terminal in `backend`:

```bat
mvnw.cmd spring-boot:run
```

Backend: `http://localhost:8080`

H2 console: `http://localhost:8080/h2-console`

JDBC URL:

```text
jdbc:h2:file:./data/fixmycampus
```

Username: `sa`
Password: blank

## Run frontend

Open a second terminal in `frontend`:

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173`

Vite proxies `/api` to Spring Boot during local development.

## API endpoints

- `GET /api/issues`
- `POST /api/issues`
- `GET /api/issues/{ticketCode}`
- `PATCH /api/issues/{ticketCode}/status`
- `POST /api/issues/{ticketCode}/affected`
- `GET /api/dashboard/stats`
- `POST /api/chat`

## CampusBot examples

Try:

- `How do I report an issue?`
- `How is priority calculated?`
- `How many critical issues are there?`
- `What is the status of FMC-1002?`
- `My Wi-Fi is not working`

CampusBot currently works without an external AI key. `ChatService.java` is the integration point to add Gemini/OpenAI later.

## Recommended production upgrades

- PostgreSQL / Supabase instead of H2
- Spring Security + JWT + student/admin/maintenance accounts
- Cloudinary/S3 image uploads
- Gemini/OpenAI for semantic duplicate detection and richer CampusBot answers
- Email/push notifications
- Campus map and issue heatmap
- WebSocket/SSE real-time updates

## Fastest Windows start

Double-click `run-all.bat` from the project root. It opens the Spring Boot backend and React frontend in separate terminals. On the first run, the backend wrapper may download Maven and the frontend will run `npm install`.
