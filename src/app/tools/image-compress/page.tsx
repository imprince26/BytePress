import type { Metadata } from "next"

import { ImageCompressor } from "./image-compressor"

export const metadata: Metadata = {
  title: "Compress Images Online - Reduce JPG, PNG & WEBP File Size",
  description: "Compress photos and digital graphics without visible quality loss. Choose compression quality or target KB sizes.",
}

export default function ImageCompressPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ImageCompressor />
    </div>
  )
}
