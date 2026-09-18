# AGENTS.md

Minimal full-stack CRUD demo: Spring Boot backend + Vite/React frontend. No git repo initialized yet, no root tooling — `backend/` and `frontend/` are two independent projects. CRUD is implemented end to end (add, toggle done, delete).

## Layout and stack

- `backend/` — Spring Boot 4.1.1 (Framework 7), Java 21, Maven via generated "only-script" wrapper, memory-backed REST API (no database)
- `frontend/` — Vite 8 + React 19, npm, oxlint (not ESLint)
- `docs/` — English wiki, see `docs/Index.md` for the table of contents

## Commands

```bash
# backend (8080)
backend> .\mvnw.cmd spring-boot:run        # run; first run downloads Maven deps, allow ≥5 min
backend> .\mvnw.cmd -q -DskipTests compile # fast compile check
backend> .\mvnw.cmd test                   # unit tests

# frontend (5173)
frontend> npm run dev   # dev server
frontend> npm run build # prod build check
frontend> npm run lint  # oxlint (must stay clean)
```

Run both servers for end-to-end work. Vite proxies `/api` → `http://localhost:8080` (`frontend/vite.config.js`); `backend/src/main/java/com/taskbase/demo/config/CorsConfig.java` also allows `/api/**` from `localhost:5173`.

## Windows / workspace quirks (hard-earned, do not fight them)

- The working directory path contains accents and spaces (`...Web\taskbase crud demo`). **Never hand-write `.cmd`/batch scripts** — they silently break on such paths. Always use the toolchain's official launcher (`mvnw.cmd`).
- `mvnw.cmd` is the official only-script wrapper (PowerShell-passthrough, `wrapperVersion=3.3.4`, downloads Maven into `~/.m2/wrapper/dists`). It handles the path correctly — keep it. Must be invoked from inside `backend/` (no project detection at the root).
- In this shell, file tools such as glob/grep/`Expand-Archive` can fail to autoload; fall back to `Get-ChildItem`, `Select-String`, and `tar -xf` for zip extraction.
- Never embed `%~dp0` (trailing backslash) directly into a quoted java `-D` option — it swallows the next argument; strip the trailing `\` first.

## Framework version quirks

- Spring Boot 4 / Framework 7 renamed artifacts: `spring-boot-starter-webmvc` (not `-web`) and `spring-boot-h2console` (H2 console at `/h2-console`). Don't assume Boot 3 names.
- `backend/src/main/resources/application.properties` is intentionally one line; embedded H2 auto-configures `jdbc:h2:mem:testdb`. Keep config minimal.

## Current state and conventions

- Backend: `TaskController` at `/api/task` holds tasks in a static in-memory list (resets on restart). GET list, POST create (201, returns task with assigned `id`), PUT `/{id}` update (404 if unknown), DELETE `/{id}` (204, silent on unknown).
- Frontend: a single `App.jsx` — fetch GET on mount, add via POST, checkbox toggle via PUT (struck-through when done), trash icon via DELETE. Loading spinners inside the buttons, inline error display. Material-style CSS in `App.css`.
- Project language is French; docs live in `docs/` in English. Code is comment-free; keep `npm run lint` green. Keep changes minimal — no state library, no UI framework, no comments.