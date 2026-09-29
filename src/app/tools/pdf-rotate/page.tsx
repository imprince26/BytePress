import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { PdfRotateTool } from "./pdf-rotate-tool"

export const metadata: Metadata = {
  title: "Rotate PDF Pages Online - Orient and Save Documents",
  description: "Quickly rotate PDF pages 90, 180, or 270 degrees. Fix inverted documents and preview results instantly.",
}

export default function PdfRotatePage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader nav={[{ href: "/tools", label: "All Tools" }, { href: "/tools/pdf-rotate", label: "Rotate PDF" }]} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <PdfRotateTool />
      </div>
    </main>
  )
}

