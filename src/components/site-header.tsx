import Link from "next/link"
import { Cpu, Lightning } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SiteHeaderProps {
  className?: string
  compactActions?: boolean
  nav?: { href: string; label: string }[]
}

export function SiteHeader({ className, compactActions = false, nav }: SiteHeaderProps) {
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
          <Cpu className="size-5" weight="bold" />
        </span>
        <span>BytePress</span>
      </Link>

      {/* Primary navigation */}
      <nav className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:flex">
        {nav && nav.length > 0 ? (
          nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))
        ) : (
          <>
            <Link href="/tools" className="transition-colors hover:text-foreground">
              All Tools
            </Link>
          
            <Link href="/#workflow" className="transition-colors hover:text-foreground">
              Workflow
            </Link>
          </>
        )}
      </nav>

      {/* Header action */}
      <div className="flex items-center gap-2.5">
        <Button
          asChild
          size="sm"
          className={cn(
            "h-9 px-4 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg",
            compactActions && "hidden sm:inline-flex"
          )}
        >
          <Link href="/tools">
            <Lightning className="size-3.5" weight="fill" />
            <span>Open Tools</span>
          </Link>
        </Button>
      </div>
    </header>
  )
}
