import { PDFDocument } from "pdf-lib"
import { encryptPDF } from "@pdfsmaller/pdf-encrypt"

export interface ProtectPdfOptions {
  file: File
  password: string
  confirmPassword?: string
  preventCopy?: boolean
  preventPrint?: boolean
  preventModify?: boolean
}

export interface ProtectPdfResult {
  blob: Blob
  url: string
  name: string
  size: number
  pageCount: number
}

/**
 * Protects a PDF document with standard AES-256 password encryption.
 * When opened by any PDF reader, the document will require the password.
 */
export async function protectPdf(options: ProtectPdfOptions): Promise<ProtectPdfResult> {
  const { file, password } = options

  if (!password || password.trim().length < 3) {
    throw new Error("Please enter a password with at least 3 characters.")
  }

  const arrayBuffer = await file.arrayBuffer()
  const rawBytes = new Uint8Array(arrayBuffer)

  // Verify and count pages
  const doc = await PDFDocument.load(rawBytes, { ignoreEncryption: true })
  const pageCount = doc.getPageCount()

  // Save clean bytes with pdf-lib first
  const cleanBytes = await doc.save({ useObjectStreams: true })

  // Encrypt with AES-256
  const encryptedBytes = await encryptPDF(cleanBytes, password, {
    algorithm: "AES-256",
    ownerPassword: password,
  })

  const pdfArray = encryptedBytes.buffer.slice(
    encryptedBytes.byteOffset,
    encryptedBytes.byteOffset + encryptedBytes.byteLength
  ) as ArrayBuffer

  const blob = new Blob([pdfArray], { type: "application/pdf" })
  const url = URL.createObjectURL(blob)
  const baseName = file.name.replace(/\.pdf$/i, "")
  const name = `${baseName}-protected.pdf`

  return {
    blob,
    url,
    name,
    size: blob.size,
    pageCount,
  }
}
