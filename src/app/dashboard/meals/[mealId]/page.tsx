import { notFound } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { format } from "date-fns"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getMealById } from "@/data/meals"
import { EditMealMetaForm } from "./EditMealMetaForm"
import { FoodItemsList } from "./FoodItemsList"
import { AddFoodItemForm } from "./AddFoodItemForm"

export default async function MealPage({
  params,
}: {
  params: Promise<{ mealId: string }>
}) {
  const { userId } = await auth()
  const { mealId } = await params

  const meal = await getMealById(userId!, mealId)
  if (!meal) notFound()

  const totalCalories = meal.foodItems.reduce((sum, item) => sum + (item.calories ?? 0), 0)
  const loggedAtLocal = format(meal.loggedAt, "yyyy-MM-dd'T'HH:mm")

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/dashboard"
        className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">{meal.name}</h1>
        <p className="text-sm text-muted-foreground">
          {format(meal.loggedAt, "PPp")}
          {totalCalories > 0 && ` · ${totalCalories} kcal`}
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <EditMealMetaForm
          mealId={meal.id}
          defaultName={meal.name}
          defaultLoggedAt={loggedAtLocal}
        />
        <FoodItemsList mealId={meal.id} foodItems={meal.foodItems} />
        <AddFoodItemForm mealId={meal.id} />
      </div>
    </main>
  )
}
