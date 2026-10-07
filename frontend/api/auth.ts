import { http } from "@/lib/http";
import {
  loginDraftSchema,
  registerDraftSchema,
  userFullSchema,
  type LoginDraft,
  type RegisterDraft,
  type UserFull,
} from "@/schemas/user";

export async function login(draft: LoginDraft): Promise<UserFull> {
  const payload = loginDraftSchema.parse(draft);
  const data = await http<unknown>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({
      identifier: payload.identifier,
      // Keep legacy key for older backends.
      email: payload.identifier,
      password: payload.password,
      remember: payload.remember,
    }),
  });
  return userFullSchema.parse(data);
}

export async function logout(): Promise<void> {
  await http<unknown>("/api/v1/auth/logout", { method: "POST" });
}

export async function getMe(): Promise<UserFull> {
  const data = await http<unknown>("/api/v1/auth/me");
  return userFullSchema.parse(data);
}

export async function registerUser(draft: RegisterDraft): Promise<UserFull> {
  const payload = registerDraftSchema.parse(draft);
  const data = await http<unknown>("/api/v1/users", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      first_name: payload.first_name,
      last_name: payload.last_name,
    }),
  });
  return userFullSchema.parse(data);
}
