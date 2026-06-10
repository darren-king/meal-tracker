# Data Mutation Standards

## Rule: Server Actions Only

All data mutations **must** be performed via Next.js Server Actions. No route handlers (`route.ts` files) may be created for the purpose of mutating data.

- Never use `fetch` or `axios` to call an internal API route to perform a mutation.
- Never mutate data directly inside a Server Component — always delegate to a Server Action.
- Client Components trigger mutations by calling imported Server Actions directly, not via HTTP.

## Rule: Co-located `actions.ts` Files

Server Actions must live in a file named `actions.ts` co-located with the route or feature that uses them.

```
src/app/dashboard/
  page.tsx
  actions.ts      ← server actions for this route
  DatePicker.tsx
```

- A single `actions.ts` may serve all components within its directory.
- Do not create a global `src/actions/` directory — actions are scoped to the feature they belong to.
- Every `actions.ts` file must begin with `"use server"`.

```ts
// src/app/dashboard/actions.ts — correct
"use server"

// ... server action exports
```

## Rule: Explicit TypeScript Parameter Types

All Server Action parameters **must** have explicit TypeScript types.

- Never use `FormData` as a parameter type — actions receive typed plain objects, not form payloads.
- Derive parameter types from Zod schemas (see below) using `z.infer<>` to keep types and validation in sync.

```ts
// WRONG — FormData parameter
export async function logMeal(data: FormData) { ... }

// WRONG — implicit / any type
export async function logMeal(data) { ... }

// CORRECT — explicit typed parameter derived from Zod schema
export async function logMeal(input: LogMealInput) { ... }
```

## Rule: Zod Validation on Every Server Action

Every Server Action **must** validate its arguments with Zod before performing any database operation or business logic.

- Define the Zod schema at the top of the file, above the action.
- Export a `z.infer<>` type derived from the schema and use it as the parameter type.
- Call `.parse()` (throws on failure) or `.safeParse()` (returns a result object) — never skip validation and trust the caller.

```ts
"use server"

import { z } from "zod"
import { auth } from "@clerk/nextjs/server"
import { createMeal } from "@/data/meals"

const LogMealSchema = z.object({
  name: z.string().min(1),
  loggedAt: z.string().datetime(),
  foodItems: z.array(
    z.object({
      name: z.string().min(1),
      calories: z.number().int().positive().optional(),
    })
  ).optional(),
})

type LogMealInput = z.infer<typeof LogMealSchema>

export async function logMeal(input: LogMealInput) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const parsed = LogMealSchema.parse(input)
  return createMeal(userId, parsed)
}
```

## Rule: `/data` Helpers for All Database Calls

Server Actions must **not** contain inline database queries. All Drizzle ORM calls belong in helper functions in `src/data/`.

- A Server Action's responsibility is: authenticate → validate → call a `/data` helper → return.
- Keep Drizzle imports out of `actions.ts` files entirely.

```ts
// src/data/meals.ts — mutation helper
import { db } from "@/db"
import { meals, foodItems } from "@/db/schema"

export async function createMeal(
  userId: string,
  input: { name: string; loggedAt: string; foodItems?: { name: string; calories?: number }[] }
) {
  return db.transaction(async (tx) => {
    const [meal] = await tx.insert(meals).values({
      userId,
      name: input.name,
      loggedAt: new Date(input.loggedAt),
    }).returning()

    if (input.foodItems?.length) {
      await tx.insert(foodItems).values(
        input.foodItems.map((item) => ({ ...item, mealId: meal.id }))
      )
    }

    return meal
  })
}
```

```ts
// WRONG — Drizzle query inside an action
"use server"
import { db } from "@/db"
import { meals } from "@/db/schema"

export async function logMeal(input: LogMealInput) {
  await db.insert(meals).values({ ... }) // ← belongs in src/data/
}
```

## Rule: Always Authenticate Inside the Action

Server Actions must always verify the current user via Clerk before operating on data. Never trust a `userId` passed in from the client.

```ts
export async function deleteMeal(mealId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  // verify ownership before deleting
  await removeMeal(userId, mealId)
}
```

## Summary

| Concern | Required approach |
|---|---|
| Where mutations happen | Server Actions (`"use server"`) |
| Where actions live | Co-located `actions.ts` next to the route |
| Parameter types | Explicit TypeScript types — no `FormData` |
| Input validation | Zod schema, called before any DB operation |
| Database calls | `src/data/` helpers only — no Drizzle in actions |
| Authentication | `auth()` from Clerk, derived server-side — never trust client-supplied identity |
