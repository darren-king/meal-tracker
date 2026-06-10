import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MealForm } from "./MealForm"

export default function NewMealPage() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/dashboard"
        className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Log a meal</CardTitle>
        </CardHeader>
        <CardContent>
          <MealForm />
        </CardContent>
      </Card>
    </main>
  )
}
