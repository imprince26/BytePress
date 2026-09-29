import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { ImageConvertTool } from "./convert-tool"

export const metadata: Metadata = {
  title: "Convert Image Online - Convert Between JPG, PNG & WEBP",
  description: "Easily convert pictures between JPG, PNG, and WEBP formats with full control over compression quality.",
}

export default function ImageConvertPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader nav={[{ href: "/tools", label: "All Tools" }, { href: "/tools/image-convert", label: "Convert Image" }]} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <ImageConvertTool />
      </div>
    </main>
  )
}

