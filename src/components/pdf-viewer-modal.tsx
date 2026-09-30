"use client"

import { useState } from "react"
import {
  ArrowsOutIcon,
  ArrowsInIcon,
  DownloadSimpleIcon,
  FolderOpenIcon,
  FilePdfIcon,
  XIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { formatBytes } from "@/lib/file-format"
import { isFileSystemAccessSupported, saveFileWithPicker, triggerStandardDownload } from "@/lib/file-save"
import { toast } from "sonner"

interface PdfViewerModalProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string | null
  fileName: string
  fileSize?: number
}

export function PdfViewerModal({
  isOpen,
  onClose,
  pdfUrl,
  fileName,
  fileSize,
}: PdfViewerModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  if (!isOpen || !pdfUrl) return null

  async function handleSaveToFolder() {
    setIsSaving(true)
    try {
      const saved = await saveFileWithPicker({
        url: pdfUrl!,
        suggestedName: fileName,
        mimeType: "application/pdf",
      })
      if (saved) {
        toast.success(`Saved "${fileName}" to selected folder`)
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not save file")
    } finally {
      setIsSaving(false)
    }
  }

  function handleQuickDownload() {
    triggerStandardDownload(pdfUrl!, fileName)
    toast.success(`Downloaded "${fileName}"`)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
    >
      <div
        className={`flex flex-col w-full bg-background border border-border shadow-2xl transition-all rounded-xl overflow-hidden ${
          isFullscreen
            ? "fixed inset-0 rounded-none z-50 h-full"
            : "max-w-5xl h-[92vh] max-h-225"
        }`}
      >
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <FilePdfIcon className="size-5" weight="duotone" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold truncate break-all text-foreground" title={fileName}>{fileName}</p>
              </div>
              {fileSize !== undefined && (
                <p className="text-xs text-muted-foreground">{formatBytes(fileSize)}</p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {isFileSystemAccessSupported() && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveToFolder}
                disabled={isSaving}
                className="h-8 gap-1.5 text-xs font-medium"
              >
                <FolderOpenIcon className="size-4 text-primary" weight="duotone" />
                <span className="hidden sm:inline">Save As...</span>
              </Button>
            )}

            <Button
              size="sm"
              onClick={handleQuickDownload}
              className="h-8 gap-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <DownloadSimpleIcon className="size-4" weight="bold" />
              <span>Download</span>
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="size-8 text-muted-foreground hover:text-foreground"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <ArrowsInIcon className="size-4" />
              ) : (
                <ArrowsOutIcon className="size-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="size-8 text-muted-foreground hover:text-foreground"
              title="Close Preview"
            >
              <XIcon className="size-4" />
            </Button>
          </div>
        </div>

        {/* PDF viewer frame */}
        <div className="relative flex-1 w-full bg-slate-900/10 dark:bg-black/40 overflow-hidden">
          <object
            data={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            type="application/pdf"
            className="w-full h-full border-none"
          >
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
              <FilePdfIcon className="size-16 text-primary mb-3" weight="duotone" />
              <p className="text-base font-semibold text-foreground">
                Preview not directly embeddable in this browser window.
              </p>
              <p className="text-xs max-w-sm mt-1 mb-4">
                You can open the document in a new tab or download it directly to view all pages.
              </p>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                    Open in New Tab
                  </a>
                </Button>
                <Button size="sm" onClick={handleQuickDownload}>
                  Download Document
                </Button>
              </div>
            </div>
          </object>
        </div>
      </div>
    </div>
  )
}
