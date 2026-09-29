"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { ImageSquareIcon, SparkleIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileDropzone } from "@/components/file-dropzone"
import { FileSaveBar } from "@/components/file-save-bar"
import { ToolProcessingState } from "@/components/tool-skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatBytes } from "@/lib/file-format"
import { recordRecentJob } from "@/lib/recent-jobs"

type OutputFormat = "image/jpeg" | "image/webp" | "image/png"
type CompressionMode = "quality" | "target"

type Result = {
  url: string
  name: string
  size: number
  width: number
  height: number
}

const maxUploadBytes = 50 * 1024 * 1024

export function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [quality, setQuality] = useState(75)
  const [targetKb, setTargetKb] = useState(500)
  const [mode, setMode] = useState<CompressionMode>("quality")
  const [format, setFormat] = useState<OutputFormat>("image/jpeg")
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const previewUrlRef = useRef<string | null>(null)
  const resultUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current)
    }
  }, [])

  function onFileChange(nextFile: File | null) {
    setError(null)
    setResult(null)

    if (!nextFile) {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
        previewUrlRef.current = null
      }
      setFile(null)
      setPreviewUrl(null)
      return
    }

    if (!nextFile.type.startsWith("image/")) {
      setError("Please select a valid image file.")
      return
    }

    if (nextFile.size > maxUploadBytes) {
      setError("This file is larger than the 50 MB limit.")
      return
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
    }

    const nextPreviewUrl = URL.createObjectURL(nextFile)
    previewUrlRef.current = nextPreviewUrl
    setPreviewUrl(nextPreviewUrl)
    setFile(nextFile)
  }

  function compressSelectedImage() {
    if (!file) {
      setError("Choose an image first.")
      return
    }

    setError(null)
    startTransition(async () => {
      try {
        const compressed = await compressImage({
          file,
          mode,
          quality,
          targetBytes: targetKb * 1024,
          format,
        })

        if (resultUrlRef.current) {
          URL.revokeObjectURL(resultUrlRef.current)
        }

        resultUrlRef.current = compressed.url
        setResult(compressed)
        toast.success("Image compressed successfully!")

        recordRecentJob({
          tool: "Image Compress",
          fileName: file.name,
          inputBytes: file.size,
          outputBytes: compressed.size,
          summary: `Saved ${Math.round(Math.max(0, 1 - compressed.size / file.size) * 100)}%`,
        })
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Image compression failed. Try another file."
        )
      }
    })
  }

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-3xl">
        <Badge variant="outline" className="rounded-md border-primary/30 text-primary bg-primary/5 text-xs font-mono">
          <ImageSquareIcon className="size-3.5 mr-1" weight="bold" /> Compress Image
        </Badge>
        <h1 className="mt-3 font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Compress and optimize images
        </h1>
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted-foreground">
          Reduce image file sizes for websites, applications, and documents while maintaining crisp visual clarity.
        </p>
      </div>

      <div id="tool-workspace" className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Image Settings</CardTitle>
            <CardDescription className="text-xs">
              Upload an image and adjust quality or target size settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label htmlFor="image" className="text-xs font-semibold text-foreground">Image File</Label>
              <div className="mt-1.5">
                <FileDropzone
                  id="image"
                  title={file ? file.name : "Drop an image here"}
                  description={file ? `Original size: ${formatBytes(file.size)}` : "PNG, JPG, WEBP, AVIF up to 50 MB"}
                  accept="image/*"
                  onFiles={(files) => onFileChange(files?.[0] ?? null)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="mode" className="text-xs font-semibold text-foreground">Mode</Label>
                <Select value={mode} onValueChange={(value) => setMode(value as CompressionMode)}>
                  <SelectTrigger id="mode" className="mt-1.5 h-10 text-xs bg-background">
                    <SelectValue placeholder="Compression mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quality">Quality Percentage</SelectItem>
                    <SelectItem value="target">Target File Size</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="format" className="text-xs font-semibold text-foreground">Output Format</Label>
                <Select value={format} onValueChange={(value) => setFormat(value as OutputFormat)}>
                  <SelectTrigger id="format" className="mt-1.5 h-10 text-xs bg-background">
                    <SelectValue placeholder="Output format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image/webp">WEBP (Optimized)</SelectItem>
                    <SelectItem value="image/jpeg">JPG</SelectItem>
                    <SelectItem value="image/png">PNG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {mode === "quality" ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <Label htmlFor="quality" className="font-semibold text-foreground">Compression Quality</Label>
                  <span className="font-mono font-bold text-primary">{quality}%</span>
                </div>
                <input
                  id="quality"
                  type="range"
                  min="20"
                  max="95"
                  step="1"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="targetKb" className="text-xs font-semibold text-foreground">Target Size (KB)</Label>
                <Input
                  id="targetKb"
                  type="number"
                  min="10"
                  max="20000"
                  value={targetKb}
                  onChange={(e) => setTargetKb(Math.max(10, Number(e.target.value)))}
                  className="h-10 text-xs bg-background"
                />
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
              onClick={compressSelectedImage}
              disabled={!file || isPending}
              className="h-11 w-full rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <SparkleIcon className="size-4" weight="fill" />
              <span>{isPending ? "Compressing Image..." : "Compress Image"}</span>
            </Button>
          </CardContent>
        </Card>

        {/* Right Column: Preview & Save */}
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Preview & Output</CardTitle>
            <CardDescription className="text-xs">
              Review compressed image metrics and save to your preferred directory.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {isPending ? (
              <ToolProcessingState
                title="Compressing Image..."
                description="Encoding pixels and optimizing binary output streams."
              />
            ) : (
              <>
                <div className="overflow-hidden rounded-xl border border-border bg-muted/20 p-2">
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={result ? result.url : previewUrl}
                      alt="Image preview"
                      className="aspect-video w-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="flex aspect-video flex-col items-center justify-center text-muted-foreground">
                      <ImageSquareIcon className="size-10 text-muted-foreground/40 mb-2" weight="duotone" />
                      <p className="text-xs">No image selected</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl border border-border bg-background p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Original</p>
                    <p className="mt-1 text-xs font-bold font-mono text-foreground">
                      {file ? formatBytes(file.size) : "-"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Output</p>
                    <p className="mt-1 text-xs font-bold font-mono text-foreground">
                      {result ? formatBytes(result.size) : "-"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-background p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Saved</p>
                    <p className="mt-1 text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      {result && file
                        ? `${Math.round(Math.max(0, 1 - result.size / file.size) * 100)}%`
                        : "-"}
                    </p>
                  </div>
                </div>

                {result ? (
                  <FileSaveBar
                    fileUrl={result.url}
                    defaultFileName={result.name}
                    fileSize={result.size}
                    originalSize={file ? file.size : undefined}
                    mimeType={format}
                    isPdf={false}
                  />
                ) : null}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

async function compressImage(input: {
  file: File
  mode: CompressionMode
  quality: number
  targetBytes: number
  format: OutputFormat
}) {
  const image = await loadImage(input.file)
  const canvas = document.createElement("canvas")
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight

  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("Browser could not create canvas context.")
  }

  context.drawImage(image, 0, 0)

  const blob =
    input.mode === "target"
      ? await compressToTarget(canvas, input.format, input.targetBytes)
      : await canvasToBlob(canvas, input.format, input.quality / 100)

  return {
    url: URL.createObjectURL(blob),
    name: outputName(input.file.name, input.format),
    size: blob.size,
    width: canvas.width,
    height: canvas.height,
  }
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Could not read this image."))
    }
    image.src = url
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, format: OutputFormat, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not create compressed output."))
          return
        }
        resolve(blob)
      },
      format,
      quality
    )
  })
}

async function compressToTarget(
  canvas: HTMLCanvasElement,
  format: OutputFormat,
  targetBytes: number
) {
  let bestBlob = await canvasToBlob(canvas, format, 0.82)
  if (format === "image/png") return bestBlob

  let low = 0.1
  let high = 0.95

  for (let index = 0; index < 8; index += 1) {
    const quality = (low + high) / 2
    const nextBlob = await canvasToBlob(canvas, format, quality)

    if (nextBlob.size <= targetBytes) {
      bestBlob = nextBlob
      low = quality
    } else {
      high = quality
    }
  }

  return bestBlob
}

function outputName(name: string, format: OutputFormat) {
  const extension = format === "image/jpeg" ? "jpg" : format.split("/")[1]
  const base = name.replace(/\.[^.]+$/, "")
  return `${base}-compressed.${extension}`
}
