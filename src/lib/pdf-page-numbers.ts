import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

export type PageNumberPosition =
  | "bottom-center"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "top-right"
  | "top-left"

export type PageNumberFormat =
  | "page-n-of-total" // "Page 1 of 10"
  | "n-of-total"      // "1 of 10"
  | "page-n"          // "Page 1"
  | "n"               // "1"

export interface AddPageNumbersOptions {
  file: File
  position: PageNumberPosition
  format: PageNumberFormat
  startNumber?: number
  fontSize?: number
  margin?: number
}

export interface AddPageNumbersResult {
  blob: Blob
  url: string
  name: string
  size: number
  pageCount: number
}

/**
 * Inserts formatted page numbers onto every page of a PDF document.
 * Runs 100% locally in browser using pdf-lib.
 */
export async function addPageNumbersToPdf(
  options: AddPageNumbersOptions
): Promise<AddPageNumbersResult> {
  const {
    file,
    position = "bottom-center",
    format = "page-n-of-total",
    startNumber = 1,
    fontSize = 10,
    margin = 30,
  } = options

  const arrayBuffer = await file.arrayBuffer()
  const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const pages = doc.getPages()
  const totalPages = pages.length

  pages.forEach((page, index) => {
    const currentNumber = startNumber + index
    let text = ""

    switch (format) {
      case "page-n-of-total":
        text = `Page ${currentNumber} of ${totalPages}`
        break
      case "n-of-total":
        text = `${currentNumber} / ${totalPages}`
        break
      case "page-n":
        text = `Page ${currentNumber}`
        break
      case "n":
        text = `${currentNumber}`
        break
      default:
        text = `${currentNumber}`
    }

    const { width, height } = page.getSize()
    const textWidth = font.widthOfTextAtSize(text, fontSize)
    const textHeight = font.heightAtSize(fontSize)

    let x = 0
    let y = 0

    // Calculate X coordinate
    if (position.includes("center")) {
      x = (width - textWidth) / 2
    } else if (position.includes("left")) {
      x = margin
    } else if (position.includes("right")) {
      x = width - textWidth - margin
    }

    // Calculate Y coordinate
    if (position.startsWith("bottom")) {
      y = margin
    } else if (position.startsWith("top")) {
      y = height - margin - textHeight
    }

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.2, 0.2, 0.25),
    })
  })

  const outputBytes = await doc.save({ useObjectStreams: true })
  const pdfArray = outputBytes.buffer.slice(
    outputBytes.byteOffset,
    outputBytes.byteOffset + outputBytes.byteLength
  ) as ArrayBuffer

  const blob = new Blob([pdfArray], { type: "application/pdf" })
  const url = URL.createObjectURL(blob)
  const baseName = file.name.replace(/\.pdf$/i, "")
  const name = `${baseName}-numbered.pdf`

  return {
    blob,
    url,
    name,
    size: blob.size,
    pageCount: totalPages,
  }
}
