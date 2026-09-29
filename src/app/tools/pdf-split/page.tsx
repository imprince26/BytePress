import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { PdfSplitTool } from "./pdf-split-tool"

export const metadata: Metadata = {
  title: "Split PDF Online - Extract Pages from PDF",
  description: "Extract specific pages or page ranges from your PDF document. Fast, accurate, and free.",
}

export default function PdfSplitPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader nav={[{ href: "/tools", label: "All Tools" }, { href: "/tools/pdf-split", label: "Split PDF" }]} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <PdfSplitTool />
      </div>
    </main>
  )
}
