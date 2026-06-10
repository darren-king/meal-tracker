"use client"

import { useState, useTransition } from "react"
import { Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { deleteFoodItemAction } from "./actions"

interface FoodItem {
  id: string
  name: string
  calories: number | null
}

interface FoodItemsListProps {
  mealId: string
  foodItems: FoodItem[]
}

export function FoodItemsList({ mealId, foodItems }: FoodItemsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDelete(foodItemId: string) {
    setDeletingId(foodItemId)
    startTransition(async () => {
      await deleteFoodItemAction(mealId, foodItemId)
      setDeletingId(null)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Food items</CardTitle>
      </CardHeader>
      <CardContent>
        {foodItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">No food items logged yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {foodItems.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2">
                <span className="text-sm">{item.name}</span>
                <div className="flex items-center gap-2">
                  {item.calories != null && (
                    <Badge variant="secondary">{item.calories} kcal</Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={isPending && deletingId === item.id}
                    onClick={() => handleDelete(item.id)}
                    aria-label={`Delete ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
