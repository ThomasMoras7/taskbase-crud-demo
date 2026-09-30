# changes.md

## PostgreSQL driver dependency

- Added the `org.postgresql:postgresql` JDBC driver as a runtime dependency in `backend/pom.xml`, next to the embedded H2 driver. Required by the Spring Data JPA / PostgreSQL integration on this branch.
- Invalidates: `docs/Architecture.md` (backend dependencies)

## Task JPA entity

- Added `backend/src/main/java/com/taskbase/demo/model/Task.java`, a JPA entity in the new `model` package with `id` (`Long`, `IDENTITY` generation), `title` (`String`) and `done` (`boolean`), plus a no-arg constructor and accessors. Placed under `com.taskbase.demo` so it falls inside the `@SpringBootApplication` component scan and is picked up by Hibernate; the controller still uses its own in-memory `Task` class.
- Invalidates: `docs/DataStructure.md` (new persisted entity), `docs/Architecture.md` (new `model` package)
