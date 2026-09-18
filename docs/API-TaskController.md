# API: TaskController

[Index](Index.md) > [API](API.md)

## Overview

Exposes full CRUD for tasks at `/api/task`, backed by an in-memory list. Request and response bodies are JSON (`Content-Type: application/json`).

Base URL: `http://localhost:8080/api/task` (reachable from the browser via the Vite proxy at `http://localhost:5173/api/task`).

## Data

See [DataStructure.md](DataStructure.md) for the `Task` shape.

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

Creates a task from the request body, assigns a sequential `id`, appends it, and returns the created task (including its `id`).

### PUT `/{id}`

Replaces `title` and `done` on the matching task and returns the updated task. An unknown `id` yields a 404.

### DELETE `/{id}`

Removes the matching task. Silent no-op for an unknown `id` (still 204).

## Flow

The frontend maintains a local copy of the list in React state. On load it fetches the list with GET. Adding a task POSTs, then appends the returned task to the state. Toggling the checkbox PUTs the new `done` value, then replaces the task in the state with the returned one. Deleting POSTs an empty DELETE, then filters the removed id out of the state.

## Error Handling

- `PUT` with an unknown id returns `404 Not Found`.
- All other failures surface as transport or status errors, which the frontend displays inline.

## Rules

- The collection and id counter are `static`: they are process-lifetime and reset on restart.
- Missing `id` in a POST body is accepted and ignored; the server assigns it.