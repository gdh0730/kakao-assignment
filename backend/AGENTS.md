# Backend Rules

- FastAPI owns Todo data and validation.
- Keep route, schema, CRUD, model, and DB session code separated.
- Use SQLAlchemy 2.x patterns.
- Pydantic response fields should serialize timestamps as `createdAt` and `updatedAt`.
- Run `pytest` after backend changes.

