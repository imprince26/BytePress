"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { PaperPlaneTilt } from "@phosphor-icons/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

async function postAuth(path: string, body: Record<string, unknown>) {
  const response = await fetch(`/api/auth${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message ?? data.error ?? "Request failed.")
  return data
}

export function ForgotPasswordForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function sendCode() {
    setMessage(null)

    if (!email.trim()) {
      toast.error("Enter your email address")
      return
    }

    startTransition(async () => {
      try {
        await postAuth("/email-otp/request-password-reset", { email })
        toast.success("Reset code sent")
        router.push(`/reset-password?email=${encodeURIComponent(email)}`)
      } catch (error) {
        const nextMessage = error instanceof Error ? error.message : "Could not send reset code."
        setMessage(nextMessage)
        toast.error(nextMessage)
      }
    })
  }

  return (
    <Card className="overflow-hidden rounded-[2.25rem] border-white/70 bg-white/90 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
      <div className="h-2 bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300" />
      <CardHeader className="p-7 pb-4">
        <CardTitle className="text-3xl font-black tracking-tight">Send reset code</CardTitle>
        <CardDescription>We will send a short code to your account email.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 p-7 pt-0">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" className="mt-2 h-12 rounded-full bg-white px-5" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        {message ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{message}</div> : null}
        <Button className="h-12 w-full rounded-full" disabled={isPending || !email} onClick={sendCode}>
          <PaperPlaneTilt className="size-4" weight="fill" /> Send code
        </Button>
      </CardContent>
    </Card>
  )
}
