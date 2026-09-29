import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { ImageResizeTool } from "./resize-tool"

export const metadata: Metadata = {
  title: "Resize Image Online - Change Image Dimensions in Pixels",
  description: "Scale and resize photos or graphic assets to custom pixel widths and heights with aspect ratio lock.",
}

export default function ImageResizePage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader nav={[{ href: "/tools", label: "All Tools" }, { href: "/tools/image-resize", label: "Resize Image" }]} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <ImageResizeTool />
      </div>
    </main>
  )
}

