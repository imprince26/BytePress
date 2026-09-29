import type { Metadata } from "next"

import { PdfMergeTool } from "./pdf-merge-tool"

export const metadata: Metadata = {
  title: "Merge PDF Files Online - Combine Multiple PDFs",
  description: "Combine multiple PDF documents into a single organized file in any order. Fast, secure, and easy to use.",
}

export default function PdfMergePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PdfMergeTool />
    </div>
  )
}
