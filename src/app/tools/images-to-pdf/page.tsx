import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { ImagesToPdfTool } from "./images-to-pdf-tool"

export const metadata: Metadata = {
  title: "Convert Images to PDF - Combine JPG, PNG & WEBP into PDF",
  description: "Merge multiple images into a single professional PDF document. Reorder pages and customize layout.",
}

export default function ImagesToPdfPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader nav={[{ href: "/tools", label: "All Tools" }, { href: "/tools/images-to-pdf", label: "Images to PDF" }]} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <ImagesToPdfTool />
      </div>
    </main>
  )
}

