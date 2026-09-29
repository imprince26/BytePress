import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { PdfViewerTool } from "./pdf-viewer-tool"

export const metadata: Metadata = {
  title: "Online PDF Viewer - Read and Inspect PDF Files",
  description: "Read, navigate, and inspect PDF documents directly on any device without downloading external software.",
}

export default function PdfViewerPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader nav={[{ href: "/tools", label: "All Tools" }, { href: "/tools/pdf-viewer", label: "PDF Viewer" }]} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <PdfViewerTool />
      </div>
    </main>
  )
}
