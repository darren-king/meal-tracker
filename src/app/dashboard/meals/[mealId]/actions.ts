"use server"

import { z } from "zod"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { updateMeal } from "@/data/meals"

const UpdateMealSchema = z.object({
  name: z.string().min(1),
  loggedAt: z.string().min(1),
  foodItems: z
    .array(
      z.object({
        name: z.string().min(1),
        calories: z.number().int().positive().optional(),
      })
    )
    .optional(),
})

type UpdateMealInput = z.infer<typeof UpdateMealSchema>

export async function updateMealAction(mealId: string, input: UpdateMealInput) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const parsed = UpdateMealSchema.parse(input)
  await updateMeal(userId, mealId, parsed)

  redirect("/dashboard")
}
