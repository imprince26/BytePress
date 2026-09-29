import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { PdfPageNumbersTool } from "./pdf-page-numbers-tool"

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF Online",
  description: "Stamp customized page numbers onto your PDF documents with custom formatting and position options.",
}

export default function PdfPageNumbersPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader nav={[{ href: "/tools", label: "All Tools" }, { href: "/tools/pdf-page-numbers", label: "Page Numbers" }]} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <PdfPageNumbersTool />
      </div>
    </main>
  )
}
