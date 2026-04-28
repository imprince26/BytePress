import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Bell, ClockCounterClockwise, UserCircle } from "@phosphor-icons/react/dist/ssr"

import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth"

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() }).catch(() => null)

  if (!session) redirect("/login")

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,oklch(0.94_0.07_176.24),transparent_30rem),linear-gradient(135deg,oklch(0.99_0.014_95.277),oklch(0.96_0.026_95.277))]">
      <SiteHeader nav={[{ href: "/tools", label: "Tools" }, { href: "/dashboard", label: "Dashboard" }]} />
      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 py-12 lg:px-8">
        <Badge variant="outline" className="rounded-full border-emerald-200 bg-white/75 text-emerald-800">
          Settings
        </Badge>
        <h1 className="mt-5 max-w-3xl font-heading text-4xl font-black tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl">
          Account preferences.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Manage the basics for your BytePress workspace.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <Card className="rounded-[2rem] border-white/70 bg-white/80 shadow-sm backdrop-blur">
            <CardHeader>
              <UserCircle className="size-8 text-slate-500" weight="duotone" />
              <CardTitle>Profile</CardTitle>
              <CardDescription>{session.user.email}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              Signed in as <span className="font-semibold text-slate-950">{session.user.name}</span>.
            </CardContent>
          </Card>
          <Card className="rounded-[2rem] border-white/70 bg-white/80 shadow-sm backdrop-blur">
            <CardHeader>
              <ClockCounterClockwise className="size-8 text-slate-500" weight="duotone" />
              <CardTitle>Recent jobs</CardTitle>
              <CardDescription>Saved only in this browser.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              Dashboard history stays metadata-only and can be cleared anytime.
            </CardContent>
          </Card>
          <Card className="rounded-[2rem] border-white/70 bg-white/80 shadow-sm backdrop-blur">
            <CardHeader>
              <Bell className="size-8 text-slate-500" weight="duotone" />
              <CardTitle>Email</CardTitle>
              <CardDescription>Account codes and reset emails.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-slate-600">
              Email preferences and notifications can be expanded later.
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
