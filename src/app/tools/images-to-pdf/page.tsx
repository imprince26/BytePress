import type { Metadata } from "next"

import { ImagesToPdfTool } from "./images-to-pdf-tool"

export const metadata: Metadata = {
  title: "Convert Images to PDF - Combine JPG, PNG & WEBP into PDF",
  description: "Merge multiple images into a single professional PDF document. Reorder pages and customize layout.",
}

export default function ImagesToPdfPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ImagesToPdfTool />
    </div>
  )
}
