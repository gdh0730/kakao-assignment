<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Frontend Rules

- Keep `src/app/layout.tsx` and `src/app/page.tsx` as Server Components.
- Put Todo interactivity in `src/features/todos/TodoApp.tsx` with `"use client"`.
- Browser-facing code must call relative `/api/todos` endpoints only.
- Route Handlers read `BACKEND_API_URL` from server-side environment variables.
- Run `npm run lint` and `npm run build` after frontend changes.
