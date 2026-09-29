"use client"

import { useState, useTransition } from "react"
import {
  FilePdf,
  HashStraight,
  WarningCircle,
} from "@phosphor-icons/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDropzone } from "@/components/file-dropzone"
import { FileSaveBar } from "@/components/file-save-bar"
import { ToolProcessingState } from "@/components/tool-skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatBytes } from "@/lib/file-format"
import {
  addPageNumbersToPdf,
  type AddPageNumbersResult,
  type PageNumberFormat,
  type PageNumberPosition,
} from "@/lib/pdf-page-numbers"
import { validatePdfFiles } from "@/lib/pdf-tools"

export function PdfPageNumbersTool() {
  const [file, setFile] = useState<File | null>(null)
  const [position, setPosition] = useState<PageNumberPosition>("bottom-center")
  const [format, setFormat] = useState<PageNumberFormat>("page-n-of-total")
  const [startNumber, setStartNumber] = useState(1)
  const [fontSize, setFontSize] = useState(10)
  const [result, setResult] = useState<AddPageNumbersResult | null>(null)
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

  function handleAddNumbers() {
    if (!file) {
      setError("Please select a PDF document first.")
      return
    }

    setError(null)
    startTransition(async () => {
      try {
        const numbered = await addPageNumbersToPdf({
          file,
          position,
          format,
          startNumber,
          fontSize,
        })
        setResult(numbered)
        toast.success("Page numbers added successfully!")
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to add page numbers.")
      }
    })
  }

  return (
    <section className="space-y-6">
      {/* Tool Header */}
      <div className="space-y-1.5">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Add Page Numbers to PDF
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Number your PDF pages with customizable positioning and styles.
        </p>
      </div>

      <div id="tool-workspace" className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-xl border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Document & Numbering Options</CardTitle>
            <CardDescription className="text-xs">
              Upload your file and choose position and format.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileDropzone
              id="pdf-numbers-input"
              title={file ? file.name : "Select or drop a PDF file"}
              description={file ? `File size: ${formatBytes(file.size)}` : "PDF files up to 50 MB"}
              accept="application/pdf"
              onFiles={(files) => handleFileSelect(files)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <Label htmlFor="num-position" className="text-xs font-semibold text-foreground">
                  Position
                </Label>
                <Select
                  value={position}
                  onValueChange={(val) => setPosition(val as PageNumberPosition)}
                >
                  <SelectTrigger id="num-position" className="mt-1 h-9 text-xs bg-background">
                    <SelectValue placeholder="Position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-center">Bottom Center</SelectItem>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="top-center">Top Center</SelectItem>
                    <SelectItem value="top-left">Top Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="num-format" className="text-xs font-semibold text-foreground">
                  Style
                </Label>
                <Select
                  value={format}
                  onValueChange={(val) => setFormat(val as PageNumberFormat)}
                >
                  <SelectTrigger id="num-format" className="mt-1 h-9 text-xs bg-background">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="page-n-of-total">Page 1 of N</SelectItem>
                    <SelectItem value="n-of-total">1 / N</SelectItem>
                    <SelectItem value="page-n">Page 1</SelectItem>
                    <SelectItem value="n">1 (Number only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="num-start" className="text-xs font-semibold text-foreground">
                  Start From
                </Label>
                <Input
                  id="num-start"
                  type="number"
                  min={1}
                  value={startNumber}
                  onChange={(e) => setStartNumber(Math.max(1, parseInt(e.target.value) || 1))}
                  className="mt-1 h-9 text-xs bg-background"
                />
              </div>

              <div>
                <Label htmlFor="num-font-size" className="text-xs font-semibold text-foreground">
                  Font Size (pt)
                </Label>
                <Input
                  id="num-font-size"
                  type="number"
                  min={7}
                  max={24}
                  value={fontSize}
                  onChange={(e) => setFontSize(Math.max(7, parseInt(e.target.value) || 10))}
                  className="mt-1 h-9 text-xs bg-background"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <WarningCircle className="size-4 shrink-0" weight="fill" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="button"
              onClick={handleAddNumbers}
              disabled={!file || isPending}
              className="h-10 w-full rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <HashStraight className="size-4" weight="bold" />
              <span>{isPending ? "Adding Numbers..." : "Apply Page Numbers"}</span>
            </Button>
          </CardContent>
        </Card>

        {/* Right Column */}
        <Card className="rounded-xl border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Numbered Document</CardTitle>
            <CardDescription className="text-xs">
              Preview and save the numbered file.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPending ? (
              <ToolProcessingState
                title="Adding page numbers..."
                description="Rendering numbers onto document pages."
              />
            ) : result ? (
              <>
                <div className="rounded-lg border border-border bg-muted/20 p-3.5 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <FilePdf className="size-5" weight="duotone" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{result.name}</p>
                    <p className="text-[11px] text-muted-foreground">{formatBytes(result.size)} • {result.pageCount} pages</p>
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
                <HashStraight className="size-8 mx-auto mb-2 text-muted-foreground/40" weight="duotone" />
                Upload a PDF and click &quot;Apply Page Numbers&quot; to review the output.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
