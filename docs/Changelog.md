# Changelog

[Index](Index.md)

## 1.0.0

First release.

### Added

- Backend: `TaskController` at `/api/task` with in-memory CRUD (list, create, update, delete).
- Frontend: React task list with Material-style UI.
- Add a task via POST with loading spinner in the button.
- Toggle completion via checkbox (PUT); done tasks shown struck through.
- Edit a task title via pencil icon with save and cancel actions.
- Delete a task via trash icon with loading spinner.
- Inline error display for failed requests.
- CORS opened from `localhost:5173`; Vite dev proxy for `/api`.
- English wiki in `docs/` (architecture, data structure, features, API, changelog, optimisations).