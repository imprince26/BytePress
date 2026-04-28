"use client"

import { useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"

export function SignOutButton() {
  const [isPending, startTransition] = useTransition()

  function signOut() {
    startTransition(async () => {
      try {
        await authClient.signOut()
        toast.success("Signed out")
        window.location.href = "/"
      } catch {
        toast.error("Could not sign out. Try again.")
      }
    })
  }

  return (
    <Button
      variant="outline"
      className="hidden h-11 rounded-full bg-white/75 px-5 text-sm sm:inline-flex"
      disabled={isPending}
      onClick={signOut}
    >
      Sign out
    </Button>
  )
}
