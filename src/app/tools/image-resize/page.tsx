import type { Metadata } from "next"

import { ImageResizeTool } from "./resize-tool"

export const metadata: Metadata = {
  title: "Resize Image Online - Change Image Dimensions in Pixels",
  description: "Scale and resize photos or graphic assets to custom pixel widths and heights with aspect ratio lock.",
}

export default function ImageResizePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ImageResizeTool />
    </div>
  )
}
