# Code Review Checklist

## Functional

- Does the change meet the stated Todo behavior?
- Are frontend and backend contracts aligned?
- Are loading, empty, and error states handled?

## Architecture

- Does browser code call only Next `/api/*` endpoints?
- Is `BACKEND_API_URL` server-only?
- Are Server Components and Client Components separated correctly?

## Data And Validation

- Does FastAPI validate user input?
- Are timestamps managed by the backend?
- Is SQLite runtime data excluded from Git?

## Tests

- Are backend tests meaningful for changed API behavior?
- Did lint and build pass?

