import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { ImagesToPdfTool } from "./images-to-pdf-tool"

export const metadata: Metadata = {
  title: "Images to PDF - BytePress",
  description: "Convert one or more images into a PDF file.",
}

export default function ImagesToPdfPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,oklch(0.94_0.07_176.24),transparent_28rem),linear-gradient(135deg,oklch(0.99_0.014_95.277),oklch(0.96_0.026_95.277))] px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SiteHeader className="px-0 lg:px-0" nav={[{ href: "/tools", label: "Tools" }]} />
        <ImagesToPdfTool />
      </div>
    </main>
  )
}
