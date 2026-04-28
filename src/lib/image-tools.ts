export type OutputFormat = "image/jpeg" | "image/webp" | "image/png"

export const maxImageUploadBytes = 50 * 1024 * 1024

export { formatBytes } from "@/lib/file-format"

export function outputName(name: string, suffix: string, format: OutputFormat) {
  const extension = format === "image/jpeg" ? "jpg" : format.split("/")[1]
  const base = name.replace(/\.[^.]+$/, "")

  return `${base}-${suffix}.${extension}`
}

export function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Could not read this image."))
    }
    image.src = url
  })
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: OutputFormat,
  quality: number
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not create image output."))
          return
        }

        resolve(blob)
      },
      format,
      quality
    )
  })
}

export async function renderImageToCanvas(
  file: File,
  width?: number,
  height?: number
) {
  const image = await loadImage(file)
  const canvas = document.createElement("canvas")
  canvas.width = Math.max(1, Math.round(width ?? image.naturalWidth))
  canvas.height = Math.max(1, Math.round(height ?? image.naturalHeight))

  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("Your browser could not create an image canvas.")
  }

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = "high"
  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  return {
    canvas,
    originalWidth: image.naturalWidth,
    originalHeight: image.naturalHeight,
  }
}
