"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { updateMealAction } from "./actions"

interface EditMealMetaFormProps {
  mealId: string
  defaultName: string
  defaultLoggedAt: string
}

export function EditMealMetaForm({ mealId, defaultName, defaultLoggedAt }: EditMealMetaFormProps) {
  const [name, setName] = useState(defaultName)
  const [loggedAt, setLoggedAt] = useState(defaultLoggedAt)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(() => {
      updateMealAction(mealId, { name, loggedAt })
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Edit meal details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="meal-name">Name</Label>
            <Input
              id="meal-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="meal-loggedat">Date &amp; time</Label>
            <Input
              id="meal-loggedat"
              type="datetime-local"
              value={loggedAt}
              onChange={(e) => setLoggedAt(e.target.value)}
              disabled={isPending}
              required
            />
          </div>
          <Button type="submit" disabled={isPending} className="self-start">
            {isPending ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
