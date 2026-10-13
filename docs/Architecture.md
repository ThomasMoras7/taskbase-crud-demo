# Architecture

[Index](Index.md)

## Overview

TaskBase is a minimal full-stack CRUD demo. The backend exposes a REST API for tasks, the frontend renders a Material-style task list and calls that API. There is no build tooling at the repo root: `backend/` and `frontend/` are independent projects.

The backend persists tasks in a relational database, so the list survives a restart. Which database depends on the active profile: a file-backed H2 database in dev, PostgreSQL in prod.

## File layout

```
taskbase crud demo/
├── AGENTS.md                 # Repo conventions and tooling notes
├── README.md                 # Quick start
├── changes.md                # Working log between documentation passes
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
│   ├── data/                 # H2 database files (dev only, git-ignored)
│   ├── src/main/java/com/taskbase/demo/
│   │   ├── TaskbaseDemoApplication.java
│   │   ├── config/CorsConfig.java
│   │   ├── controller/TaskController.java
│   │   ├── service/TaskService.java
│   │   ├── repository/TaskRepository.java
│   │   └── model/Task.java
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   ├── application-dev.yml
│   │   └── application-prod.yml
│   └── src/test/resources/application.yml
└── frontend/                 # Vite 8 + React 19, npm
    ├── vite.config.js        # /api proxy → localhost:8080
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── App.css
        └── index.css
```

## Layers

The backend is split into one package per responsibility, all under `com.taskbase.demo` so they fall inside the component scan:

| Layer        | Holds                                                                |
|--------------|----------------------------------------------------------------------|
| `controller` | HTTP mapping, status codes, translation of "not found" into a 404     |
| `service`    | CRUD operations, returns `Optional` where an absence is legitimate    |
| `repository` | Spring Data JPA repository over the `Task` entity                     |
| `model`      | The `Task` JPA entity mapped to the `task` table                      |

Dependencies point one way: controller → service → repository → database. Nothing below the controller knows about HTTP.

## Design principles

- Minimal dependency footprint: no state library, no UI framework. Persistence goes through Spring Data JPA, which brings its own layer.
- The frontend communicates with the backend only through the REST API; the React state is a local mirror of the server list.
- Two servers must run for end-to-end work: backend on 8080, frontend on 5173.
- The persistence context is closed at the end of each request (`open-in-view: false`). The entity has no lazy relations, so serialisation is unaffected.

## Configuration

Configuration is split by profile. `application.yml` holds what never changes and picks the active profile; each profile file holds its own datasource.

| File                     | Contents                                                                              |
|--------------------------|---------------------------------------------------------------------------------------|
| `application.yml`        | Application name, `open-in-view: false`, active profile (`SPRING_PROFILES_ACTIVE`, `dev` by default) |
| `application-dev.yml`    | H2 on `./data/taskbase`, schema kept and completed (`update`), H2 console at `/h2-console` |
| `application-prod.yml`   | PostgreSQL from `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, schema updated on startup |
| `src/test/resources/application.yml` | In-memory H2 with `create-drop`, so tests never touch the dev database |

The test copy of `application.yml` shadows the main one on the test classpath: tests run no profile and no profile file, and fall back to a throwaway in-memory database.

The prod datasource expects an existing database and role. Nothing creates them, so a first run against a fresh server fails to connect.

No migration tool is in place. Schema evolution is delegated to Hibernate's `update`, which adds what is missing but never migrates what changed.

## Communication path

Browser → Vite dev server → proxy `/api` → `http://localhost:8080` → `TaskController` → `TaskService` → `TaskRepository` → database.

`CorsConfig.java` opens `/api/**` to any port on `localhost` and `127.0.0.1`, so direct API calls from the dev origin work whatever port Vite landed on. Vite binds 5173 only when that port is free, and silently shifts to the next one otherwise; an origin pinned to a single port breaks every API call with a 403 as soon as 5173 is already taken.

## Databases

| Profile | Database                | Location                                       | Schema on startup |
|---------|-------------------------|------------------------------------------------|-------------------|
| dev     | H2, file-backed         | `backend/data/taskbase.mv.db`, git-ignored      | Created if missing, existing rows kept |
| prod    | PostgreSQL              | Host, port, database and role from the environment | Created if missing, existing rows kept |
| test    | H2, in-memory           | Process lifetime                               | Created then dropped |

Only dev writes files inside the repo, which is why `backend/data/` is git-ignored.
