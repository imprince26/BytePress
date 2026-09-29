import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { ImageCompressor } from "./image-compressor"

export const metadata: Metadata = {
  title: "Compress Images Online - Reduce JPG, PNG & WEBP File Size",
  description: "Compress photos and digital graphics without visible quality loss. Choose compression quality or target KB sizes.",
}

export default function ImageCompressPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader nav={[{ href: "/tools", label: "All Tools" }, { href: "/tools/image-compress", label: "Compress Image" }]} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <ImageCompressor />
      </div>
    </main>
  )
}

