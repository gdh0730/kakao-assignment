from datetime import date as date_type, datetime
import re
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


ViewMode = Literal["daily", "all"]
StatusFilter = Literal["all", "active", "completed"]
SortMode = Literal["date-asc", "date-desc", "created-desc", "created-asc"]

DATE_KEY_PATTERN = re.compile(r"^\d{4}-\d{2}-\d{2}$")
MIN_YEAR = 1900
MAX_YEAR = 2100
PAGE_SIZES = {5, 10, 20}


def validate_date_key(value: str) -> str:
    if not DATE_KEY_PATTERN.fullmatch(value):
        raise ValueError("date must use YYYY-MM-DD format")

    try:
        parsed_date = date_type.fromisoformat(value)
    except ValueError as exc:
        raise ValueError("date must be a valid calendar date") from exc

    if parsed_date.year < MIN_YEAR or parsed_date.year > MAX_YEAR:
        raise ValueError("date year must be between 1900 and 2100")

    return value


class TodoCreate(BaseModel):
    text: str = Field(min_length=1, max_length=80)
    date: str

    @field_validator("text")
    @classmethod
    def normalize_text(cls, value: str) -> str:
        normalized = value.strip()
        if not normalized:
            raise ValueError("text must not be empty")
        return normalized

    @field_validator("date")
    @classmethod
    def validate_date(cls, value: str) -> str:
        return validate_date_key(value)


class TodoUpdate(BaseModel):
    text: str | None = Field(default=None, min_length=1, max_length=80)
    completed: bool | None = None
    date: str | None = None

    @field_validator("text")
    @classmethod
    def normalize_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return value
        normalized = value.strip()
        if not normalized:
            raise ValueError("text must not be empty")
        return normalized

    @field_validator("date")
    @classmethod
    def validate_optional_date(cls, value: str | None) -> str | None:
        if value is None:
            return value
        return validate_date_key(value)


class TodoRead(BaseModel):
    id: int
    text: str
    completed: bool
    date: str
    created_at: datetime = Field(validation_alias="created_at", serialization_alias="createdAt")
    updated_at: datetime = Field(validation_alias="updated_at", serialization_alias="updatedAt")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class TodoListResponse(BaseModel):
    items: list[TodoRead]
    totalItems: int
    totalPages: int
    page: int
    pageSize: int


class WeekCountsResponse(BaseModel):
    counts: dict[str, int]
