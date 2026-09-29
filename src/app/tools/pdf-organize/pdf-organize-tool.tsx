"use client"

import { useState, useTransition } from "react"
import {
  ArrowClockwiseIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  FilePdfIcon,
  SquaresFourIcon,
  TrashIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react"
import { PDFDocument } from "pdf-lib"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDropzone } from "@/components/file-dropzone"
import { FileSaveBar } from "@/components/file-save-bar"
import { ToolProcessingState } from "@/components/tool-skeleton"
import { formatBytes } from "@/lib/file-format"
import { organizePdf, type OrganizePdfResult, type PageItem } from "@/lib/pdf-organize"
import { validatePdfFiles } from "@/lib/pdf-tools"

export function PdfOrganizeTool() {
  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState<PageItem[]>([])
  const [result, setResult] = useState<OrganizePdfResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleFileSelect(selectedFiles: FileList | null) {
    setError(null)
    setResult(null)

    const list = Array.from(selectedFiles ?? [])
    if (!list.length) {
      setFile(null)
      setPages([])
      return
    }

    const validationError = validatePdfFiles(list)
    if (validationError) {
      setError(validationError)
      setFile(null)
      setPages([])
      return
    }

    const selectedFile = list[0]
    setFile(selectedFile)

    startTransition(async () => {
      try {
        const arrayBuffer = await selectedFile.arrayBuffer()
        const doc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
        const count = doc.getPageCount()
        const initialPages: PageItem[] = Array.from({ length: count }, (_, idx) => ({
          id: `page-${idx}`,
          originalIndex: idx,
          rotation: 0,
        }))
        setPages(initialPages)
      } catch {
        setError("Failed to load PDF pages. The file might be corrupted.")
      }
    })
  }

  function movePage(index: number, direction: -1 | 1) {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= pages.length) return

    const newPages = [...pages]
    const [moved] = newPages.splice(index, 1)
    newPages.splice(targetIndex, 0, moved)
    setPages(newPages)
    setResult(null)
  }

  function rotatePage(index: number) {
    const newPages = [...pages]
    newPages[index] = {
      ...newPages[index],
      rotation: (newPages[index].rotation + 90) % 360,
    }
    setPages(newPages)
    setResult(null)
  }

  function deletePage(index: number) {
    if (pages.length <= 1) {
      toast.error("You must keep at least one page in the document.")
      return
    }
    const newPages = pages.filter((_, i) => i !== index)
    setPages(newPages)
    setResult(null)
    toast.info("Page removed")
  }

  function handleSaveOrganized() {
    if (!file || !pages.length) {
      setError("Please select a PDF with at least one page.")
      return
    }

    setError(null)
    startTransition(async () => {
      try {
        const organized = await organizePdf({ file, pages })
        setResult(organized)
        toast.success("PDF pages organized successfully!")
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to organize PDF pages.")
      }
    })
  }

  return (
    <section className="space-y-6">
      {/* Tool Header */}
      <div className="space-y-1.5">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Organize PDF Pages
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Rearrange page order, rotate individual sheets, or delete unwanted pages.
        </p>
      </div>

      {/* Main Workspace */}
      <div id="tool-workspace" className="space-y-6">
        <Card className="rounded-xl border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Document Upload</CardTitle>
            <CardDescription className="text-xs">
              Upload a PDF to view and reorder its pages.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileDropzone
              id="pdf-organize-input"
              title={file ? file.name : "Select or drop a PDF file"}
              description={file ? `${formatBytes(file.size)} • ${pages.length} pages` : "PDF files up to 50 MB"}
              accept="application/pdf"
              onFiles={(files) => handleFileSelect(files)}
            />
          </CardContent>
        </Card>

        {/* Visual Pages Grid */}
        {file && pages.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/30 p-3 rounded-lg border border-border">
              <span className="text-xs font-semibold text-foreground">
                {pages.length} Pages Active
              </span>

              <Button
                type="button"
                onClick={handleSaveOrganized}
                disabled={isPending}
                size="sm"
                className="h-8 px-4 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
              >
                <SquaresFourIcon className="size-3.5" weight="bold" />
                <span>{isPending ? "Saving..." : "Apply & Save PDF"}</span>
              </Button>
            </div>

            {isPending && (
              <ToolProcessingState
                title="Reorganizing PDF pages..."
                description="Applying page orders and rotations."
              />
            )}

            {/* Grid of pages */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {pages.map((p, idx) => (
                <div
                  key={p.id}
                  className="flex flex-col items-center rounded-lg border border-border bg-card p-3 shadow-2xs hover:border-primary/50 transition-all"
                >
                  <div className="flex w-full items-center justify-between text-xs font-mono text-muted-foreground mb-2">
                    <span className="font-bold text-foreground">Page {idx + 1}</span>
                    <span className="text-[10px] text-muted-foreground/70">#{p.originalIndex + 1}</span>
                  </div>

                  <div
                    className="relative flex aspect-3/4 w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/20 transition-transform duration-200"
                    style={{ transform: `rotate(${p.rotation}deg)` }}
                  >
                    <FilePdfIcon className="size-9 text-primary/70" weight="duotone" />
                    {p.rotation !== 0 && (
                      <span className="absolute bottom-1 right-1 rounded-sm bg-primary/10 px-1 text-[9px] font-mono font-bold text-primary">
                        {p.rotation}°
                      </span>
                    )}
                  </div>

                  <div className="mt-2.5 flex w-full items-center justify-between gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => movePage(idx, -1)}
                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                      title="Move left"
                    >
                      <ArrowLeftIcon className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => rotatePage(idx)}
                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                      title="Rotate 90°"
                    >
                      <ArrowClockwiseIcon className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePage(idx)}
                      className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      title="Delete page"
                    >
                      <TrashIcon className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === pages.length - 1}
                      onClick={() => movePage(idx, 1)}
                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                      title="Move right"
                    >
                      <ArrowRightIcon className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <WarningCircleIcon className="size-4 shrink-0" weight="fill" />
                <span>{error}</span>
              </div>
            )}

            {result && (
              <div className="pt-2">
                <FileSaveBar
                  fileUrl={result.url}
                  defaultFileName={result.name}
                  fileSize={result.size}
                  originalSize={file.size}
                  mimeType="application/pdf"
                  isPdf={true}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
