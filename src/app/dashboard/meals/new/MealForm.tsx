"use client"

import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createMealAction } from "./actions"

const schema = z.object({
  name: z.string().min(1, "Meal name is required"),
  loggedAt: z.string().min(1, "Date and time is required"),
  foodItems: z.array(
    z.object({
      name: z.string().min(1, "Required"),
      calories: z.string().optional(),
    })
  ),
})

type FormValues = z.infer<typeof schema>

function toLocalDatetimeValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  )
}

export function MealForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      loggedAt: toLocalDatetimeValue(new Date()),
      foodItems: [],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: "foodItems" })

  async function onSubmit(values: FormValues) {
    await createMealAction({
      name: values.name,
      loggedAt: new Date(values.loggedAt).toISOString(),
      foodItems: values.foodItems
        .filter((item) => item.name.trim())
        .map((item) => ({
          name: item.name,
          calories: item.calories ? parseInt(item.calories, 10) : undefined,
        })),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Meal name</Label>
        <Input id="name" placeholder="e.g. Breakfast" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="loggedAt">Date &amp; time</Label>
        <Input id="loggedAt" type="datetime-local" {...register("loggedAt")} />
        {errors.loggedAt && (
          <p className="text-sm text-destructive">{errors.loggedAt.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label>Food items</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ name: "", calories: "" })}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add item
          </Button>
        </div>

        {fields.length === 0 && (
          <p className="text-sm text-muted-foreground">No food items added yet.</p>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <div className="flex flex-1 flex-col gap-1">
              <Input
                placeholder="Food name"
                {...register(`foodItems.${index}.name`)}
              />
              {errors.foodItems?.[index]?.name && (
                <p className="text-xs text-destructive">
                  {errors.foodItems[index].name?.message}
                </p>
              )}
            </div>
            <Input
              className="w-28"
              placeholder="kcal"
              type="number"
              min={1}
              {...register(`foodItems.${index}.calories`)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        ))}
      </div>

      <Button type="submit" disabled={isSubmitting} className="self-end">
        {isSubmitting ? "Saving…" : "Save meal"}
      </Button>
    </form>
  )
}
