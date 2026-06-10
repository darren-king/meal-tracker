"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { updateMealAction } from "./actions"

type FoodItemField = {
  id?: string
  name: string
  calories: string
}

type Props = {
  mealId: string
  defaultName: string
  defaultLoggedAt: string
  defaultFoodItems: { id: string; name: string; calories: number | null }[]
}

export function EditMealForm({ mealId, defaultName, defaultLoggedAt, defaultFoodItems }: Props) {
  const [name, setName] = useState(defaultName)
  const [loggedAt, setLoggedAt] = useState(defaultLoggedAt)
  const [foodItems, setFoodItems] = useState<FoodItemField[]>(
    defaultFoodItems.map((item) => ({
      id: item.id,
      name: item.name,
      calories: item.calories != null ? String(item.calories) : "",
    }))
  )
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function addFoodItem() {
    setFoodItems((prev) => [...prev, { name: "", calories: "" }])
  }

  function removeFoodItem(index: number) {
    setFoodItems((prev) => prev.filter((_, i) => i !== index))
  }

  function updateFoodItem(index: number, field: keyof FoodItemField, value: string) {
    setFoodItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      await updateMealAction(mealId, {
        name,
        loggedAt,
        foodItems: foodItems
          .filter((item) => item.name.trim())
          .map((item) => ({
            name: item.name.trim(),
            calories: item.calories ? Number(item.calories) : undefined,
          })),
      })
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Meal name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="loggedAt">Date &amp; time</Label>
        <Input
          id="loggedAt"
          type="datetime-local"
          value={loggedAt}
          onChange={(e) => setLoggedAt(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Food items</span>
          <Button type="button" variant="outline" size="sm" onClick={addFoodItem}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add item
          </Button>
        </div>

        {foodItems.length > 0 && (
          <Card>
            <CardContent className="flex flex-col gap-3 pt-4 pb-4">
              {foodItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Item name"
                    value={item.name}
                    onChange={(e) => updateFoodItem(index, "name", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="kcal"
                    type="number"
                    min={1}
                    value={item.calories}
                    onChange={(e) => updateFoodItem(index, "calories", e.target.value)}
                    className="w-24"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFoodItem(index)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
