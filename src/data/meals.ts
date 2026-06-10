import { db } from "@/db"
import { meals, foodItems } from "@/db/schema"
import { eq, and, gte, lt } from "drizzle-orm"

export async function getMealById(userId: string, mealId: string) {
  return db.query.meals.findFirst({
    where: and(eq(meals.id, mealId), eq(meals.userId, userId)),
    with: { foodItems: true },
  })
}

export async function updateMeal(
  userId: string,
  mealId: string,
  input: {
    name: string
    loggedAt: string
    foodItems?: { name: string; calories?: number }[]
  }
) {
  await db
    .update(meals)
    .set({ name: input.name, loggedAt: new Date(input.loggedAt), updatedAt: new Date() })
    .where(and(eq(meals.id, mealId), eq(meals.userId, userId)))

  await db.delete(foodItems).where(eq(foodItems.mealId, mealId))

  if (input.foodItems?.length) {
    await db
      .insert(foodItems)
      .values(input.foodItems.map((item) => ({ ...item, mealId })))
  }
}

export async function createMeal(
  userId: string,
  input: {
    name: string
    loggedAt: string
    foodItems?: { name: string; calories?: number }[]
  }
) {
  const [meal] = await db
    .insert(meals)
    .values({ userId, name: input.name, loggedAt: new Date(input.loggedAt) })
    .returning()

  if (input.foodItems?.length) {
    await db
      .insert(foodItems)
      .values(input.foodItems.map((item) => ({ ...item, mealId: meal.id })))
  }

  return meal
}

export async function updateMealMeta(
  userId: string,
  mealId: string,
  input: { name: string; loggedAt: string }
) {
  await db
    .update(meals)
    .set({ name: input.name, loggedAt: new Date(input.loggedAt), updatedAt: new Date() })
    .where(and(eq(meals.id, mealId), eq(meals.userId, userId)))
}

export async function addFoodItemToMeal(
  userId: string,
  mealId: string,
  input: { name: string; calories?: number }
) {
  const meal = await getMealById(userId, mealId)
  if (!meal) throw new Error("Meal not found")
  const [item] = await db.insert(foodItems).values({ mealId, ...input }).returning()
  return item
}

export async function deleteFoodItem(
  userId: string,
  mealId: string,
  foodItemId: string
) {
  const meal = await getMealById(userId, mealId)
  if (!meal) throw new Error("Meal not found")
  await db.delete(foodItems).where(and(eq(foodItems.id, foodItemId), eq(foodItems.mealId, mealId)))
}

export async function getMealsForUser(userId: string, date: Date) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)

  return db.query.meals.findMany({
    where: and(eq(meals.userId, userId), gte(meals.loggedAt, start), lt(meals.loggedAt, end)),
    with: { foodItems: true },
    orderBy: (meals, { asc }) => [asc(meals.loggedAt)],
  })
}
