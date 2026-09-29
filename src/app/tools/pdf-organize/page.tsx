import type { Metadata } from "next"

import { PdfOrganizeTool } from "./pdf-organize-tool"

export const metadata: Metadata = {
  title: "Organize PDF Pages - Rearrange, Rotate & Delete",
  description: "Rearrange the page sequence of your PDF, rotate individual pages, or delete unnecessary pages easily.",
}

export default function PdfOrganizePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PdfOrganizeTool />
    </div>
  )
}
