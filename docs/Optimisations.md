# Optimisations

[Index](Index.md)

Improvement tracker. Pending items only; an entry is removed once applied. Categories: `OPT` (performance), `FAC` (DRY), `EXT` (config), `SIM` (lightweight).

| ID  | Category | Priority | Title                                                                          |
|-----|----------|----------|--------------------------------------------------------------------------------|
| O08 | EXT      | High     | Introduce a migration tool (Flyway) so schema changes are versioned and replayable |
| O09 | EXT      | High     | Provision the prod database and role (script or container) instead of assuming they exist |
| O01 | FAC      | Medium   | Deduplicate PUT logic: toggle and edit share the same fetch/PUT + `map` replace |
| O02 | FAC      | Medium   | Use functional state updates (`setTasks(current => ...)`) to avoid stale closure |
| O07 | EXT      | Medium   | Reject an empty or title-less POST body instead of storing `null`              |
| O04 | EXT      | Low      | Add single-item endpoint `GET /api/task/{id}`                                  |
| O05 | SIM      | Low      | Drop unused `PATCH` from CORS `allowedMethods`                                 |
| O06 | SIM      | Low      | Submit edit on Enter key inside the edit field                                 |

No `OPT` entry remains: the previous one, making ids and the list safe for concurrent requests, disappeared with the in-memory list, now covered by database transactions.
