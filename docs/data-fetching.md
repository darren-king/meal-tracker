# Data Fetching Standards

## Rule: Server Components Only

All data fetching **must** be done via React Server Components. Route handlers must never be created for the purpose of fetching data within this app.

- Never create a `route.ts` file under `src/app/api/` to serve data to client components.
- Never use `fetch`, `axios`, or any HTTP client inside a component to call an internal API route for data.
- Data must flow from the database → `/data` helper function → Server Component → (optional) Client Component as props.

## Rule: `/data` Directory for All Queries

Database queries must always be performed via helper functions inside the `/data` directory (`src/data/`).

- Never write database queries inline inside a component or page.
- Each helper function is responsible for one well-scoped query or operation.
- Helper functions must use **Drizzle ORM** — raw SQL is strictly forbidden.

```ts
// src/data/meals.ts — correct
import { db } from "@/db"
import { meals } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getMealsForUser(userId: string) {
  return db.select().from(meals).where(eq(meals.userId, userId))
}
```

```ts
// WRONG — raw SQL
const result = await db.execute(sql`SELECT * FROM meals WHERE user_id = ${userId}`)

// WRONG — query inside a component
const data = await db.select().from(meals).where(eq(meals.userId, userId))
```

## Rule: Users May Only Access Their Own Data

Every query that returns user-specific data **must** filter by the authenticated user's ID.

- Always retrieve the current user's ID from the session inside the Server Component, then pass it into the `/data` helper.
- Helper functions must accept `userId` as a parameter and include it in every `WHERE` clause — never return all rows and filter in application code.
- Never rely on the client to supply the user ID — always derive it server-side from the session.

```ts
// src/app/dashboard/page.tsx — correct
import { auth } from "@/auth"
import { getMealsForUser } from "@/data/meals"

export default async function DashboardPage() {
  const session = await auth()
  const meals = await getMealsForUser(session.user.id)
  // ...
}
```

```ts
// WRONG — no user scoping
export async function getAllMeals() {
  return db.select().from(meals) // returns every user's meals
}
```

## Summary

| Concern | Required approach |
|---|---|
| Where to fetch data | Server Components only |
| Where queries live | `src/data/` helper functions |
| ORM | Drizzle ORM — no raw SQL |
| Data access control | Always filter by authenticated `userId` |
