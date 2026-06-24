function getBackendBaseUrl(): string {
  const baseUrl = process.env.BACKEND_API_URL;

  if (!baseUrl) {
    throw new Error("BACKEND_API_URL is not configured");
  }

  return baseUrl.replace(/\/+$/, "");
}

export async function proxyToBackend(path: string, init: RequestInit = {}): Promise<Response> {
  try {
    const response = await fetch(`${getBackendBaseUrl()}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
      cache: "no-store",
    });
    const body = await response.text();
    const contentType = response.headers.get("content-type") ?? "application/json";

    return new Response(body || null, {
      status: response.status,
      headers: body ? { "Content-Type": contentType } : undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to reach backend API";
    const status = message.includes("BACKEND_API_URL") ? 500 : 502;

    return Response.json({ detail: message }, { status });
  }
}

