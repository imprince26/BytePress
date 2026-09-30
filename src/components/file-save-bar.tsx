"use client"

import { useState } from "react"
import {
  CheckCircleIcon,
  DownloadSimpleIcon,
  EyeIcon,
  FolderOpenIcon,
  ArrowClockwiseIcon,
} from "@phosphor-icons/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatBytes } from "@/lib/file-format"
import { isFileSystemAccessSupported, saveFileWithPicker, triggerStandardDownload } from "@/lib/file-save"
import { PdfViewerModal } from "./pdf-viewer-modal"

interface FileSaveBarProps {
  fileUrl: string
  defaultFileName: string
  fileSize: number
  originalSize?: number
  mimeType?: string
  isPdf?: boolean
  className?: string
}

export function FileSaveBar({
  fileUrl,
  defaultFileName,
  fileSize,
  originalSize,
  mimeType,
  isPdf = false,
  className = "",
}: FileSaveBarProps) {
  const [customName, setCustomName] = useState(defaultFileName)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  function getEffectiveFileName(): string {
    const trimmed = customName.trim()
    if (!trimmed) return defaultFileName

    const defaultExt = defaultFileName.includes(".")
      ? defaultFileName.split(".").pop()
      : ""

    if (defaultExt && !trimmed.toLowerCase().endsWith(`.${defaultExt.toLowerCase()}`)) {
      return `${trimmed}.${defaultExt}`
    }

    return trimmed
  }

  async function handleSaveToFolder() {
    const effectiveName = getEffectiveFileName()
    setIsSaving(true)
    try {
      const saved = await saveFileWithPicker({
        url: fileUrl,
        suggestedName: effectiveName,
        mimeType: mimeType || (isPdf ? "application/pdf" : undefined),
      })

      if (saved) {
        toast.success(`Saved "${effectiveName}"`)
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save file")
    } finally {
      setIsSaving(false)
    }
  }

  function handleQuickDownload() {
    const effectiveName = getEffectiveFileName()
    triggerStandardDownload(fileUrl, effectiveName)
    toast.success(`Downloaded "${effectiveName}"`)
  }

  function resetName() {
    setCustomName(defaultFileName)
  }

  const hasSavings = originalSize !== undefined && originalSize > fileSize
  const savingsPercent = hasSavings ? Math.round((1 - fileSize / originalSize) * 100) : 0

  return (
    <>
      <div
        className={`rounded-xl border border-border bg-muted/30 p-4 space-y-3.5 w-full min-w-0 max-w-full overflow-hidden ${className}`}
      >
        {/* Status & Stats header */}
        <div className="flex flex-wrap items-center justify-between gap-2 min-w-0 w-full">
          <div className="flex items-center gap-1.5 min-w-0 shrink-0">
            <CheckCircleIcon className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" weight="fill" />
            <span className="text-xs font-semibold text-foreground truncate">
              Ready to download
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {originalSize && (
              <span className="text-muted-foreground line-through text-[11px] sm:text-xs">
                {formatBytes(originalSize)}
              </span>
            )}
            <span className="font-semibold text-foreground font-mono text-[11px] sm:text-xs">
              {formatBytes(fileSize)}
            </span>
            {hasSavings && (
              <span className="rounded-md bg-emerald-600/10 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                Saved {savingsPercent}%
              </span>
            )}
          </div>
        </div>

        {/* File name customization */}
        <div className="space-y-1 min-w-0 w-full">
          <div className="flex items-center justify-between text-xs min-w-0">
            <label htmlFor="download-file-name" className="text-muted-foreground text-[11px]">
              File name:
            </label>
            {customName !== defaultFileName && (
              <button
                type="button"
                onClick={resetName}
                className="flex items-center gap-1 text-[11px] text-primary hover:underline shrink-0"
              >
                <ArrowClockwiseIcon className="size-3" /> Reset
              </button>
            )}
          </div>
          <Input
            id="download-file-name"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="h-8 text-xs bg-background font-mono w-full min-w-0 truncate"
            placeholder="File name"
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 w-full min-w-0">
          {/* Verify & Preview button for PDFs */}
          {isPdf && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewOpen(true)}
              className="h-9 flex-1 min-w-[95px] text-xs font-semibold gap-1.5"
            >
              <EyeIcon className="size-3.5 text-primary" weight="duotone" />
              <span>Preview</span>
            </Button>
          )}

          {/* Save to Folder picker */}
          {isFileSystemAccessSupported() && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSaveToFolder}
              disabled={isSaving}
              className="h-9 flex-1 min-w-[95px] text-xs font-semibold gap-1.5"
            >
              <FolderOpenIcon className="size-3.5 text-primary" weight="duotone" />
              <span>Save As...</span>
            </Button>
          )}

          {/* Download button */}
          <Button
            type="button"
            size="sm"
            onClick={handleQuickDownload}
            className="h-9 flex-1 min-w-[95px] text-xs font-semibold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <DownloadSimpleIcon className="size-3.5" weight="bold" />
            <span>Download</span>
          </Button>
        </div>
      </div>

      {/* PDF Verification Modal */}
      {isPdf && (
        <PdfViewerModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          pdfUrl={fileUrl}
          fileName={getEffectiveFileName()}
          fileSize={fileSize}
        />
      )}
    </>
  )
}
