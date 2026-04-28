import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Sign in - BytePress",
  description: "Sign in to BytePress and continue using your file tools.",
}

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,oklch(0.94_0.07_176.24),transparent_28rem),radial-gradient(circle_at_bottom_right,oklch(0.93_0.08_78),transparent_26rem),linear-gradient(135deg,oklch(0.99_0.014_95.277),oklch(0.96_0.026_95.277))]">
      <div className="absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-white/60 blur-3xl" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 lg:px-8">
        <SiteHeader
          className="px-0 lg:px-0"
          compactActions
          hideAuthAction
          nav={[{ href: "/tools", label: "Tools" }]}
        />

        <section className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[0.9fr_0.86fr] lg:py-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Account access
            </p>
            <h1 className="mt-5 max-w-2xl font-heading text-5xl font-black tracking-[-0.055em] text-slate-950 sm:text-6xl">
              Continue with more room to work.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Sign in to keep using tools, manage access, and make the workspace feel personal.
            </p>
            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
              {['More daily tasks', 'Saved preferences'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/70 bg-white/70 p-4 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <LoginForm />
        </section>
      </div>
    </main>
  )
}
