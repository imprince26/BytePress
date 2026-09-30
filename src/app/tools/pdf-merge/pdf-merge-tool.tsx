"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  FilePdfIcon,
  FilesIcon,
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
import { validatePdfFiles } from "@/lib/pdf-tools"

type Result = { url: string; name: string; size: number; pages: number }

export function PdfMergeTool() {
  const [files, setFiles] = useState<File[]>([])
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const resultUrlRef = useRef<string | null>(null)
  const filesRef = useRef<File[]>([])
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

  function chooseFiles(nextFiles: FileList | null) {
    const selected = Array.from(nextFiles ?? [])
    if (!selected.length) return

    const validationError = validatePdfFiles(selected)
    setResult(null)
    setError(validationError)
    if (validationError) return

    const nextOrderedFiles = [...filesRef.current, ...selected]
    filesRef.current = nextOrderedFiles
    setFiles(nextOrderedFiles)
  }

  function removeFile(index: number) {
    const nextFiles = filesRef.current.filter((_, fileIndex) => fileIndex !== index)
    filesRef.current = nextFiles
    setFiles(nextFiles)
    setResult(null)
  }

  function moveFile(index: number, direction: -1 | 1) {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= filesRef.current.length) return

    const nextFiles = [...filesRef.current]
    const [file] = nextFiles.splice(index, 1)
    nextFiles.splice(nextIndex, 0, file)
    filesRef.current = nextFiles
    setFiles(nextFiles)
    setResult(null)
  }

  function mergePdfs() {
    if (files.length < 2) {
      setError("Please select at least two PDF documents to merge.")
      return
    }

    startTransition(async () => {
      try {
        setError(null)
        const merged = await PDFDocument.create()
        let pageTotal = 0

        for (const file of files) {
          const source = await PDFDocument.load(await file.arrayBuffer(), {
            ignoreEncryption: true,
          })
          const copiedPages = await merged.copyPages(source, source.getPageIndices())
          copiedPages.forEach((page) => merged.addPage(page))
          pageTotal += copiedPages.length
        }

        const bytes = await merged.save({ useObjectStreams: true })
        if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current)

        const pdfBytes = bytes.buffer.slice(
          bytes.byteOffset,
          bytes.byteOffset + bytes.byteLength
        ) as ArrayBuffer

        const url = URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }))
        resultUrlRef.current = url

        setResult({
          url,
          name: "merged-document.pdf",
          size: bytes.byteLength,
          pages: pageTotal,
        })
        toast.success(`Merged ${files.length} PDFs!`)
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Could not merge the selected PDF files."
        )
      }
    })
  }

  const totalInputBytes = files.reduce((sum, f) => sum + f.size, 0)

  return (
    <section className="space-y-6">
      {/* Tool Header */}
      <div className="space-y-1.5">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Merge PDF Files
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Combine two or more PDF files into a single document in any order.
        </p>
      </div>

      <div id="tool-workspace" className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] min-w-0 w-full">
        <Card className="rounded-xl border-border bg-card min-w-0 w-full overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Select & Reorder Documents</CardTitle>
            <CardDescription className="text-xs">
              Upload multiple PDF documents. Use arrow buttons to arrange the order.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 min-w-0">
            <div className="min-w-0">
              <FileDropzone
                id="pdf-merge-input"
                title="Add PDF documents to merge"
                description="Drop PDF files or browse to add documents."
                accept="application/pdf"
                multiple
                onFiles={chooseFiles}
              />
            </div>

            {files.length > 0 && (
              <div className="space-y-2 min-w-0">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground min-w-0">
                  <span className="truncate">Selected files ({files.length})</span>
                  <span className="font-mono text-muted-foreground shrink-0">{formatBytes(totalInputBytes)}</span>
                </div>
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1 min-w-0">
                  {files.map((item, index) => (
                    <div
                      key={`${item.name}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 p-2.5 text-xs min-w-0 w-full"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="flex size-5 items-center justify-center rounded bg-muted text-[10px] font-mono font-bold text-muted-foreground shrink-0">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate break-all">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground">{formatBytes(item.size)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          disabled={index === 0}
                          onClick={() => moveFile(index, -1)}
                          className="size-6 cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUpIcon className="size-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          disabled={index === files.length - 1}
                          onClick={() => moveFile(index, 1)}
                          className="size-6 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDownIcon className="size-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => removeFile(index)}
                          className="size-6 text-muted-foreground hover:text-destructive cursor-pointer"
                          title="Remove"
                        >
                          <TrashIcon className="size-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive min-w-0">
                <WarningCircleIcon className="size-4 shrink-0" weight="fill" />
                <span className="truncate break-all">{error}</span>
              </div>
            )}

            <Button
              type="button"
              onClick={mergePdfs}
              disabled={files.length < 2 || isPending}
              className="h-10 w-full rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-2 cursor-pointer"
            >
              <FilesIcon className="size-4" weight="bold" />
              <span>{isPending ? "Merging Documents..." : `Merge ${files.length} PDFs`}</span>
            </Button>
          </CardContent>
        </Card>

        {/* Right Column */}
        <Card ref={outputRef} id="output-section" className="rounded-xl border-border bg-card min-w-0 w-full overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Merged Document</CardTitle>
            <CardDescription className="text-xs">
              Preview and save your combined PDF file.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 min-w-0">
            {isPending ? (
              <ToolProcessingState
                title="Merging PDF documents..."
                description="Combining pages and optimizing streams."
              />
            ) : result ? (
              <>
                <div className="rounded-lg border border-border bg-muted/20 p-3.5 flex items-center gap-3 min-w-0 w-full">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <FilePdfIcon className="size-5" weight="duotone" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground truncate break-all">{result.name}</p>
                    <p className="text-[11px] text-muted-foreground">{formatBytes(result.size)} • {result.pages} total pages</p>
                  </div>
                </div>

                <FileSaveBar
                  fileUrl={result.url}
                  defaultFileName={result.name}
                  fileSize={result.size}
                  originalSize={totalInputBytes}
                  mimeType="application/pdf"
                  isPdf={true}
                />
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                <FilesIcon className="size-8 mx-auto mb-2 text-muted-foreground/40" weight="duotone" />
                Add at least two PDF files and click &quot;Merge PDFs&quot; to review the output.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
