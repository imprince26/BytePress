"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import {
  ArrowsInIcon,
  ArrowsOutIcon,
  FilePdfIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react"
import { PDFDocument } from "pdf-lib"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDropzone } from "@/components/file-dropzone"
import { FileSaveBar } from "@/components/file-save-bar"
import { ToolProcessingState } from "@/components/tool-skeleton"
import { formatBytes } from "@/lib/file-format"
import { validatePdfFiles } from "@/lib/pdf-tools"

export function PdfViewerTool() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const urlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    }
  }, [])

  function handleFileSelect(selectedFiles: FileList | null) {
    setError(null)
    setPageCount(null)

    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current)
      urlRef.current = null
    }

    const list = Array.from(selectedFiles ?? [])
    if (!list.length) {
      setFile(null)
      setPdfUrl(null)
      return
    }

    const validationError = validatePdfFiles(list)
    if (validationError) {
      setError(validationError)
      setFile(null)
      setPdfUrl(null)
      return
    }

    const selectedFile = list[0]
    setFile(selectedFile)

    const url = URL.createObjectURL(selectedFile)
    urlRef.current = url
    setPdfUrl(url)

    startTransition(async () => {
      try {
        const doc = await PDFDocument.load(await selectedFile.arrayBuffer(), {
          ignoreEncryption: true,
        })
        setPageCount(doc.getPageCount())
      } catch {
        setError("Could not parse page count for this PDF.")
      }
    })
  }

  return (
    <section className="space-y-6">
      {/* Tool Header */}
      <div className="space-y-1.5">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          PDF Viewer
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Open, zoom, and inspect PDF files directly with page navigation.
        </p>
      </div>

      <div id="tool-workspace" className="space-y-6">
        <Card className="rounded-xl border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Document Upload</CardTitle>
            <CardDescription className="text-xs">
              Upload a PDF document to read and inspect.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileDropzone
              id="pdf-viewer-input"
              title={file ? file.name : "Select or drop a PDF file"}
              description={file ? `${formatBytes(file.size)} ${pageCount ? `• ${pageCount} pages` : ""}` : "PDF files up to 50 MB"}
              accept="application/pdf"
              onFiles={(files) => handleFileSelect(files)}
            />

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <WarningCircleIcon className="size-4 shrink-0" weight="fill" />
                <span>{error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {isPending && (
          <ToolProcessingState
            title="Loading PDF..."
            description="Preparing document display."
          />
        )}

        {/* PDF Viewer Interface */}
        {pdfUrl && file && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/30 p-3 rounded-lg border border-border">
              <div className="flex items-center gap-2.5">
                <FilePdfIcon className="size-5 text-primary shrink-0" weight="duotone" />
                <div>
                  <p className="text-xs font-semibold text-foreground truncate max-w-xs sm:max-w-md">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {formatBytes(file.size)} {pageCount !== null && `• ${pageCount} pages`}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="h-8 gap-1 text-xs"
              >
                {isFullscreen ? <ArrowsInIcon className="size-3.5" /> : <ArrowsOutIcon className="size-3.5" />}
                <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
              </Button>
            </div>

            <div
              className={`rounded-xl border border-border bg-slate-900/10 dark:bg-black/40 overflow-hidden transition-all ${
                isFullscreen
                  ? "fixed inset-0 z-50 rounded-none h-full bg-background"
                  : "w-full h-[650px] sm:h-[750px]"
              }`}
            >
              {isFullscreen && (
                <div className="flex items-center justify-between p-3 border-b border-border bg-background">
                  <span className="text-xs font-semibold text-foreground truncate">{file.name}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsFullscreen(false)}
                    className="h-7 text-xs"
                  >
                    Close
                  </Button>
                </div>
              )}
              <object
                data={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                type="application/pdf"
                className="w-full h-full border-none"
              >
                <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
                  <FilePdfIcon className="size-16 text-primary mb-3" weight="duotone" />
                  <p className="text-sm font-semibold text-foreground">
                    PDF Viewer preview not available in this frame.
                  </p>
                  <p className="text-xs max-w-sm mt-1 mb-4">
                    You can open the document in a new tab to view it with your browser native reader.
                  </p>
                  <Button asChild size="sm">
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                      Open PDF in New Tab
                    </a>
                  </Button>
                </div>
              </object>
            </div>

            <FileSaveBar
              fileUrl={pdfUrl}
              defaultFileName={file.name}
              fileSize={file.size}
              mimeType="application/pdf"
              isPdf={true}
            />
          </div>
        )}
      </div>
    </section>
  )
}
