# API: TaskController

[Index](Index.md) > [API](API.md)

## Overview

Exposes full CRUD for tasks at `/api/task`, backed by the database through `TaskService`. Request and response bodies are JSON (`Content-Type: application/json`).

Base URL: `http://localhost:8080/api/task` (reachable from the browser via the Vite proxy at the dev server origin).

## Data

See [DataStructure.md](DataStructure.md) for the `Task` shape and where it is stored.

## Handlers

### Summary

| Method | Path     | Status   | Purpose                        |
|--------|----------|----------|--------------------------------|
| GET    | `/`      | 200      | List all tasks                 |
| POST   | `/`      | 201      | Create a task                  |
| PUT    | `/{id}`  | 200      | Update title and/or done       |
| DELETE | `/{id}`  | 204      | Delete a task                  |

### GET `/`

Returns the full task list as a JSON array.

### POST `/`

Creates a task from the request body and returns it, including the `id` assigned by the database. Only `title` is read: `done` is stored as `false` whatever the client sends.

### PUT `/{id}`

Replaces `title` and `done` on the matching task and returns the updated task. An unknown `id` yields a 404.

### DELETE `/{id}`

Removes the matching task. Silent no-op for an unknown `id` (still 204).

## Flow

The frontend maintains a local copy of the list in React state. On load it fetches the list with GET. Adding a task POSTs, then appends the returned task to the state. Toggling the checkbox PUTs the new `done` value, then replaces the task in the state with the returned one. Editing the title PUTs it the same way. Deleting sends the DELETE, then filters the removed id out of the state.

Each request is stateless on the backend side: the database holds the truth, and every handler returns what was written, so the frontend always reconciles from the server response rather than from its own guess.

## Error Handling

- `PUT` with an unknown id returns `404 Not Found`.
- All other failures surface as transport or status errors, which the frontend displays inline.
- A rejected request origin, from a browser calling the API directly instead of going through the Vite proxy, returns `403` before any handler runs.

## Rules

- `id` is never taken from the request: it is generated on insert, and `POST` only reads `title`.
- Creation always stores `done = false`; changing it requires a `PUT`.
- Delete is idempotent: an unknown id is not an error.
- The response of a write is the entity as persisted, so it carries the authoritative `id`.
