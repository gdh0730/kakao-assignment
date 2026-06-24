import { FILTERS, SORTS, VIEWS } from "./constants";

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type FilterMode = (typeof FILTERS)[keyof typeof FILTERS];
export type ViewMode = (typeof VIEWS)[keyof typeof VIEWS];
export type SortMode = (typeof SORTS)[keyof typeof SORTS];
export type PageSize = 5 | 10 | 20;

export type TodoListParams = {
  view: ViewMode;
  date: string;
  filter: FilterMode;
  search?: string;
  sort: SortMode;
  page: number;
  pageSize: PageSize;
};

export type TodoListResponse = {
  items: Todo[];
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: PageSize;
};

export type WeekCountsResponse = {
  counts: Record<string, number>;
};

export type CreateTodoRequest = {
  text: string;
  date: string;
};

export type UpdateTodoRequest = {
  text?: string;
  completed?: boolean;
  date?: string;
};
