import type { Metadata } from "next"

import { PdfSplitTool } from "./pdf-split-tool"

export const metadata: Metadata = {
  title: "Split PDF Online - Extract Pages from PDF",
  description: "Extract specific pages or page ranges from your PDF document. Fast, accurate, and free.",
}

export default function PdfSplitPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PdfSplitTool />
    </div>
  )
}
