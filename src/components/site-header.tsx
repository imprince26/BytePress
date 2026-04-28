import Link from "next/link"
import { headers } from "next/headers"
import { Stack } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/sign-out-button"
import { auth } from "@/lib/auth"
import { cn } from "@/lib/utils"

type SiteHeaderProps = {
  className?: string
  nav?: { href: string; label: string }[]
  compactActions?: boolean
  hideAuthAction?: boolean
}

async function getCurrentSession() {
  try {
    return await auth.api.getSession({ headers: await headers() })
  } catch {
    return null
  }
}

export async function SiteHeader({
  className,
  nav,
  compactActions = false,
  hideAuthAction = false,
}: SiteHeaderProps) {
  const session = await getCurrentSession()

  return (
    <header
      className={cn(
        "relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-6 lg:px-8",
        className
      )}
    >
      <Link href="/" className="flex items-center gap-3 font-heading text-2xl font-black tracking-[-0.04em] text-slate-950 sm:text-3xl">
        <span className="flex size-12 items-center justify-center rounded-2xl border border-slate-900/10 bg-white/85 shadow-sm backdrop-blur sm:size-13">
          <Stack className="size-6" weight="duotone" />
        </span>
        BytePress
      </Link>

      {nav?.length ? (
        <nav className="hidden items-center gap-8 text-[15px] font-semibold text-slate-700 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-slate-950">
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}

      <div className="flex items-center gap-3">
        {session ? (
          <>
            <Button asChild variant="outline" className="hidden h-11 rounded-full bg-white/75 px-5 text-sm sm:inline-flex">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="hidden h-11 rounded-full bg-white/75 px-5 text-sm lg:inline-flex">
              <Link href="/settings">Settings</Link>
            </Button>
            <SignOutButton />
          </>
        ) : !hideAuthAction ? (
          <Button asChild variant="outline" className="hidden h-11 rounded-full bg-white/75 px-5 text-sm sm:inline-flex">
            <Link href="/login">Sign in</Link>
          </Button>
        ) : null}
        <Button asChild className={cn("h-11 rounded-full px-5 text-sm", compactActions && "hidden sm:inline-flex")}>
          <Link href="/tools">Open tools</Link>
        </Button>
      </div>
    </header>
  )
}
