from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.crud import todo as todo_crud
from app.db.session import get_db
from app.schemas.todo import (
    PAGE_SIZES,
    SortMode,
    StatusFilter,
    TodoCreate,
    TodoListResponse,
    TodoRead,
    TodoUpdate,
    ViewMode,
    WeekCountsResponse,
    validate_date_key,
)

router = APIRouter(prefix="/todos", tags=["todos"])


@router.get("", response_model=TodoListResponse)
def list_todos(
    view: ViewMode = Query(default="daily"),
    date_key: str = Query(alias="date"),
    status_filter: StatusFilter = Query(default="all", alias="filter"),
    search: str | None = Query(default=None, max_length=80),
    sort: SortMode = Query(default="date-asc"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=5, alias="pageSize"),
    db: Session = Depends(get_db),
) -> dict[str, object]:
    if page_size not in PAGE_SIZES:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="pageSize must be 5, 10, or 20")

    try:
        validate_date_key(date_key)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc

    normalized_search = search.strip() if search else None

    return todo_crud.list_todos(
        db,
        view=view,
        date_key=date_key,
        status_filter=status_filter,
        search=normalized_search,
        sort=sort,
        page=page,
        page_size=page_size,
    )


@router.post("", response_model=TodoRead, status_code=status.HTTP_201_CREATED)
def create_todo(payload: TodoCreate, db: Session = Depends(get_db)):
    return todo_crud.create_todo(db, payload)


@router.patch("/{todo_id}", response_model=TodoRead)
def update_todo(todo_id: int, payload: TodoUpdate, db: Session = Depends(get_db)):
    todo = todo_crud.get_todo(db, todo_id)
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    return todo_crud.update_todo(db, todo, payload)


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int, db: Session = Depends(get_db)) -> Response:
    todo = todo_crud.get_todo(db, todo_id)
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    todo_crud.delete_todo(db, todo)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/week-counts", response_model=WeekCountsResponse)
def week_counts(
    start_date: str = Query(alias="startDate"),
    db: Session = Depends(get_db),
) -> dict[str, dict[str, int]]:
    try:
        counts = todo_crud.get_week_counts(db, start_date=start_date)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc
    return {"counts": counts}
