"use client"

import { useState, useTransition } from "react"
import { EnvelopeSimple, GoogleLogo } from "@phosphor-icons/react"

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

function getAuthErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    if (error.message === "Failed to fetch") {
      return "Auth service is not reachable. Check the app URL and server env, then try again."
    }

    return error.message
  }

  return fallback
}

export function LoginForm() {
  const [mode, setMode] = useState<Mode>("sign-in")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [magicSent, setMagicSent] = useState(false)
  const [isPending, startTransition] = useTransition()

  function submit() {
    setMessage(null)
    setMagicSent(false)

    startTransition(async () => {
      try {
        if (mode === "sign-up") {
          const response = await authClient.signUp.email({
            name,
            email,
            password,
          })

          if (response.error) {
            setMessage(response.error.message ?? "Could not create account.")
            return
          }

          window.location.href = "/tools"
          return
        }

        const response = await authClient.signIn.email({
          email,
          password,
        })

        if (response.error) {
          setMessage(response.error.message ?? "Could not sign in.")
          return
        }

        window.location.href = "/tools"
      } catch (error) {
        setMessage(getAuthErrorMessage(error, "Could not complete sign in."))
      }
    })
  }

  function continueWithGoogle() {
    setMessage(null)
    setMagicSent(false)

    startTransition(async () => {
      try {
        const response = await authClient.signIn.social({
          provider: "google",
          callbackURL: "/tools",
        })

        if (response.error) {
          setMessage(response.error.message ?? "Google sign in is not available yet.")
        }
      } catch (error) {
        setMessage(getAuthErrorMessage(error, "Google sign in is not available yet."))
      }
    })
  }

  function sendMagicLink() {
    setMessage(null)
    setMagicSent(false)

    startTransition(async () => {
      try {
        const response = await authClient.signIn.magicLink({
          email,
          callbackURL: "/tools",
        })

        if (response.error) {
          setMessage(response.error.message ?? "Could not send sign-in link.")
          return
        }

        setMagicSent(true)
      } catch (error) {
        setMessage(getAuthErrorMessage(error, "Could not send sign-in link."))
      }
    })
  }

  return (
    <Card className="overflow-hidden rounded-[2.25rem] border-white/70 bg-white/90 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
      <div className="h-2 bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300" />
      <CardHeader className="p-7 pb-4">
        <CardTitle className="text-3xl font-black tracking-tight">{mode === "sign-in" ? "Welcome back" : "Create account"}</CardTitle>
        <CardDescription>
          {mode === "sign-in"
            ? "Sign in and continue working with your files."
            : "Create an account to keep using CompressX."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 p-7 pt-0">
        <Button variant="outline" className="h-12 w-full rounded-full bg-white" disabled={isPending} onClick={continueWithGoogle}>
          <GoogleLogo className="size-4" weight="bold" /> Continue with Google
        </Button>

        <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
          <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
        </div>

        {mode === "sign-up" ? (
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              autoComplete="name"
              placeholder="Your name"
              className="mt-2 h-12 rounded-full bg-white px-5"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
        ) : null}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="mt-2 h-12 rounded-full bg-white px-5"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
            placeholder="Enter password"
            className="mt-2 h-12 rounded-full bg-white px-5"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {message ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {message}
          </div>
        ) : null}

        {magicSent ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            Check your email for the sign-in link.
          </div>
        ) : null}

        <Button className="h-12 w-full rounded-full" disabled={isPending} onClick={submit}>
          {isPending ? "Please wait..." : mode === "sign-in" ? "Sign in" : "Create account"}
        </Button>

        {mode === "sign-in" ? (
          <Button variant="outline" className="h-12 w-full rounded-full bg-white" disabled={isPending || !email} onClick={sendMagicLink}>
            <EnvelopeSimple className="size-4" /> Email me a sign-in link
          </Button>
        ) : null}

        <button
          type="button"
          className="w-full text-center text-sm font-medium text-slate-600 hover:text-slate-950"
          onClick={() => {
            setMessage(null)
            setMode(mode === "sign-in" ? "sign-up" : "sign-in")
          }}
        >
          {mode === "sign-in"
            ? "Need an account? Create one"
            : "Already have an account? Sign in"}
        </button>
      </CardContent>
    </Card>
  )
}
