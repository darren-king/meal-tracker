"use server"

import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { createMeal } from "@/data/meals"

const CreateMealSchema = z.object({
  name: z.string().min(1, "Meal name is required"),
  loggedAt: z.string().min(1, "Date and time is required"),
  foodItems: z
    .array(
      z.object({
        name: z.string().min(1, "Food item name is required"),
        calories: z.number().int().positive().optional(),
      })
    )
    .optional(),
})

export type CreateMealInput = z.infer<typeof CreateMealSchema>

export async function createMealAction(input: CreateMealInput) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const parsed = CreateMealSchema.parse(input)
  await createMeal(userId, parsed)
  redirect("/dashboard")
}
