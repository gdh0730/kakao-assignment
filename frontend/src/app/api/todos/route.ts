import { proxyToBackend } from "@/lib/backend";

export async function GET(request: Request) {
  const { search } = new URL(request.url);
  return proxyToBackend(`/todos${search}`);
}

export async function POST(request: Request) {
  return proxyToBackend("/todos", {
    method: "POST",
    body: await request.text(),
  });
}

