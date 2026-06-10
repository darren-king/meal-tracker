"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const MOCK_MEALS = [
  { id: 1, name: "Oatmeal with berries", time: "8:00 AM", calories: 320, type: "Breakfast" },
  { id: 2, name: "Grilled chicken salad", time: "12:30 PM", calories: 480, type: "Lunch" },
  { id: 3, name: "Greek yogurt", time: "3:00 PM", calories: 150, type: "Snack" },
  { id: 4, name: "Salmon with vegetables", time: "7:00 PM", calories: 560, type: "Dinner" },
]

const MEAL_TYPE_VARIANTS: Record<string, "default" | "secondary" | "outline"> = {
  Breakfast: "default",
  Lunch: "secondary",
  Snack: "outline",
  Dinner: "secondary",
}

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [open, setOpen] = useState(false)

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Meal Tracker</h1>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-start gap-2">
              <CalendarIcon className="h-4 w-4 shrink-0" />
              {format(date, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                if (d) {
                  setDate(d)
                  setOpen(false)
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <section>
        <h2 className="mb-4 text-sm font-medium text-muted-foreground">
          Meals for {format(date, "EEEE, MMMM d")}
        </h2>

        {MOCK_MEALS.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <UtensilsCrossed className="mb-3 h-10 w-10" />
              <p className="text-sm">No meals logged for this day.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {MOCK_MEALS.map((meal) => (
              <Card key={meal.id}>
                <CardHeader className="pb-2 pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-medium">{meal.name}</CardTitle>
                    <Badge variant={MEAL_TYPE_VARIANTS[meal.type] ?? "outline"}>
                      {meal.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{meal.time}</span>
                    <span>{meal.calories} kcal</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
