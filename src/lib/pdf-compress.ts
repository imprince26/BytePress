import { PDFDocument } from "pdf-lib"

export type PdfCompressionLevel = "extreme" | "recommended" | "low"

export interface CompressPdfOptions {
  file: File
  level: PdfCompressionLevel
}

export interface CompressPdfResult {
  blob: Blob
  url: string
  name: string
  originalSize: number
  compressedSize: number
  pages: number
}

/**
 * Multi-strategy PDF compression engine.
 * Combines structural stream optimization, object stream compaction,
 * and high-efficiency downsampling when aggressive compression is desired.
 */
export async function compressPdf(options: CompressPdfOptions): Promise<CompressPdfResult> {
  const { file, level } = options
  const arrayBuffer = await file.arrayBuffer()
  const originalSize = file.size

  // Strategy A: Structural optimization with clean target document
  const sourceDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
    updateMetadata: false,
  })

  const targetDoc = await PDFDocument.create()
  const pageIndices = sourceDoc.getPageIndices()
  const copiedPages = await targetDoc.copyPages(sourceDoc, pageIndices)

  copiedPages.forEach((page) => targetDoc.addPage(page))

  // Level-specific metadata optimization
  if (level === "extreme" || level === "recommended") {
    targetDoc.setTitle("")
    targetDoc.setAuthor("")
    targetDoc.setSubject("")
    targetDoc.setKeywords([])
    targetDoc.setProducer("BytePress Engine")
    targetDoc.setCreator("BytePress Engine")
  }

  // Save with compressed object streams
  const structuralBytes = await targetDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: 50,
    updateFieldAppearances: false,
  })

  let bestBytes = structuralBytes

  // Strategy B: If level is extreme or recommended, try canvas-assisted raster compression if in browser
  if (typeof window !== "undefined" && (level === "extreme" || level === "recommended")) {
    try {
      const pdfjsLib = await import("pdfjs-dist")
      if (pdfjsLib.GlobalWorkerOptions) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`
      }

      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
      })
      const pdf = await loadingTask.promise

      const rasterDoc = await PDFDocument.create()
      const quality = level === "extreme" ? 0.60 : 0.78
      const scale = level === "extreme" ? 1.25 : 1.5

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale })

        const canvas = document.createElement("canvas")
        canvas.width = Math.round(viewport.width)
        canvas.height = Math.round(viewport.height)
        const ctx = canvas.getContext("2d")

        if (ctx) {
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = "high"

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (page.render as any)({
            canvasContext: ctx,
            viewport,
          }).promise

          const pageBlob = await new Promise<Blob>((resolve) =>
            canvas.toBlob((b) => resolve(b!), "image/jpeg", quality)
          )

          if (pageBlob) {
            const pageJpgBytes = await pageBlob.arrayBuffer()
            const embeddedJpg = await rasterDoc.embedJpg(pageJpgBytes)
            const origPage = targetDoc.getPage(i - 1)
            const origSize = origPage.getSize()

            const newPage = rasterDoc.addPage([origSize.width, origSize.height])
            newPage.drawImage(embeddedJpg, {
              x: 0,
              y: 0,
              width: origSize.width,
              height: origSize.height,
            })
          }
        }
      }

      const rasterBytes = await rasterDoc.save({ useObjectStreams: true })

      // Pick the strategy that achieved smaller size
      if (rasterBytes.byteLength < bestBytes.byteLength) {
        bestBytes = rasterBytes
      }
    } catch {
      // Graceful fallback to structural compression if rasterization fails
    }
  }

  const pdfArray = bestBytes.buffer.slice(
    bestBytes.byteOffset,
    bestBytes.byteOffset + bestBytes.byteLength
  ) as ArrayBuffer

  const blob = new Blob([pdfArray], { type: "application/pdf" })
  const url = URL.createObjectURL(blob)
  const baseName = file.name.replace(/\.pdf$/i, "")
  const name = `${baseName}-compressed.pdf`

  return {
    blob,
    url,
    name,
    originalSize,
    compressedSize: blob.size,
    pages: copiedPages.length,
  }
}
