# Risk Register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| `.env.local` committed | Secret/config leak | `.gitignore` and submission gate |
| Backend URL hardcoded | Environment-specific code | Use `BACKEND_API_URL` in Route Handlers |
| `localStorage` remains | Assignment goal missed | Repository scan |
| Client Component overuse | App Router learning goal weakened | Keep page/layout server-side |
| API contract drift | Runtime UI failures | Shared TypeScript types and backend tests |
| SQLite DB committed | Dirty repo and stale data | Ignore `*.db` |

