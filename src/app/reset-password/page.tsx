import type { Metadata } from "next"
import { Suspense } from "react"

import { SiteHeader } from "@/components/site-header"
import { ResetPasswordForm } from "./reset-password-form"

export const metadata: Metadata = {
  title: "Reset password - CompressX",
  description: "Reset your CompressX password with an email code.",
}

export default function ResetPasswordPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,oklch(0.94_0.07_176.24),transparent_28rem),linear-gradient(135deg,oklch(0.99_0.014_95.277),oklch(0.96_0.026_95.277))]">
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 lg:px-8">
        <SiteHeader className="px-0 lg:px-0" compactActions hideAuthAction nav={[{ href: "/login", label: "Sign in" }]} />
        <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.9fr_0.86fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">New password</p>
            <h1 className="mt-5 max-w-2xl font-heading text-5xl font-black tracking-[-0.055em] text-slate-950 sm:text-6xl">
              Choose a fresh password.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Enter the code from your email and set a new password for your account.
            </p>
          </div>
          <Suspense fallback={null}>
            <ResetPasswordForm />
          </Suspense>
        </section>
      </div>
    </main>
  )
}
