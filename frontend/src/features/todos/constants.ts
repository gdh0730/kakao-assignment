export const FILTERS = {
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed",
} as const;

export const VIEWS = {
  DAILY: "daily",
  ALL: "all",
} as const;

export const SORTS = {
  DATE_ASC: "date-asc",
  DATE_DESC: "date-desc",
  CREATED_DESC: "created-desc",
  CREATED_ASC: "created-asc",
} as const;

export const PAGE_SIZES = [5, 10, 20] as const;

