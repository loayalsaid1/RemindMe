# Frontend standards (RemindMe)

Standing instructions for the Next.js App Router client in `frontend/`.
Mechanics, not product facts. Do not invent features. If a file already
violates these contracts, do not copy the violation into new code.

Stack: Next.js App Router, React 19, shadcn (New York, Radix), Tailwind v4,
Zod, TanStack Query, React Hook Form. Flask `/api/v1` is the persistence
edge. Do not add Next route handlers for data.

---

## 1. Transport never lives in UI

Domain API functions return parsed data or throw `ApiError`. Pages and
feature components do not call `fetch`.

```ts
type ServiceResult is backend-only.
Client: Zod parse of the HTTP body is the type boundary.
```

- Empty lists are success (`[]`), not an error.
- Delete success: `undefined` (204 or empty JSON). Do not require the deleted row.
- `http()` is the only fetch helper. Always `credentials: "include"`.
- JSON `Content-Type` only when the body is JSON. Never set it on `FormData`.
- `http<unknown>` then `schema.parse`. The generic is not the type.
- `!ok` → `ApiError` with `status` + `body`. 401 handled in `http()` (redirect
  to `/login` except `/auth/*`). 204 → `undefined`.

## 2. Auth is a cookie, never JS storage

- Access token is an **HttpOnly** `access_token_cookie`. SameSite=Lax.
- Do not store tokens in `localStorage` / sessionStorage / memory for replay.
- Do not `atob` JWTs. Identity comes from `GET /api/v1/auth/me`.
- Login body: `{ email, password, remember }`. `remember: true` → persistent
  cookie (356d). `remember: false` → session cookie.
- Logout: `POST /api/v1/auth/logout` (clears cookie). Then route to `/login`.
- Cookie-gated **server** dashboard layout: `dynamic = "force-dynamic"`,
  `cookies()` + `/auth/me`, `redirect("/login")`. Do not gate only with
  client `useEffect`.

## 3. One error shape on the client

`ApiError.message` is taken from Flask `msg` / `message` / `error` /
`description`. Do not invent a `{ data }` wrapper.

## 4. Feature folders

```
schemas/<resource>.ts     # Zod draft + full, z.infer types
api/<resource>.ts         # http() + parse
hooks/use-<resource>.ts   # React Query
components/<feature>/     # UI
app/.../page.tsx          # one-liner
```

- Kebab-case files, PascalCase exports. No new barrels.
- Pages await `params` / `searchParams` when they are Promises.
- No `app/api` handlers; `/api` is rewritten to Flask.

## 5. Client data stack

```
Zod schema → api module → hooks → feature component → thin page
```

CRUD: `list` GET, `get(id)`, `create` POST, `update` PUT, `delete` DELETE.
Query keys hierarchical: `["auth","me"]`, `["reminders"]`,
`["reminders","mine"]`, `["reminders","public"]`, `["reflections", id]`.
Mutations invalidate the parent key. Toasts in `onSuccess` / `onError`.

## 6. Forms

- `useForm` + `zodResolver`. One form instance per editor.
- Preview / tabs: `form.watch("path")`. No second `useState` copy of the same
  fields.
- Simple auth screens may still use RHF (one instance) + schema.
- Strip UI-only fields in the api module before POST.

## 7. UI / theme

- shadcn New York + Radix only. `cn()` for classes.
- Tailwind v4 tokens live in CSS (`styles/tokens.css`, `styles/theme.css`).
  Surface/gradient modules live in `styles/surfaces.css`.
- Do not dump raw hex in feature components. Use tokens or surface classes.
- Preserve existing hover overlays, glows, and gradients by moving them into
  surface classes — do not flatten them away.
- Dark surface is the product theme (original RemindMe). Honor `data-theme`
  if a host sets it later; do not invent a second palette.

## 8. Do / don’t

**Do:** cookies; `/auth/me`; Zod parse; hierarchical query keys; thin pages;
surface classes for gradients; shadcn primitives.

**Don’t:** `localStorage` tokens; `atob`; `http<T>()` without `.parse`;
`fetch` in pages; second `useForm`; Next `app/api` for persistence;
inline hex when a token exists.
