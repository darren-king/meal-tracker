# Authentication Standards

## Rule: Clerk Only

All authentication in this project **must** use [Clerk](https://clerk.com). No other auth libraries, custom session handling, or hand-rolled JWT logic are permitted.

- Never use NextAuth, Auth.js, Lucia, or any other auth library.
- Never store session state in cookies, localStorage, or a database manually.
- Never implement login, signup, or session management UI from scratch — use Clerk's components or Clerk-hosted pages.

## Middleware

Authentication is enforced globally via `clerkMiddleware` in `src/middleware.ts`. This must remain in place and must not be removed or replaced.

```ts
// src/middleware.ts — correct
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()
```

- Do not add custom session checks in individual pages or layouts — the middleware handles route protection.
- To make a route public (e.g. a landing page), use `createRouteMatcher` inside `clerkMiddleware` to explicitly allow it.

```ts
// Making specific routes public
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/'])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) await auth.protect()
})
```

## Getting the Current User (Server Components)

Retrieve the authenticated user's ID in Server Components using `auth()` from `@clerk/nextjs/server`.

```ts
// src/app/dashboard/page.tsx — correct
import { auth } from "@clerk/nextjs/server"

export default async function DashboardPage() {
  const { userId } = await auth()
  // pass userId into /data helper functions
}
```

- Always `await auth()` — it is async.
- `userId` is `null` when the user is not signed in. Assert it non-null (`userId!`) only inside routes that are protected by middleware; otherwise handle the null case explicitly.
- Never pass the full Clerk `User` object down the component tree — pass only the `userId` string and fetch profile data where needed.

## Getting the Current User (Client Components)

Use the `useAuth` or `useUser` hooks from `@clerk/nextjs` in Client Components.

```tsx
"use client"
import { useAuth } from "@clerk/nextjs"

export function SomeClientComponent() {
  const { userId, isLoaded } = useAuth()
  if (!isLoaded) return null
  // ...
}
```

- Never pass `userId` from a Server Component into a Client Component as a prop to avoid exposing it unnecessarily — Client Components can read it directly via the hook.

## What Is Not Allowed

- Custom session tables or session tokens in the database.
- Calling `auth()` inside a `/data` helper — helpers accept `userId` as a parameter; the page or component is responsible for obtaining it.
- Reading `userId` from URL params, query strings, or request bodies — always derive it server-side from the Clerk session.
- Bypassing Clerk by trusting client-supplied identity in any form.

## Summary

| Concern | Required approach |
|---|---|
| Auth provider | Clerk (`@clerk/nextjs`) |
| Route protection | `clerkMiddleware` in `src/middleware.ts` |
| User ID in Server Components | `const { userId } = await auth()` |
| User ID in Client Components | `useAuth()` hook |
| Passing user ID to data helpers | Parameter — never derived inside the helper |
