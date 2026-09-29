/**
 * Utility for saving files with custom names and user-selected folder locations
 * via the native File System Access API (showSaveFilePicker), with seamless fallback.
 */

export interface SaveFileOptions {
  blob?: Blob
  url?: string
  suggestedName: string
  mimeType?: string
}

export function isFileSystemAccessSupported(): boolean {
  if (typeof window === "undefined") return false
  return typeof (window as unknown as { showSaveFilePicker?: unknown }).showSaveFilePicker === "function"
}

export async function saveFileWithPicker(options: SaveFileOptions): Promise<boolean> {
  const { suggestedName, mimeType } = options
  let blob = options.blob

  if (!blob && options.url) {
    try {
      const res = await fetch(options.url)
      blob = await res.blob()
    } catch {
      throw new Error("Unable to read processed file data.")
    }
  }

  if (!blob) {
    throw new Error("No file content provided to save.")
  }

  const effectiveMimeType = mimeType || blob.type || "application/octet-stream"

  // Check if browser supports File System Access API showSaveFilePicker
  if (isFileSystemAccessSupported()) {
    try {
      const ext = suggestedName.includes(".") ? `.${suggestedName.split(".").pop()}` : ""
      const typeAccept: Record<string, string[]> = {}
      if (ext) {
        typeAccept[effectiveMimeType] = [ext]
      } else {
        typeAccept[effectiveMimeType] = []
      }

      const picker = (window as unknown as {
        showSaveFilePicker: (options: {
          suggestedName: string
          types?: { description: string; accept: Record<string, string[]> }[]
        }) => Promise<FileSystemFileHandle>
      }).showSaveFilePicker

      const fileHandle = await picker({
        suggestedName,
        types: [
          {
            description: "Saved File",
            accept: typeAccept,
          },
        ],
      })

      const writableStream = await fileHandle.createWritable()
      await writableStream.write(blob)
      await writableStream.close()
      return true
    } catch (err: unknown) {
      // If user canceled the picker dialog, do not trigger fallback
      if (err instanceof Error && err.name === "AbortError") {
        return false
      }
      // If failed for any other reason, fall back to anchor download
      console.warn("Save picker failed, falling back to standard download:", err)
    }
  }

  // Fallback: standard browser download with custom file name
  triggerStandardDownload(blob, suggestedName)
  return true
}

export function triggerStandardDownload(blobOrUrl: Blob | string, fileName: string): void {
  const url = typeof blobOrUrl === "string" ? blobOrUrl : URL.createObjectURL(blobOrUrl)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = fileName
  anchor.rel = "noopener noreferrer"
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)

  if (typeof blobOrUrl !== "string") {
    setTimeout(() => URL.revokeObjectURL(url), 4000)
  }
}
