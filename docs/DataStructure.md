# DataStructure

[Index](Index.md)

## Task

In-memory representation managed by `TaskController`. No database table; tasks are held in a static `ArrayList`.

| Field   | Type    | Description                                           |
|---------|---------|-------------------------------------------------------|
| `id`    | integer | Auto-incremented, sequential, server-assigned on POST |
| `title` | string  | User-provided label                                   |
| `done`  | boolean | Completion status, toggled via checkbox (PUT)         |

`id` is never sent by the client; the server assigns it and returns it. A task with a missing `id` in the request body is valid (the field is simply ignored). `done` defaults to `false` on creation.

The collection is reset every time the backend process restarts.