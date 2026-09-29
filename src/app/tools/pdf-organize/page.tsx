import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { PdfOrganizeTool } from "./pdf-organize-tool"

export const metadata: Metadata = {
  title: "Organize PDF Pages - Rearrange, Rotate & Delete",
  description: "Rearrange the page sequence of your PDF, rotate individual pages, or delete unnecessary pages easily.",
}

export default function PdfOrganizePage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader nav={[{ href: "/tools", label: "All Tools" }, { href: "/tools/pdf-organize", label: "Organize PDF" }]} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <PdfOrganizeTool />
      </div>
    </main>
  )
}
