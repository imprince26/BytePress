import Link from "next/link"
import { CpuIcon, LightningIcon } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SiteHeaderProps {
  className?: string
}

export function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 sm:py-5 lg:px-8",
        className
      )}
    >
      {/* Brand logo */}
      <Link
        href="/"
        className="group flex items-center gap-2.5 font-heading text-xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-90 sm:text-2xl"
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-transform group-hover:scale-105">
          <CpuIcon className="size-5" weight="bold" />
        </span>
        <span>BytePress</span>
      </Link>

      {/* Header action */}
      <div className="flex items-center gap-2.5">
        <Button
          asChild
          size="sm"
          className="h-9 px-4 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg"
        >
          <Link href="/tools">
            <LightningIcon className="size-3.5" weight="fill" />
            <span>Open Tools</span>
          </Link>
        </Button>
      </div>
    </header>
  )
}
