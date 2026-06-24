from datetime import date, timedelta
from math import ceil

from sqlalchemy import Select, func, select
from sqlalchemy.orm import Session

from app.models.todo import Todo, utc_now
from app.schemas.todo import SortMode, StatusFilter, TodoCreate, TodoUpdate, ViewMode
from app.schemas.todo import validate_date_key


def list_todos(
    db: Session,
    *,
    view: ViewMode,
    date_key: str,
    status_filter: StatusFilter,
    search: str | None,
    sort: SortMode,
    page: int,
    page_size: int,
) -> dict[str, object]:
    query = _filtered_query(view=view, date_key=date_key, status_filter=status_filter, search=search)
    total_items = db.scalar(select(func.count()).select_from(query.subquery())) or 0
    total_pages = max(ceil(total_items / page_size), 1)
    safe_page = min(page, total_pages)

    items = db.scalars(
        _apply_sort(query, sort)
        .offset((safe_page - 1) * page_size)
        .limit(page_size)
    ).all()

    return {
        "items": items,
        "totalItems": total_items,
        "totalPages": total_pages,
        "page": safe_page,
        "pageSize": page_size,
    }


def create_todo(db: Session, payload: TodoCreate) -> Todo:
    now = utc_now()
    todo = Todo(
        text=payload.text,
        completed=False,
        date=payload.date,
        created_at=now,
        updated_at=now,
    )
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


def get_todo(db: Session, todo_id: int) -> Todo | None:
    return db.get(Todo, todo_id)


def update_todo(db: Session, todo: Todo, payload: TodoUpdate) -> Todo:
    data = payload.model_dump(exclude_unset=True)

    if "text" in data:
        todo.text = data["text"]
    if "completed" in data:
        todo.completed = data["completed"]
    if "date" in data:
        todo.date = data["date"]

    todo.updated_at = utc_now()
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


def delete_todo(db: Session, todo: Todo) -> None:
    db.delete(todo)
    db.commit()


def get_week_counts(db: Session, *, start_date: str) -> dict[str, int]:
    start = validate_date_key(start_date)
    start_day = date.fromisoformat(start)
    dates = [(start_day + timedelta(days=index)).isoformat() for index in range(7)]

    rows = db.execute(
        select(Todo.date, func.count(Todo.id))
        .where(Todo.date.in_(dates))
        .group_by(Todo.date)
    ).all()
    counts = {date_key: 0 for date_key in dates}
    counts.update({date_key: count for date_key, count in rows})
    return counts


def _filtered_query(*, view: ViewMode, date_key: str, status_filter: StatusFilter, search: str | None) -> Select[tuple[Todo]]:
    query = select(Todo)

    if view == "daily":
        query = query.where(Todo.date == date_key)

    if status_filter == "active":
        query = query.where(Todo.completed.is_(False))
    elif status_filter == "completed":
        query = query.where(Todo.completed.is_(True))

    if search:
        query = query.where(Todo.text.ilike(f"%{_escape_like(search)}%", escape="\\"))

    return query


def _escape_like(value: str) -> str:
    return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


def _apply_sort(query: Select[tuple[Todo]], sort: SortMode) -> Select[tuple[Todo]]:
    if sort == "date-desc":
        return query.order_by(Todo.date.desc(), Todo.created_at.desc())
    if sort == "created-desc":
        return query.order_by(Todo.created_at.desc())
    if sort == "created-asc":
        return query.order_by(Todo.created_at.asc())
    return query.order_by(Todo.date.asc(), Todo.created_at.desc())
