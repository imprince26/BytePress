"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowClockwise, WarningCircle } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("App Error Boundary caught:", error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
        <WarningCircle className="size-7" weight="duotone" />
      </div>
      <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
        Something went wrong
      </h2>
      <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md">
        {error.message || "An unexpected error occurred while processing your request."}
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button onClick={() => reset()} size="sm" className="gap-1.5 text-xs font-semibold">
          <ArrowClockwise className="size-3.5" /> Try again
        </Button>
        <Button asChild variant="outline" size="sm" className="text-xs font-semibold">
          <Link href="/tools">Go to Tools</Link>
        </Button>
      </div>
    </div>
  )
}
