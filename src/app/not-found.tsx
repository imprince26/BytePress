import Link from "next/link"
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
          <MagnifyingGlass className="size-7" weight="duotone" />
        </div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          Page Not Found
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-sm">
          The tool or page you are looking for does not exist or has been relocated.
        </p>
        <div className="mt-6">
          <Button asChild size="sm">
            <Link href="/tools">Browse All Tools</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
