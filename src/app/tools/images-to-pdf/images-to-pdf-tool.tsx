"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { ArrowDownIcon, ArrowUpIcon, FilePdfIcon, ImagesSquareIcon, SparkleIcon, TrashIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { PDFDocument } from "pdf-lib"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDropzone } from "@/components/file-dropzone"
import { FileSaveBar } from "@/components/file-save-bar"
import { ToolProcessingState } from "@/components/tool-skeleton"
import { formatBytes } from "@/lib/file-format"
import { maxImageUploadBytes } from "@/lib/image-tools"

type Result = { url: string; name: string; size: number; pages: number }
type ImageItem = { id: string; file: File; previewUrl: string }

function validateImages(files: File[]) {
  if (!files.length) return "Choose at least one image."
  if (files.some((file) => !file.type.startsWith("image/"))) return "Please choose image files only."
  if (files.some((file) => file.size > maxImageUploadBytes)) return "Each image must be 50 MB or smaller."
  return null
}

async function imageToBytes(file: File) {
  // If image is JPEG or PNG, use arrayBuffer directly
  if (file.type === "image/jpeg" || file.type === "image/png") {
    return {
      bytes: await file.arrayBuffer(),
      type: file.type as "image/jpeg" | "image/png",
    }
  }

  // Convert WEBP or others to PNG via canvas
  return new Promise<{ bytes: ArrayBuffer; type: "image/png" }>((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement("canvas")
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Canvas context failed"))
        return
      }
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(async (blob) => {
        if (!blob) {
          reject(new Error("Blob conversion failed"))
          return
        }
        resolve({ bytes: await blob.arrayBuffer(), type: "image/png" })
      }, "image/png")
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Could not read image"))
    }
    img.src = url
  })
}

export function ImagesToPdfTool() {
  const [items, setItems] = useState<ImageItem[]>([])
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const resultUrlRef = useRef<string | null>(null)
  const itemsRef = useRef<ImageItem[]>([])

  useEffect(() => {
    return () => {
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current)
      itemsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl))
    }
  }, [])

  function chooseFiles(nextFiles: FileList | null) {
    const selected = Array.from(nextFiles ?? [])
    if (!selected.length) return

    const validationError = validateImages(selected)
    setResult(null)
    setError(validationError)
    if (validationError) return

    const nextItems = selected.map((file) => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
    }))
    const mergedItems = [...itemsRef.current, ...nextItems]
    itemsRef.current = mergedItems
    setItems(mergedItems)
  }

  function removeImage(id: string) {
    const item = itemsRef.current.find((current) => current.id === id)
    if (item) URL.revokeObjectURL(item.previewUrl)
    const nextItems = itemsRef.current.filter((current) => current.id !== id)
    itemsRef.current = nextItems
    setItems(nextItems)
    setResult(null)
  }

  function moveImage(id: string, direction: -1 | 1) {
    const index = itemsRef.current.findIndex((item) => item.id === id)
    const nextIndex = index + direction
    if (index < 0 || nextIndex < 0 || nextIndex >= itemsRef.current.length) return

    const nextItems = [...itemsRef.current]
    const [item] = nextItems.splice(index, 1)
    nextItems.splice(nextIndex, 0, item)
    itemsRef.current = nextItems
    setItems(nextItems)
    setResult(null)
  }

  function convertImagesToPdf() {
    if (!items.length) {
      setError("Please add at least one image.")
      return
    }

    startTransition(async () => {
      try {
        setError(null)
        const pdf = await PDFDocument.create()

        for (const item of items) {
          const { bytes, type } = await imageToBytes(item.file)
          const embeddedImage =
            type === "image/jpeg"
              ? await pdf.embedJpg(bytes)
              : await pdf.embedPng(bytes)

          const page = pdf.addPage([embeddedImage.width, embeddedImage.height])
          page.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: embeddedImage.width,
            height: embeddedImage.height,
          })
        }

        const bytes = await pdf.save({ useObjectStreams: true })
        if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current)

        const pdfBytes = bytes.buffer.slice(
          bytes.byteOffset,
          bytes.byteOffset + bytes.byteLength
        ) as ArrayBuffer

        const url = URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }))
        resultUrlRef.current = url

        setResult({
          url,
          name: "images-combined.pdf",
          size: bytes.byteLength,
          pages: items.length,
        })
        toast.success(`Converted ${items.length} images to PDF!`)
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Could not convert images to PDF."
        )
      }
    })
  }

  const totalInputBytes = items.reduce((sum, item) => sum + item.file.size, 0)

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-3xl">
        <Badge variant="outline" className="rounded-md border-primary/30 text-primary bg-primary/5 text-xs font-mono">
          <ImagesSquareIcon className="size-3.5 mr-1" weight="bold" /> Images to PDF
        </Badge>
        <h1 className="mt-3 font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Convert images into a single PDF
        </h1>
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted-foreground">
          Compile multiple JPG, PNG, or WEBP photos and images into a single structured PDF file.
        </p>
      </div>

      <div id="tool-workspace" className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Upload & Reorder Images</CardTitle>
            <CardDescription className="text-xs">
              Upload photos in JPG, PNG, or WEBP format. Arrange the sequence with arrow buttons.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <FileDropzone
              id="images-to-pdf-input"
              title="Add images to convert"
              description="Drop images or browse. You can add more images anytime."
              accept="image/*"
              multiple
              onFiles={chooseFiles}
            />

            {items.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>Selected Images ({items.length})</span>
                  <span className="font-mono text-foreground font-bold">{formatBytes(totalInputBytes)}</span>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 p-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.previewUrl}
                          alt="Thumbnail"
                          className="size-10 rounded-lg object-cover border border-border shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{item.file.name}</p>
                          <p className="text-[10px] text-muted-foreground">{formatBytes(item.file.size)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          disabled={index === 0}
                          onClick={() => moveImage(item.id, -1)}
                          className="size-7"
                          title="Move up"
                        >
                          <ArrowUpIcon className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          disabled={index === items.length - 1}
                          onClick={() => moveImage(item.id, 1)}
                          className="size-7"
                          title="Move down"
                        >
                          <ArrowDownIcon className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => removeImage(item.id)}
                          className="size-7 text-muted-foreground hover:text-destructive"
                          title="Remove"
                        >
                          <TrashIcon className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <WarningCircleIcon className="size-4 shrink-0" weight="fill" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="button"
              onClick={convertImagesToPdf}
              disabled={!items.length || isPending}
              className="h-11 w-full rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <SparkleIcon className="size-4" weight="fill" />
              <span>{isPending ? "Generating PDF..." : `Create PDF (${items.length} Images)`}</span>
            </Button>
          </CardContent>
        </Card>

        {/* Right Column */}
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Generated PDF</CardTitle>
            <CardDescription className="text-xs">
              Verify your output PDF document before saving.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {isPending ? (
              <ToolProcessingState
                title="Generating PDF Document..."
                description="Embedding images into PDF page streams and assembling binary document."
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
                        {result ? result.name : "Document ready"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {result ? `${result.pages} pages compiled` : "Waiting for conversion"}
                      </p>
                    </div>
                  </div>
                </div>

                {result ? (
                  <FileSaveBar
                    fileUrl={result.url}
                    defaultFileName={result.name}
                    fileSize={result.size}
                    originalSize={totalInputBytes}
                    mimeType="application/pdf"
                    isPdf={true}
                  />
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                    <ImagesSquareIcon className="size-8 mx-auto mb-2 text-muted-foreground/40" weight="duotone" />
                    Add images and click &quot;Create PDF&quot; to review the output file and preview pages.
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
