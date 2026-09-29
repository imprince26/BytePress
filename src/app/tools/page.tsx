import type { Metadata } from "next"

import { ToolsCatalog } from "./tools-catalog"

export const metadata: Metadata = {
  title: "Online Document Tools - PDF & Image Processing Suite",
  description: "Explore the full suite of PDF and image tools. Compress, combine, split, organize, convert, and protect documents online.",
}

export default function ToolsPage() {
  return (
    <div className="bg-background">
      <ToolsCatalog />
    </div>
  )
}
