import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { PdfCompressTool } from "./pdf-compress-tool"

export const metadata: Metadata = {
  title: "Compress PDF Online - Reduce PDF File Size",
  description: "Reduce the file size of your PDF documents with customizable compression levels. Simple, fast, and secure.",
}

export default function PdfCompressPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader nav={[{ href: "/tools", label: "All Tools" }, { href: "/tools/pdf-compress", label: "Compress PDF" }]} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <PdfCompressTool />
      </div>
    </main>
  )
}
