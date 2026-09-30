"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      richColors
      closeButton
      position="top-right"
      className="toaster group"
      toastOptions={{
        className: "max-w-[calc(100vw-2rem)]",
        classNames: {
          toast:
            "border border-slate-200 bg-white/95 text-slate-950 shadow-xl shadow-slate-900/10 backdrop-blur max-w-[calc(100vw-2rem)] break-all",
          title: "font-heading font-black tracking-tight",
          description: "text-slate-600 break-all",
          actionButton: "bg-slate-950 text-white shrink-0",
          cancelButton: "bg-slate-100 text-slate-950 shrink-0",
        },
      }}
    />
  )
}
