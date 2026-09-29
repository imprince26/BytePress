"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { ArrowClockwiseIcon, FilePdfIcon, SparkleIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { degrees, PDFDocument } from "pdf-lib"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDropzone } from "@/components/file-dropzone"
import { FileSaveBar } from "@/components/file-save-bar"
import { ToolProcessingState } from "@/components/tool-skeleton"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatBytes } from "@/lib/file-format"
import { validatePdfFiles } from "@/lib/pdf-tools"

type Result = { url: string; name: string; size: number; pages: number }

export function PdfRotateTool() {
  const [file, setFile] = useState<File | null>(null)
  const [rotation, setRotation] = useState("90")
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const resultUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current)
    }
  }, [])

  function chooseFile(nextFile: File | null) {
    const validationError = validatePdfFiles(nextFile ? [nextFile] : [])
    setResult(null)
    setError(validationError)
    setFile(validationError ? null : nextFile)
  }

  function rotatePdf() {
    if (!file) {
      setError("Please choose a PDF document first.")
      return
    }

    startTransition(async () => {
      try {
        setError(null)
        const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true })
        const angle = Number(rotation)

        pdf.getPages().forEach((page) => {
          const current = page.getRotation().angle
          page.setRotation(degrees((current + angle) % 360))
        })

        const bytes = await pdf.save({ useObjectStreams: true })
        const pdfBytes = bytes.buffer.slice(
          bytes.byteOffset,
          bytes.byteOffset + bytes.byteLength
        ) as ArrayBuffer

        if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current)
        const url = URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }))
        resultUrlRef.current = url

        const baseName = file.name.replace(/\.pdf$/i, "")
        setResult({
          url,
          name: `${baseName}-rotated.pdf`,
          size: bytes.byteLength,
          pages: pdf.getPageCount(),
        })
        toast.success(`Rotated ${pdf.getPageCount()} pages by ${rotation}°!`)
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : "Could not rotate this PDF.")
      }
    })
  }

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-3xl">
        <Badge variant="outline" className="rounded-md border-primary/30 text-primary bg-primary/5 text-xs font-mono">
          <ArrowClockwiseIcon className="size-3.5 mr-1" weight="bold" /> Rotate PDF
        </Badge>
        <h1 className="mt-3 font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Rotate PDF pages permanently
        </h1>
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted-foreground">
          Correct upside-down or sideways pages across your entire document and save the updated file.
        </p>
      </div>

      <div id="tool-workspace" className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Rotation Settings</CardTitle>
            <CardDescription className="text-xs">
              Select orientation angle to apply to document pages.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <FileDropzone
              id="pdf-rotate-input"
              title={file ? file.name : "Drop a PDF document here"}
              description={file ? `File size: ${formatBytes(file.size)}` : "PDF documents up to 50 MB"}
              accept="application/pdf"
              onFiles={(files) => chooseFile(files?.[0] ?? null)}
            />

            <div>
              <Label htmlFor="rotation-angle" className="text-xs font-semibold text-foreground">
                Rotation Angle
              </Label>
              <Select value={rotation} onValueChange={setRotation}>
                <SelectTrigger id="rotation-angle" className="mt-1.5 h-10 text-xs bg-background">
                  <SelectValue placeholder="Rotation angle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">Rotate 90° Clockwise</SelectItem>
                  <SelectItem value="180">Rotate 180° (Upside down)</SelectItem>
                  <SelectItem value="270">Rotate 270° (Counter-clockwise)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <WarningCircleIcon className="size-4 shrink-0" weight="fill" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="button"
              onClick={rotatePdf}
              disabled={!file || isPending}
              className="h-11 w-full rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <SparkleIcon className="size-4" weight="fill" />
              <span>{isPending ? "Rotating Document..." : "Rotate PDF"}</span>
            </Button>
          </CardContent>
        </Card>

        {/* Right Column */}
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Rotated Output</CardTitle>
            <CardDescription className="text-xs">
              Inspect your rotated pages or save the updated file.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {isPending ? (
              <ToolProcessingState
                title="Rotating PDF Pages..."
                description="Applying page orientation adjustments and rebuilding PDF streams."
              />
            ) : (
              <>
                <div className="rounded-xl border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <FilePdfIcon className="size-6" weight="duotone" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {file ? file.name : "No document selected"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {result ? `${result.pages} pages rotated` : "Waiting for rotation"}
                      </p>
                    </div>
                  </div>
                </div>

                {result ? (
                  <FileSaveBar
                    fileUrl={result.url}
                    defaultFileName={result.name}
                    fileSize={result.size}
                    originalSize={file ? file.size : undefined}
                    mimeType="application/pdf"
                    isPdf={true}
                  />
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                    <ArrowClockwiseIcon className="size-8 mx-auto mb-2 text-muted-foreground/40" weight="duotone" />
                    Select an angle and click &quot;Rotate PDF&quot; to review and download the updated document.
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
