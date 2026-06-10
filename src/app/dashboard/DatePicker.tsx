"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DatePicker({ selected }: { selected: Date }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-start gap-2">
          <CalendarIcon className="h-4 w-4 shrink-0" />
          {format(selected, "PPP")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d) => {
            if (d) {
              router.push(`/dashboard?date=${format(d, "yyyy-MM-dd")}`)
              setOpen(false)
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
