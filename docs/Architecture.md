# Architecture

[Index](Index.md)

## Overview

TaskBase is a minimal full-stack CRUD demo. The backend exposes a REST API for tasks, the frontend renders a Material-style task list and calls that API. There is no build tooling at the repo root: `backend/` and `frontend/` are independent projects.

## File layout

```
taskbase crud demo/
├── AGENTS.md                 # Repo conventions and tooling notes
├── README.md                 # Quick start
├── docs/                     # Wiki (English)
│   ├── Index.md
│   ├── Architecture.md
│   ├── DataStructure.md
│   ├── Features.md
│   ├── API.md
│   ├── API-TaskController.md
│   ├── Changelog.md
│   └── Optimisations.md
├── backend/                  # Spring Boot 4.1.1, Java 21, Maven only-script wrapper
│   ├── mvnw.cmd
│   └── src/main/java/com/taskbase/demo/
│       ├── TaskbaseDemoApplication.java
│       ├── config/CorsConfig.java
│       └── controller/TaskController.java
│   └── src/main/resources/application.properties
└── frontend/                 # Vite 8 + React 19, npm
    ├── vite.config.js        # /api proxy → localhost:8080
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── App.css
        └── index.css
```

## Design principles

- Minimal dependency footprint: no ORM, no state library, no UI framework. Tasks live in a static in-memory list on the backend.
- The frontend communicates with the backend only through the REST API; the React state is a local mirror of the server list.
- Two servers must run for end-to-end work: backend on 8080, frontend on 5173.

## Communication path

Browser → `http://localhost:5173` (Vite) → proxy `/api` → `http://localhost:8080` → `TaskController`. CORS is additionally opened from `localhost:5173` in `CorsConfig.java`, so direct API calls from the dev origin also work.