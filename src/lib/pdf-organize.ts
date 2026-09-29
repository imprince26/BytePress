import { degrees, PDFDocument } from "pdf-lib"

export interface PageItem {
  id: string
  originalIndex: number
  rotation: number
}

export interface OrganizePdfOptions {
  file: File
  pages: PageItem[] // Contains the final order, rotations, and excluded pages are omitted
}

export interface OrganizePdfResult {
  blob: Blob
  url: string
  name: string
  size: number
  pageCount: number
}

/**
 * Reorders, rotates, and deletes pages from a PDF.
 * Executes 100% in-browser using pdf-lib.
 */
export async function organizePdf(options: OrganizePdfOptions): Promise<OrganizePdfResult> {
  const { file, pages } = options

  if (!pages.length) {
    throw new Error("Cannot create an empty PDF. Please keep at least one page.")
  }

  const arrayBuffer = await file.arrayBuffer()
  const sourceDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
  const targetDoc = await PDFDocument.create()

  // Copy pages in the new specified order
  for (let i = 0; i < pages.length; i++) {
    const pageItem = pages[i]
    const [copiedPage] = await targetDoc.copyPages(sourceDoc, [pageItem.originalIndex])

    // Apply any rotation offset (in 90 degree increments)
    if (pageItem.rotation !== 0) {
      const currentRotation = copiedPage.getRotation().angle
      copiedPage.setRotation(degrees((currentRotation + pageItem.rotation) % 360))
    }

    targetDoc.addPage(copiedPage)
  }

  const outputBytes = await targetDoc.save({ useObjectStreams: true })
  const pdfArray = outputBytes.buffer.slice(
    outputBytes.byteOffset,
    outputBytes.byteOffset + outputBytes.byteLength
  ) as ArrayBuffer

  const blob = new Blob([pdfArray], { type: "application/pdf" })
  const url = URL.createObjectURL(blob)
  const baseName = file.name.replace(/\.pdf$/i, "")
  const name = `${baseName}-organized.pdf`

  return {
    blob,
    url,
    name,
    size: blob.size,
    pageCount: pages.length,
  }
}
