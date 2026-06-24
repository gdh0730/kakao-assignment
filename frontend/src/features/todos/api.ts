import axios from "axios";

import type {
  CreateTodoRequest,
  Todo,
  TodoListParams,
  TodoListResponse,
  UpdateTodoRequest,
  WeekCountsResponse,
} from "./types";

const client = axios.create({
  baseURL: "/api",
});

export async function fetchTodos(params: TodoListParams): Promise<TodoListResponse> {
  const response = await client.get<TodoListResponse>("/todos", { params });
  return response.data;
}

export async function createTodo(payload: CreateTodoRequest): Promise<Todo> {
  const response = await client.post<Todo>("/todos", payload);
  return response.data;
}

export async function updateTodo(id: number, payload: UpdateTodoRequest): Promise<Todo> {
  const response = await client.patch<Todo>(`/todos/${id}`, payload);
  return response.data;
}

export async function deleteTodo(id: number): Promise<void> {
  await client.delete(`/todos/${id}`);
}

export async function fetchWeekCounts(startDate: string): Promise<Record<string, number>> {
  const response = await client.get<WeekCountsResponse>("/todos/week-counts", {
    params: { startDate },
  });
  return response.data.counts;
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail.length > 0 && typeof detail[0]?.msg === "string") {
      return detail[0].msg;
    }
    return error.message;
  }

  if (error instanceof Error) return error.message;
  return "알 수 없는 오류가 발생했습니다.";
}

