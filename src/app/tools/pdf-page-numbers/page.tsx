import type { Metadata } from "next"

import { PdfPageNumbersTool } from "./pdf-page-numbers-tool"

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF Online",
  description: "Stamp customized page numbers onto your PDF documents with custom formatting and position options.",
}

export default function PdfPageNumbersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PdfPageNumbersTool />
    </div>
  )
}
