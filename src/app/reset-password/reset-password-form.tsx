"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ShieldCheck } from "@phosphor-icons/react"
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

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState(searchParams.get("email") ?? "")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function resetPassword() {
    setMessage(null)

    if (!email.trim()) {
      toast.error("Enter your email address")
      return
    }

    if (otp.length !== 6) {
      toast.error("Enter the 6-digit code")
      return
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    startTransition(async () => {
      try {
        await postAuth("/email-otp/reset-password", { email, otp, password })
        toast.success("Password reset complete")
        router.push("/login")
      } catch (error) {
        const nextMessage = error instanceof Error ? error.message : "Could not reset password."
        setMessage(nextMessage)
        toast.error(nextMessage)
      }
    })
  }

  return (
    <Card className="overflow-hidden rounded-[2.25rem] border-white/70 bg-white/90 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
      <div className="h-2 bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300" />
      <CardHeader className="p-7 pb-4">
        <CardTitle className="text-3xl font-black tracking-tight">Reset password</CardTitle>
        <CardDescription>Use your email code to set a new password.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 p-7 pt-0">
        <div><Label htmlFor="email">Email</Label><Input id="email" type="email" className="mt-2 h-12 rounded-full bg-white px-5" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
        <div><Label htmlFor="otp">Code</Label><Input id="otp" inputMode="numeric" maxLength={6} placeholder="000000" className="mt-2 h-14 rounded-full bg-white px-5 text-center font-heading text-2xl font-black tracking-[0.4em]" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} /></div>
        <div><Label htmlFor="password">New password</Label><Input id="password" type="password" autoComplete="new-password" className="mt-2 h-12 rounded-full bg-white px-5" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
        {message ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{message}</div> : null}
        <Button className="h-12 w-full rounded-full" disabled={isPending || otp.length !== 6 || !email || !password} onClick={resetPassword}>
          <ShieldCheck className="size-4" weight="fill" /> Reset password
        </Button>
      </CardContent>
    </Card>
  )
}
