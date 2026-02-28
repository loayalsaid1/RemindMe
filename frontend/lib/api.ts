const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function authHeaders(extra: Record<string, string> = {}): HeadersInit {
  const token = getToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  // Handle empty responses (e.g., 204 No Content)
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return undefined as unknown as T;
  }
  return res.json() as Promise<T>;
}

// ---------- Auth ----------

export interface LoginResponse {
  access_token: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>("/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

// ---------- Users ----------

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  img_url: string | null;
  description: string | null;
  current_streak: { days: number };
  longest_streak: { days: number };
}

export async function registerUser(data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}): Promise<User> {
  return request<User>("/api/v1/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function getUser(userId: string): Promise<User> {
  return request<User>(`/api/v1/users/${userId}`, {
    headers: authHeaders(),
  });
}

export async function updateUser(
  userId: string,
  data: Partial<Pick<User, "first_name" | "last_name" | "description" | "img_url">>
): Promise<User> {
  return request<User>(`/api/v1/users/${userId}`, {
    method: "PUT",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function checkUsername(username: string): Promise<{ exists: boolean }> {
  return request<{ exists: boolean }>(`/api/v1/check_user/${username}`);
}

// ---------- Reminders ----------

export interface Reminder {
  id: string;
  user_id: string;
  text: string | null;
  caption: string | null;
  is_text: boolean;
  public: boolean;
  img_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function getPublicReminders(): Promise<Reminder[]> {
  return request<Reminder[]>("/api/v1/reminders");
}

export async function getPublicReminder(id: string): Promise<Reminder> {
  return request<Reminder>(`/api/v1/reminders/${id}`);
}

export async function getUserReminders(userId: string): Promise<Reminder[]> {
  return request<Reminder[]>(`/api/v1/users/${userId}/reminders`, {
    headers: authHeaders(),
  });
}

export async function createReminder(data: FormData | {
  text?: string;
  caption?: string;
  is_text: boolean;
  public: boolean;
}): Promise<Reminder> {
  if (data instanceof FormData) {
    return request<Reminder>("/api/v1/reminders", {
      method: "POST",
      headers: authHeaders(),
      body: data,
    });
  }
  return request<Reminder>("/api/v1/reminders", {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateReminder(
  id: string,
  data: Partial<Pick<Reminder, "text" | "caption" | "public">>
): Promise<Reminder> {
  return request<Reminder>(`/api/v1/reminders/${id}`, {
    method: "PUT",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteReminder(id: string): Promise<void> {
  return request<void>(`/api/v1/reminders/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

// ---------- Reflections ----------

export interface Reflection {
  id: string;
  user_id: string;
  reminder_id: string;
  content: string;
  updated_at: string;
  user_full_name: string;
  username: string;
  user_img_url: string | null;
}

export async function getReflections(reminderId: string): Promise<Reflection[]> {
  return request<Reflection[]>(`/api/v1/reminders/${reminderId}/reflections`, {
    headers: authHeaders(),
  });
}

export async function createReflection(
  reminderId: string,
  content: string
): Promise<Reflection> {
  return request<Reflection>(`/api/v1/reminders/${reminderId}/reflections`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
}

export async function deleteReflection(id: string): Promise<void> {
  return request<void>(`/api/v1/reflections/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}
