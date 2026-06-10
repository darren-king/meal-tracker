import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { format, parseISO } from "date-fns"
import { Plus, UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getMealsForUser } from "@/data/meals"
import { DatePicker } from "./DatePicker"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { userId } = await auth()
  const { date: dateParam } = await searchParams

  const date = dateParam ? parseISO(dateParam) : new Date()
  const meals = await getMealsForUser(userId!, date)

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Meal Tracker</h1>
        <div className="flex items-center gap-2">
          <DatePicker selected={date} />
          <Button asChild>
            <Link href="/dashboard/meals/new">
              <Plus className="h-4 w-4" />
              Log meal
            </Link>
          </Button>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-sm font-medium text-muted-foreground">
          Meals for {format(date, "EEEE, MMMM d")}
        </h2>

        {meals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <UtensilsCrossed className="mb-3 h-10 w-10" />
              <p className="text-sm">No meals logged for this day.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {meals.map((meal) => {
              const totalCalories = meal.foodItems.reduce(
                (sum, item) => sum + (item.calories ?? 0),
                0
              )
              return (
                <Link key={meal.id} href={`/dashboard/meals/${meal.id}`} className="block">
                <Card className="transition-colors hover:bg-muted/50">
                  <CardHeader className="pb-2 pt-4">
                    <CardTitle className="text-base font-medium">{meal.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{format(meal.loggedAt, "h:mm a")}</span>
                      {totalCalories > 0 && <span>{totalCalories} kcal</span>}
                    </div>
                    {meal.foodItems.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-1">
                        {meal.foodItems.map((item) => (
                          <li key={item.id} className="text-xs text-muted-foreground">
                            {item.name}
                            {item.calories != null && ` (${item.calories} kcal)`}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
