import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRight, FilePdf, Gear, ImageSquare, Sparkle } from "@phosphor-icons/react/dist/ssr"

import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { RecentJobs } from "./recent-jobs"

const quickActions = [
  { title: "Compress image", href: "/tools/image-compress", icon: ImageSquare },
  { title: "Convert image", href: "/tools/image-convert", icon: Sparkle },
  { title: "Merge PDF", href: "/tools/pdf-merge", icon: FilePdf },
  { title: "Settings", href: "/settings", icon: Gear },
]

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null)

  if (!session) {
    redirect("/login")
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,oklch(0.94_0.07_176.24),transparent_30rem),linear-gradient(135deg,oklch(0.99_0.014_95.277),oklch(0.96_0.026_95.277))]">
      <SiteHeader nav={[{ href: "/tools", label: "Tools" }]} />
      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-12 lg:px-8">
        <Badge variant="outline" className="rounded-full border-emerald-200 bg-white/75 text-emerald-800">
          Dashboard
        </Badge>
        <h1 className="mt-5 max-w-4xl font-heading text-4xl font-black tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl">
          Welcome back, {session.user.name?.split(" ")[0] ?? "there"}.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Jump into your most useful tools and keep your file work moving.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Card className="rounded-[2rem] border-white/70 bg-white/80 shadow-sm backdrop-blur">
            <CardHeader>
              <CardTitle>Daily usage</CardTitle>
              <CardDescription>Your account limit is ready for more work.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="font-heading text-5xl font-black text-slate-950">25</div>
              <p className="mt-2 text-sm text-slate-500">tasks available per day</p>
            </CardContent>
          </Card>
          <Card className="rounded-[2rem] border-white/70 bg-white/80 shadow-sm backdrop-blur md:col-span-2">
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Start with a common task.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link key={action.href} href={action.href} className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
                    <Icon className="size-6 text-slate-500" weight="duotone" />
                    <div className="mt-4 flex items-center justify-between gap-3 font-semibold text-slate-950">
                      {action.title} <ArrowRight className="size-4" />
                    </div>
                  </Link>
                )
              })}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 rounded-[2rem] border border-white/70 bg-slate-950 p-8 text-white shadow-2xl shadow-slate-900/20">
          <h2 className="font-heading text-3xl font-black tracking-tight">More account features are coming next.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            The next dashboard improvements will add metadata-only recent jobs, saved preferences, and personal limits.
          </p>
          <Button asChild className="mt-6 rounded-full bg-white text-slate-950 hover:bg-slate-100">
            <Link href="/tools">Browse tools</Link>
          </Button>
        </div>

        <div className="mt-6">
          <RecentJobs />
        </div>
      </section>
    </main>
  )
}
