import { notFound } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { format } from "date-fns"
import { getMealById } from "@/data/meals"
import { EditMealForm } from "./EditMealForm"

export default async function EditMealPage({
  params,
}: {
  params: Promise<{ mealId: string }>
}) {
  const { userId } = await auth()
  const { mealId } = await params

  const meal = await getMealById(userId!, mealId)
  if (!meal) notFound()

  const loggedAtLocal = format(meal.loggedAt, "yyyy-MM-dd'T'HH:mm")

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Edit meal</h1>
      <EditMealForm
        mealId={meal.id}
        defaultName={meal.name}
        defaultLoggedAt={loggedAtLocal}
        defaultFoodItems={meal.foodItems}
      />
    </main>
  )
}
