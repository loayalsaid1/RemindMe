import { cookies } from "next/headers";
import { userFullSchema, type UserFull } from "@/schemas/user";

const backend = process.env.API_PROXY_TARGET ?? "http://localhost:5001";

export async function getServerSession(): Promise<UserFull | null> {
  const jar = await cookies();
  const token = jar.get("access_token_cookie")?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${backend}/api/v1/auth/me`, {
      headers: {
        Cookie: `access_token_cookie=${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    return userFullSchema.parse(data);
  } catch {
    return null;
  }
}
