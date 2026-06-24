# Test Plan

## Backend

- `GET /health`
- Todo create, list, update, complete toggle, delete
- Empty text and over-length text validation
- Invalid date validation
- Daily and all views
- all, active, completed filters
- Keyword search
- Filter and search combination
- date and created-at sorting
- page and pageSize behavior
- week counts
- 404 for missing Todo

## Frontend

- `npm run lint`
- `npm run build`
- Manual Todo CRUD path
- API error message path
- Date navigation and week count refresh
- Search input, clear action, and search + filter interaction

## Repository

- Scan for `localStorage`.
- Scan for hardcoded backend URLs in source files.
- Confirm `.env.example` exists and `.env.local` is ignored.
