from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.db.session import Base, get_db
from app.main import app
from app.models import todo  # noqa: F401


@pytest.fixture
def client(tmp_path) -> Generator[TestClient, None, None]:
    engine = create_engine(
        f"sqlite:///{tmp_path / 'test.db'}",
        connect_args={"check_same_thread": False},
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    def override_get_db() -> Generator[Session, None, None]:
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def create_todo(client: TestClient, text: str, date: str = "2026-06-24") -> dict:
    response = client.post("/todos", json={"text": text, "date": date})
    assert response.status_code == 201
    return response.json()


def test_health(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_create_list_update_and_delete_todo(client: TestClient) -> None:
    created = create_todo(client, "FastAPI 구현")
    assert created["text"] == "FastAPI 구현"
    assert created["completed"] is False
    assert "createdAt" in created
    assert "updatedAt" in created

    list_response = client.get("/todos", params={"date": "2026-06-24"})
    assert list_response.status_code == 200
    assert list_response.json()["totalItems"] == 1

    updated = client.patch(
        f"/todos/{created['id']}",
        json={"text": "FastAPI 구현 완료", "completed": True},
    )
    assert updated.status_code == 200
    assert updated.json()["text"] == "FastAPI 구현 완료"
    assert updated.json()["completed"] is True

    deleted = client.delete(f"/todos/{created['id']}")
    assert deleted.status_code == 204
    assert client.get("/todos", params={"date": "2026-06-24"}).json()["totalItems"] == 0


def test_validation_errors(client: TestClient) -> None:
    assert client.post("/todos", json={"text": "   ", "date": "2026-06-24"}).status_code == 422
    assert client.post("/todos", json={"text": "x" * 81, "date": "2026-06-24"}).status_code == 422
    assert client.post("/todos", json={"text": "invalid date", "date": "2026-02-30"}).status_code == 422
    assert client.get("/todos", params={"date": "2026-06-24", "pageSize": 7}).status_code == 422


def test_filter_sort_and_pagination(client: TestClient) -> None:
    first = create_todo(client, "첫 번째", "2026-06-24")
    second = create_todo(client, "두 번째", "2026-06-25")
    third = create_todo(client, "세 번째", "2026-06-24")
    client.patch(f"/todos/{first['id']}", json={"completed": True})

    active = client.get(
        "/todos",
        params={"view": "all", "date": "2026-06-24", "filter": "active", "sort": "date-asc"},
    )
    assert [item["id"] for item in active.json()["items"]] == [third["id"], second["id"]]

    date_desc = client.get(
        "/todos",
        params={"view": "all", "date": "2026-06-24", "sort": "date-desc", "pageSize": 5},
    )
    assert [item["id"] for item in date_desc.json()["items"]] == [second["id"], third["id"], first["id"]]

    create_todo(client, "네 번째", "2026-06-26")
    create_todo(client, "다섯 번째", "2026-06-27")
    create_todo(client, "여섯 번째", "2026-06-28")
    paged = client.get(
        "/todos",
        params={"view": "all", "date": "2026-06-24", "page": 2, "pageSize": 5},
    )
    assert paged.json()["page"] == 2
    assert paged.json()["totalPages"] == 2
    assert len(paged.json()["items"]) == 1


def test_search_and_filter_combination(client: TestClient) -> None:
    first = create_todo(client, "FastAPI 검색 구현", "2026-06-24")
    second = create_todo(client, "Next.js 검색 UI", "2026-06-24")
    third = create_todo(client, "FastAPI 필터 검색", "2026-06-25")
    client.patch(f"/todos/{first['id']}", json={"completed": True})

    daily_search = client.get("/todos", params={"date": "2026-06-24", "search": "검색"})
    assert daily_search.status_code == 200
    assert [item["id"] for item in daily_search.json()["items"]] == [second["id"], first["id"]]

    all_search = client.get(
        "/todos",
        params={"view": "all", "date": "2026-06-24", "search": "FastAPI", "sort": "date-asc"},
    )
    assert [item["id"] for item in all_search.json()["items"]] == [first["id"], third["id"]]

    active_search = client.get(
        "/todos",
        params={"view": "all", "date": "2026-06-24", "filter": "active", "search": "검색"},
    )
    assert [item["id"] for item in active_search.json()["items"]] == [second["id"], third["id"]]

    blank_search = client.get("/todos", params={"date": "2026-06-24", "search": "   "})
    assert blank_search.json()["totalItems"] == 2


def test_week_counts_and_not_found(client: TestClient) -> None:
    create_todo(client, "월요일", "2026-06-22")
    create_todo(client, "수요일", "2026-06-24")
    create_todo(client, "수요일 2", "2026-06-24")

    response = client.get("/todos/week-counts", params={"startDate": "2026-06-22"})
    assert response.status_code == 200
    assert response.json()["counts"]["2026-06-22"] == 1
    assert response.json()["counts"]["2026-06-24"] == 2
    assert response.json()["counts"]["2026-06-28"] == 0

    assert client.patch("/todos/999", json={"completed": True}).status_code == 404
    assert client.delete("/todos/999").status_code == 404
