"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      richColors
      closeButton
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "border border-slate-200 bg-white/95 text-slate-950 shadow-xl shadow-slate-900/10 backdrop-blur",
          title: "font-heading font-black tracking-tight",
          description: "text-slate-600",
          actionButton: "bg-slate-950 text-white",
          cancelButton: "bg-slate-100 text-slate-950",
        },
      }}
    />
  )
}
