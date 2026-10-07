export class ApiError extends Error {
  status: number;
  body: unknown;
  path?: string;

  constructor(status: number, body: unknown, fallback = "Request failed") {
    super(messageFromBody(body, fallback, status));
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function messageFromBody(body: unknown, fallback: string, status: number): string {
  if (typeof body === "string" && body.trim()) return body;
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    const candidate =
      record.msg ?? record.message ?? record.error ?? record.description;
    if (typeof candidate === "string" && candidate.trim()) return candidate;
    if (candidate && typeof candidate === "object") {
      return JSON.stringify(candidate);
    }
  }
  return fallback || `Request failed: ${status}`;
}
