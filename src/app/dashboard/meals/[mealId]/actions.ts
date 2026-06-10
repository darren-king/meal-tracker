"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs/server"
import { updateMealMeta, addFoodItemToMeal, deleteFoodItem } from "@/data/meals"

const UpdateMealMetaSchema = z.object({
  name: z.string().min(1),
  loggedAt: z.string().min(1),
})

export type UpdateMealMetaInput = z.infer<typeof UpdateMealMetaSchema>

export async function updateMealAction(mealId: string, input: UpdateMealMetaInput) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")
  const parsed = UpdateMealMetaSchema.parse(input)
  await updateMealMeta(userId, mealId, parsed)
  revalidatePath(`/dashboard/meals/${mealId}`)
}

const AddFoodItemSchema = z.object({
  name: z.string().min(1),
  calories: z.number().int().positive().optional(),
})

export type AddFoodItemInput = z.infer<typeof AddFoodItemSchema>

export async function addFoodItemAction(mealId: string, input: AddFoodItemInput) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")
  const parsed = AddFoodItemSchema.parse(input)
  await addFoodItemToMeal(userId, mealId, parsed)
  revalidatePath(`/dashboard/meals/${mealId}`)
}

const DeleteFoodItemSchema = z.object({
  foodItemId: z.string().uuid(),
})

export async function deleteFoodItemAction(mealId: string, foodItemId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")
  DeleteFoodItemSchema.parse({ foodItemId })
  await deleteFoodItem(userId, mealId, foodItemId)
  revalidatePath(`/dashboard/meals/${mealId}`)
}
