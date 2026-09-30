"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import {
  FilePdfIcon,
  ScissorsIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react"
import { PDFDocument } from "pdf-lib"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDropzone } from "@/components/file-dropzone"
import { FileSaveBar } from "@/components/file-save-bar"
import { ToolProcessingState } from "@/components/tool-skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatBytes } from "@/lib/file-format"
import { parsePageRanges, validatePdfFiles } from "@/lib/pdf-tools"

type Result = { url: string; name: string; size: number; pages: number }

export function PdfSplitTool() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [range, setRange] = useState("1")
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const resultUrlRef = useRef<string | null>(null)
  const outputRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (result && outputRef.current && window.innerWidth < 1024) {
      outputRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [result])

  useEffect(() => {
    return () => {
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current)
    }
  }, [])

  function chooseFile(nextFile: File | null) {
    setError(null)
    setResult(null)
    setPageCount(null)

    const validationError = validatePdfFiles(nextFile ? [nextFile] : [])
    if (validationError) {
      setFile(null)
      setError(validationError)
      return
    }

    setFile(nextFile)
    if (nextFile) {
      startTransition(async () => {
        try {
          const pdf = await PDFDocument.load(await nextFile.arrayBuffer(), {
            ignoreEncryption: true,
          })
          setPageCount(pdf.getPageCount())
          setRange(`1-${pdf.getPageCount()}`)
        } catch {
          setError("Could not parse this PDF.")
        }
      })
    }
  }

  function splitPdf() {
    if (!file || !pageCount) {
      setError("Please choose a PDF document first.")
      return
    }

    startTransition(async () => {
      try {
        setError(null)
        const selectedPages = parsePageRanges(range, pageCount)

        if (!selectedPages.length) {
          setError("Please specify at least one valid page to extract.")
          return
        }

        const source = await PDFDocument.load(await file.arrayBuffer(), {
          ignoreEncryption: true,
        })
        const output = await PDFDocument.create()
        const copiedPages = await output.copyPages(source, selectedPages)
        copiedPages.forEach((page) => output.addPage(page))

        const bytes = await output.save({ useObjectStreams: true })
        if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current)

        const pdfBytes = bytes.buffer.slice(
          bytes.byteOffset,
          bytes.byteOffset + bytes.byteLength
        ) as ArrayBuffer

        const url = URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }))
        resultUrlRef.current = url

        const baseName = file.name.replace(/\.pdf$/i, "")
        setResult({
          url,
          name: `${baseName}-split.pdf`,
          size: bytes.byteLength,
          pages: copiedPages.length,
        })
        toast.success(`Extracted ${copiedPages.length} pages!`)
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : "Could not split this PDF.")
      }
    })
  }

  return (
    <section className="space-y-6">
      {/* Tool Header */}
      <div className="space-y-1.5">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Split PDF Files
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Extract specific pages or page ranges from your document.
        </p>
      </div>

      <div id="tool-workspace" className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] min-w-0 w-full">
        <Card className="rounded-xl border-border bg-card min-w-0 w-full overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Document & Range</CardTitle>
            <CardDescription className="text-xs">
              Upload a PDF document and specify which pages to extract.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 min-w-0">
            <div className="min-w-0">
              <FileDropzone
                id="pdf-split-input"
                title={file ? file.name : "Select or drop a PDF file"}
                description={file ? `${formatBytes(file.size)} ${pageCount ? `• ${pageCount} pages` : ""}` : "PDF files up to 50 MB"}
                accept="application/pdf"
                onFiles={(files) => chooseFile(files?.[0] ?? null)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs">
                <Label htmlFor="range" className="font-semibold text-foreground">
                  Page Selection
                </Label>
                {pageCount !== null && (
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Total: {pageCount} pages
                  </span>
                )}
              </div>
              <Input
                id="range"
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder="e.g. 1-3, 5, 8-10"
                className="mt-1 h-9 text-xs bg-background font-mono"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Example: <code className="bg-muted px-1 py-0.5 rounded text-[10px]">1-4</code> for consecutive pages, or <code className="bg-muted px-1 py-0.5 rounded text-[10px]">1, 3, 5-7</code> for custom selections.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <WarningCircleIcon className="size-4 shrink-0" weight="fill" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="button"
              onClick={splitPdf}
              disabled={!file || !pageCount || isPending}
              className="h-10 w-full rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <ScissorsIcon className="size-4" weight="bold" />
              <span>{isPending ? "Extracting Pages..." : "Extract Pages"}</span>
            </Button>
          </CardContent>
        </Card>

        {/* Right Column */}
        <Card ref={outputRef} id="output-section" className="rounded-xl border-border bg-card min-w-0 w-full overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Extracted Document</CardTitle>
            <CardDescription className="text-xs">
              Preview and save the extracted pages.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 min-w-0">
            {isPending ? (
              <ToolProcessingState
                title="Extracting pages..."
                description="Creating new document with selected pages."
              />
            ) : result ? (
              <>
                <div className="rounded-lg border border-border bg-muted/20 p-3.5 flex items-center gap-3 min-w-0 w-full">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <FilePdfIcon className="size-5" weight="duotone" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground truncate break-all">{result.name}</p>
                    <p className="text-[11px] text-muted-foreground">{formatBytes(result.size)} • {result.pages} pages</p>
                  </div>
                </div>

                <FileSaveBar
                  fileUrl={result.url}
                  defaultFileName={result.name}
                  fileSize={result.size}
                  originalSize={file ? file.size : undefined}
                  mimeType="application/pdf"
                  isPdf={true}
                />
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                <ScissorsIcon className="size-8 mx-auto mb-2 text-muted-foreground/40" weight="duotone" />
                Specify page numbers and click &quot;Extract Pages&quot; to review the output file.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
