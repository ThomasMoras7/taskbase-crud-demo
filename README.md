# TaskBase CRUD Demo

Minimal full-stack CRUD demo: Spring Boot backend + React frontend. Manage a task list (add, toggle done, delete) with a Material-style UI.

## Structure

- `backend/` — Spring Boot 4.1.1 (Java 21, Maven only-script wrapper, memory-backed REST API)
- `frontend/` — Vite 8 + React 19
- `docs/` — wiki (see [Index](docs/Index.md))

## Prerequisites

- Java 21
- Node.js (npm)

## Run

Both servers must run for the app to work. Start with a hard reload mind-set: if the UI looks stale, do `Ctrl+Shift+R`.

```bash
# terminal 1 — backend (http://localhost:8080)
cd backend
.\mvnw.cmd spring-boot:run

# terminal 2 — frontend (http://localhost:5173)
cd frontend
npm install   # once
npm run dev
```

**Must run `mvnw.cmd` from inside `backend/`** — it has no project detection, so launching it from the repo root fails with "No plugin found for prefix 'spring-boot'". Same for the frontend: `npm run dev` from `frontend/`.

First `mvnw.cmd` run downloads Maven dependencies (allow a few minutes). Ports: 8080 (API), 5173 (UI). Vite proxies `/api` to the backend; if the page shows a "site inaccessible" error, the frontend server is not running.

The task list is stored in backend memory: it resets on every backend restart. This is intentional for the demo.

## Checks

```bash
backend> .\mvnw.cmd test
frontend> npm run build
frontend> npm run lint
```