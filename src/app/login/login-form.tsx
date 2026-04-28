"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import { GoogleLogo, ShieldCheck } from "@phosphor-icons/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

type Mode = "sign-in" | "sign-up"
type Step = "details" | "otp"

function getAuthErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    if (error.message === "Failed to fetch") {
      return "Auth service is not reachable. Check your app URL and server env, then try again."
    }

    return error.message
  }

  return fallback
}

async function postAuth(path: string, body: Record<string, unknown>) {
  const response = await fetch(`/api/auth${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message ?? data.error ?? "Request failed.")
  }

  return data
}

export function LoginForm() {
  const [mode, setMode] = useState<Mode>("sign-in")
  const [step, setStep] = useState<Step>("details")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function submit() {
    setMessage(null)

    if (!email.trim()) {
      toast.error("Enter your email address")
      return
    }

    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    if (mode === "sign-up" && !name.trim()) {
      toast.error("Enter your name")
      return
    }

    startTransition(async () => {
      try {
        if (mode === "sign-up") {
          const response = await authClient.signUp.email({ name, email, password })

          if (response.error) {
            setMessage(response.error.message ?? "Could not create account.")
            return
          }

          setStep("otp")
          setMessage("We sent a verification code to your email.")
          toast.success("Verification code sent")
          return
        }

        const response = await authClient.signIn.email({ email, password })

        if (response.error) {
          setMessage(response.error.message ?? "Could not sign in.")
          return
        }

        toast.success("Welcome back")
        window.location.href = "/dashboard"
      } catch (error) {
        const nextMessage = getAuthErrorMessage(error, "Could not complete sign in.")
        setMessage(nextMessage)
        toast.error(nextMessage)
      }
    })
  }

  function verifyOtp() {
    setMessage(null)

    if (otp.length !== 6) {
      toast.error("Enter the 6-digit code")
      return
    }

    startTransition(async () => {
      try {
        await postAuth("/email-otp/verify-email", { email, otp })
        toast.success("Email verified")
        window.location.href = "/dashboard"
      } catch (error) {
        const nextMessage = getAuthErrorMessage(error, "Could not verify this code.")
        setMessage(nextMessage)
        toast.error(nextMessage)
      }
    })
  }

  function continueWithGoogle() {
    setMessage(null)

    startTransition(async () => {
      try {
        const response = await authClient.signIn.social({
          provider: "google",
          callbackURL: "/tools",
        })

        if (response.error) {
          const nextMessage = response.error.message ?? "Google sign in is not available yet."
          setMessage(nextMessage)
          toast.error(nextMessage)
        }
      } catch (error) {
        const nextMessage = getAuthErrorMessage(error, "Google sign in is not available yet.")
        setMessage(nextMessage)
        toast.error(nextMessage)
      }
    })
  }

  return (
    <Card className="overflow-hidden rounded-[2.25rem] border-white/70 bg-white/90 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
      <div className="h-2 bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300" />
      <CardHeader className="p-7 pb-4">
        <CardTitle className="text-3xl font-black tracking-tight">
          {step === "otp" ? "Verify your email" : mode === "sign-in" ? "Welcome back" : "Create account"}
        </CardTitle>
        <CardDescription>
          {step === "otp"
            ? "Enter the 6-digit code we sent to your email."
            : mode === "sign-in"
              ? "Sign in and continue working with your files."
              : "Create an account with your email and password."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 p-7 pt-0">
        {step === "details" ? (
          <>
            <Button variant="outline" className="h-12 w-full rounded-full bg-white" disabled={isPending} onClick={continueWithGoogle}>
              <GoogleLogo className="size-4" weight="bold" /> Continue with Google
            </Button>

            <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
            </div>

            {mode === "sign-up" ? (
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" autoComplete="name" placeholder="Your name" className="mt-2 h-12 rounded-full bg-white px-5" value={name} onChange={(event) => setName(event.target.value)} />
              </div>
            ) : null}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" className="mt-2 h-12 rounded-full bg-white px-5" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete={mode === "sign-in" ? "current-password" : "new-password"} placeholder="Enter password" className="mt-2 h-12 rounded-full bg-white px-5" value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
          </>
        ) : (
          <div>
            <Label htmlFor="otp">Verification code</Label>
            <Input id="otp" inputMode="numeric" autoComplete="one-time-code" placeholder="000000" maxLength={6} className="mt-2 h-14 rounded-full bg-white px-5 text-center font-heading text-2xl font-black tracking-[0.4em]" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} />
          </div>
        )}

        {message ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {message}
          </div>
        ) : null}

        {step === "otp" ? (
          <Button className="h-12 w-full rounded-full" disabled={isPending || otp.length !== 6} onClick={verifyOtp}>
            <ShieldCheck className="size-4" weight="fill" /> Verify and continue
          </Button>
        ) : (
          <Button className="h-12 w-full rounded-full" disabled={isPending} onClick={submit}>
            {isPending ? "Please wait..." : mode === "sign-in" ? "Sign in" : "Create account"}
          </Button>
        )}

        {mode === "sign-in" && step === "details" ? (
          <Link href="/forgot-password" className="block text-center text-sm font-medium text-slate-600 hover:text-slate-950">
            Forgot password?
          </Link>
        ) : null}

        <button
          type="button"
          className="w-full text-center text-sm font-medium text-slate-600 hover:text-slate-950"
          onClick={() => {
            setMessage(null)
            setOtp("")
            setStep("details")
            setMode(mode === "sign-in" ? "sign-up" : "sign-in")
          }}
        >
          {mode === "sign-in" ? "Need an account? Create one" : "Already have an account? Sign in"}
        </button>
      </CardContent>
    </Card>
  )
}
