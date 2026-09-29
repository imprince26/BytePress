import type { Metadata } from "next"

import { ImageConvertTool } from "./convert-tool"

export const metadata: Metadata = {
  title: "Convert Image Online - Convert Between JPG, PNG & WEBP",
  description: "Easily convert pictures between JPG, PNG, and WEBP formats with full control over compression quality.",
}

export default function ImageConvertPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ImageConvertTool />
    </div>
  )
}
