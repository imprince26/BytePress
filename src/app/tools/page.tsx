import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { ToolsCatalog } from "./tools-catalog"

export const metadata: Metadata = {
  title: "Online Document Tools - PDF & Image Processing Suite",
  description: "Explore the full suite of PDF and image tools. Compress, combine, split, organize, convert, and protect documents online.",
}

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader nav={[{ href: "/tools", label: "All Tools" }]} />
      <ToolsCatalog />
    </main>
  )
}
