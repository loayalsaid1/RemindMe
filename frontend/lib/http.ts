import { ApiError } from "@/lib/api-error";

const API_PREFIX = "";

export async function http<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  const body = options.body;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_PREFIX}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload: unknown = isJson
    ? await res.json().catch(() => undefined)
    : await res.text().catch(() => undefined);

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      const onAuthPage = window.location.pathname.startsWith("/login")
        || window.location.pathname.startsWith("/register");
      if (!onAuthPage) {
        window.location.assign("/login");
      }
    }
    throw new ApiError(res.status, payload, `Request failed: ${res.status}`);
  }

  if (!isJson) {
    return undefined as T;
  }
  return payload as T;
}
