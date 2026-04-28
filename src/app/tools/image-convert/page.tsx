import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { ImageConvertTool } from "./convert-tool"

export const metadata: Metadata = {
  title: "Image Converter - CompressX",
  description: "Convert images privately in your browser between JPG, PNG, and WEBP.",
}

export default function ImageConvertPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,oklch(0.94_0.07_176.24),transparent_28rem),linear-gradient(135deg,oklch(0.99_0.014_95.277),oklch(0.96_0.026_95.277))] px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SiteHeader className="px-0 lg:px-0" nav={[{ href: "/tools", label: "Tools" }]} />

        <ImageConvertTool />
      </div>
    </main>
  )
}
