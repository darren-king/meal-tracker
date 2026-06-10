"use client"

import { useState, useTransition } from "react"
import { Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { addFoodItemAction } from "./actions"

interface AddFoodItemFormProps {
  mealId: string
}

export function AddFoodItemForm({ mealId }: AddFoodItemFormProps) {
  const [name, setName] = useState("")
  const [calories, setCalories] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    startTransition(async () => {
      await addFoodItemAction(mealId, {
        name: name.trim(),
        calories: calories ? Number(calories) : undefined,
      })
      setName("")
      setCalories("")
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Add food item</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="food-name">Name</Label>
              <Input
                id="food-name"
                placeholder="e.g. Chicken breast"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                required
              />
            </div>
            <div className="flex w-28 flex-col gap-2">
              <Label htmlFor="food-calories">Calories</Label>
              <Input
                id="food-calories"
                type="number"
                min={1}
                placeholder="kcal"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>
          <Button type="submit" disabled={isPending || !name.trim()} className="self-start">
            <Plus className="mr-2 h-4 w-4" />
            {isPending ? "Adding…" : "Add item"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
