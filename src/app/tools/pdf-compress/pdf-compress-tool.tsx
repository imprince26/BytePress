"use client"

import { useState, useTransition } from "react"
import {
  FileArrowDownIcon,
  WarningCircleIcon,
  FilePdfIcon,
} from "@phosphor-icons/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDropzone } from "@/components/file-dropzone"
import { FileSaveBar } from "@/components/file-save-bar"
import { ToolProcessingState } from "@/components/tool-skeleton"
import { formatBytes } from "@/lib/file-format"
import { compressPdf, type CompressPdfResult, type PdfCompressionLevel } from "@/lib/pdf-compress"
import { validatePdfFiles } from "@/lib/pdf-tools"

const COMPRESSION_LEVELS: {
  id: PdfCompressionLevel
  title: string
  desc: string
}[] = [
  {
    id: "extreme",
    title: "High Compression",
    desc: "Smallest file size with good readability.",
  },
  {
    id: "recommended",
    title: "Recommended Compression",
    desc: "Good balance of compression and visual quality.",
  },
  {
    id: "low",
    title: "Low Compression",
    desc: "Highest image and text fidelity with moderate size reduction.",
  },
]

export function PdfCompressTool() {
  const [file, setFile] = useState<File | null>(null)
  const [level, setLevel] = useState<PdfCompressionLevel>("recommended")
  const [result, setResult] = useState<CompressPdfResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleFileSelect(selectedFiles: FileList | null) {
    setError(null)
    setResult(null)

    const list = Array.from(selectedFiles ?? [])
    if (!list.length) {
      setFile(null)
      return
    }

    const validationError = validatePdfFiles(list)
    if (validationError) {
      setError(validationError)
      setFile(null)
      return
    }

    setFile(list[0])
  }

  function handleCompress() {
    if (!file) {
      setError("Please select a PDF file first.")
      return
    }

    setError(null)
    startTransition(async () => {
      try {
        const compressed = await compressPdf({ file, level })
        setResult(compressed)
        toast.success("PDF compressed successfully!")
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to compress PDF.")
      }
    })
  }

  return (
    <section className="space-y-6">
      {/* Tool Header */}
      <div className="space-y-1.5">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Compress PDF
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Reduce the file size of your PDF while maintaining clarity.
        </p>
      </div>

      {/* Main Workspace */}
      <div id="tool-workspace" className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Column: Upload & Configuration */}
        <Card className="rounded-xl border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Document & Settings</CardTitle>
            <CardDescription className="text-xs">
              Choose your PDF and select a compression profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <FileDropzone
              id="pdf-compress-input"
              title={file ? file.name : "Select or drop a PDF file"}
              description={file ? `File size: ${formatBytes(file.size)}` : "PDF files up to 50 MB"}
              accept="application/pdf"
              onFiles={(files) => handleFileSelect(files)}
            />

            {/* Compression Level Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">
                Compression Level
              </label>
              <div className="grid gap-2">
                {COMPRESSION_LEVELS.map((item) => {
                  const isSelected = level === item.id
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setLevel(item.id)}
                      className={`text-left p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? "border-primary bg-primary/[0.04] ring-1 ring-primary"
                          : "border-border bg-background hover:bg-muted/40"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className={`text-xs font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}>
                          {item.title}
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          {item.desc}
                        </p>
                      </div>
                      <span className={`size-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                      }`}>
                        {isSelected && <span className="size-1 rounded-full bg-white" />}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <WarningCircleIcon className="size-4 shrink-0" weight="fill" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="button"
              onClick={handleCompress}
              disabled={!file || isPending}
              className="h-10 w-full rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <FileArrowDownIcon className="size-4" weight="bold" />
              <span>{isPending ? "Compressing PDF..." : "Compress PDF"}</span>
            </Button>
          </CardContent>
        </Card>

        {/* Right Column: Output */}
        <Card className="rounded-xl border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Output File</CardTitle>
            <CardDescription className="text-xs">
              Review and preview your compressed file.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPending ? (
              <ToolProcessingState
                title="Compressing your PDF document..."
                description="Optimizing streams and graphics."
              />
            ) : result ? (
              <>
                <div className="rounded-lg border border-border bg-muted/20 p-3.5 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <FilePdfIcon className="size-5" weight="duotone" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{result.name}</p>
                    <p className="text-[11px] text-muted-foreground">{formatBytes(result.compressedSize)}</p>
                  </div>
                </div>

                <FileSaveBar
                  fileUrl={result.url}
                  defaultFileName={result.name}
                  fileSize={result.compressedSize}
                  originalSize={result.originalSize}
                  mimeType="application/pdf"
                  isPdf={true}
                />
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                <FileArrowDownIcon className="size-8 mx-auto mb-2 text-muted-foreground/40" weight="duotone" />
                Upload a PDF and click &quot;Compress PDF&quot; to view and download your compressed file.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
