# Verification Gates

## Before Implementation

- Relevant ADR checked.
- API/data-flow boundary understood.
- Acceptance criteria written in the current task or prompt-log.

## Before Completion

```powershell
cd backend
pytest
```

```powershell
cd frontend
npm run lint
npm run build
```

```powershell
rg "localStorage|localhost:8000|127.0.0.1:8000" frontend/src backend/app
```

## Before GitHub Submission

- README setup works from a clean checkout.
- `.env.example` files are committed.
- `.env.local`, `.venv`, `.next`, `node_modules`, and `*.db` are not committed.
- Harness docs describe how Codex was used.

