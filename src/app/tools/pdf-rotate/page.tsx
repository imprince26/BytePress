import type { Metadata } from "next"

import { PdfRotateTool } from "./pdf-rotate-tool"

export const metadata: Metadata = {
  title: "Rotate PDF Pages Online - Orient and Save Documents",
  description: "Quickly rotate PDF pages 90, 180, or 270 degrees. Fix inverted documents and preview results instantly.",
}

export default function PdfRotatePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PdfRotateTool />
    </div>
  )
}
