# Optimisations

[Index](Index.md)

Improvement tracker. Categories: `OPT` (performance), `FAC` (DRY), `EXT` (config), `SIM` (lightweight).

| ID  | Category | Title                                                                          | Status |
|-----|----------|--------------------------------------------------------------------------------|--------|
| O01 | FAC      | Deduplicate PUT logic: toggle and edit share the same fetch/PUT + `map` replace | Open   |
| O02 | FAC      | Use functional state updates (`setTasks(current => ...)`) to avoid stale closure | Open   |
| O03 | OPT      | Make backend ids and list safe for concurrent requests (`AtomicInteger`)       | Open   |
| O04 | EXT      | Add single-item endpoint `GET /api/task/{id}`                                  | Open   |
| O05 | SIM      | Drop unused `PATCH` from CORS `allowedMethods`                                 | Open   |
| O06 | SIM      | Submit edit on Enter key inside the edit field                                 | Open   |
| O07 | EXT      | Accept empty POST body gracefully instead of storing `null` title              | Open   |