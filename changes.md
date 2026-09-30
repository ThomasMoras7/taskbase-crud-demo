# changes.md

## PostgreSQL driver dependency

- Added the `org.postgresql:postgresql` JDBC driver as a runtime dependency in `backend/pom.xml`, next to the embedded H2 driver. Required by the Spring Data JPA / PostgreSQL integration on this branch.
- Invalidates: `docs/Architecture.md` (backend dependencies)

## Task JPA entity

- Added `backend/src/main/java/com/taskbase/demo/model/Task.java`, a JPA entity in the new `model` package with `id` (`Long`, `IDENTITY` generation), `title` (`String`) and `done` (`boolean`), plus a no-arg constructor and accessors. Placed under `com.taskbase.demo` so it falls inside the `@SpringBootApplication` component scan and is picked up by Hibernate; the controller still uses its own in-memory `Task` class.
- Invalidates: `docs/DataStructure.md` (new persisted entity), `docs/Architecture.md` (new `model` package)

## Task repository

- Added `backend/src/main/java/com/taskbase/demo/repository/TaskRepository.java`, a Spring Data JPA repository for `Task` keyed by `Long`. No query methods declared yet.
- Invalidates: `docs/Architecture.md` (new `repository` package)

## Task service

- Added `backend/src/main/java/com/taskbase/demo/service/TaskService.java`, a `@Service` holding the CRUD operations on top of `TaskRepository` through constructor injection. Update and lookup return `Optional<Task>` so "not found" is data, not an exception; create takes only the title, leaving `id` and `done` server-controlled.
- Invalidates: `docs/Architecture.md` (new `service` package)

## Controller moved to the persistence layer

- Rewired `TaskController` on `TaskService` by constructor injection and deleted its nested `Task` class, the static `tasks` list and the static `nextId` counter. The controller now uses the `com.taskbase.demo.model.Task` entity, so `/api/task` reads and writes the database instead of a JVM-local list. Path variables for `PUT` and `DELETE` are `Long`; a missing task on update still yields 404, delete stays 204 and silent on unknown. The JSON contract is unchanged (`id`, `title`, `done`), so the frontend needed no change.
- `POST /api/task` now only reads `title` from the body and always stores `done = false`; a client sending `done: true` is ignored, where the in-memory version stored it.
- Tasks still vanish on restart: the default datasource is embedded in-memory H2 with `create-drop`, and no PostgreSQL `spring.datasource.*` configuration exists yet.
- Invalidates: `docs/API-TaskController.md` (whole page: handlers, flow, error handling, static state removed), `docs/Architecture.md` (package layout, persistence path), `docs/DataStructure.md` (in-memory list replaced by the persisted entity), `docs/Features.md` (data no longer lost on restart is now false again / storage description)

## Profile-based configuration

- Replaced `backend/src/main/resources/application.properties` with `application.yml` (application name, `open-in-view: false`, default profile `dev` overridable by `SPRING_PROFILES_ACTIVE`) plus `application-dev.yml` (in-memory H2 named `taskbase`, `create-drop`, H2 console at `/h2-console`) and `application-prod.yml` (PostgreSQL from `DB_HOST`/`DB_PORT`/`DB_NAME`/`DB_USERNAME`/`DB_PASSWORD`, `ddl-auto: update`).
- The dev H2 database is now named instead of auto-generated, so the same URL and H2 console session are reused across restarts. `open-in-view: false` clears the startup warning and closes the persistence context at the end of each request; the `Task` entity has no lazy relations, so serialisation is unaffected.
- Verified: `mvnw test` boots the dev profile; the prod profile resolves the PostgreSQL URL and driver, failing only with `Connection refused` since no local server is running.
- `ddl-auto: update` lets Hibernate create the `task` table on PostgreSQL. Flyway or equivalent is the proper answer once schemas need versioning.
- Invalidates: `docs/Architecture.md` (configuration files, datasource per profile), `docs/Features.md` (H2 console mention)
