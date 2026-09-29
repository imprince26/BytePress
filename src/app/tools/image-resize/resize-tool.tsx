"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { ArrowsClockwiseIcon, ImageSquareIcon, SparkleIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileDropzone } from "@/components/file-dropzone"
import { FileSaveBar } from "@/components/file-save-bar"
import { ToolProcessingState } from "@/components/tool-skeleton"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  canvasToBlob,
  formatBytes,
  maxImageUploadBytes,
  outputName,
  OutputFormat,
  renderImageToCanvas,
} from "@/lib/image-tools"
import { recordRecentJob } from "@/lib/recent-jobs"

type Result = {
  url: string
  name: string
  size: number
  width: number
  height: number
}

export function ImageResizeTool() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [width, setWidth] = useState(1200)
  const [height, setHeight] = useState(800)
  const [ratio, setRatio] = useState<number | null>(null)
  const [lockRatio, setLockRatio] = useState(true)
  const [format, setFormat] = useState<OutputFormat>("image/jpeg")
  const [quality, setQuality] = useState(90)
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

  function chooseFile(nextFile: File | null) {
    setError(null)
    setResult(null)

    if (!nextFile) return
    if (!nextFile.type.startsWith("image/")) {
      setError("Please select a valid image file.")
      return
    }
    if (nextFile.size > maxImageUploadBytes) {
      setError("This file is larger than the 50 MB limit.")
      return
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
    }

    const nextUrl = URL.createObjectURL(nextFile)
    previewUrlRef.current = nextUrl
    setPreviewUrl(nextUrl)
    setFile(nextFile)

    const img = new Image()
    img.onload = () => {
      const nextRatio = img.naturalWidth / img.naturalHeight
      setRatio(nextRatio)
      setWidth(img.naturalWidth)
      setHeight(img.naturalHeight)
    }
    img.src = nextUrl
  }

  function onWidthChange(nextWidth: number) {
    setWidth(nextWidth)
    if (lockRatio && ratio) {
      setHeight(Math.max(1, Math.round(nextWidth / ratio)))
    }
  }

  function onHeightChange(nextHeight: number) {
    setHeight(nextHeight)
    if (lockRatio && ratio) {
      setWidth(Math.max(1, Math.round(nextHeight * ratio)))
    }
  }

  function resizeImage() {
    if (!file) {
      setError("Please select an image first.")
      return
    }

    startTransition(async () => {
      try {
        setError(null)
        const { canvas } = await renderImageToCanvas(file, width, height)
        const blob = await canvasToBlob(canvas, format, quality / 100)

        if (resultUrlRef.current) {
          URL.revokeObjectURL(resultUrlRef.current)
        }

        const url = URL.createObjectURL(blob)
        resultUrlRef.current = url
        const nextResult = {
          url,
          name: outputName(file.name, "resized", format),
          size: blob.size,
          width,
          height,
        }
        setResult(nextResult)
        toast.success(`Resized image to ${width}x${height}px!`)

        recordRecentJob({
          tool: "Image Resize",
          fileName: file.name,
          inputBytes: file.size,
          outputBytes: blob.size,
          summary: `${width} x ${height}px`,
        })
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Image resize operation failed."
        )
      }
    })
  }

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-3xl">
        <Badge variant="outline" className="rounded-md border-primary/30 text-primary bg-primary/5 text-xs font-mono">
          <ArrowsClockwiseIcon className="size-3.5 mr-1" weight="bold" /> Resize Image
        </Badge>
        <h1 className="mt-3 font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Scale and resize image dimensions
        </h1>
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted-foreground">
          Set custom pixel dimensions with aspect ratio lock and output format controls.
        </p>
      </div>

      <div id="tool-workspace" className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Dimension Settings</CardTitle>
            <CardDescription className="text-xs">
              Specify exact width, height, and target image format.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label htmlFor="image-resize-file" className="text-xs font-semibold text-foreground">Image File</Label>
              <div className="mt-1.5">
                <FileDropzone
                  id="image-resize-file"
                  title={file ? file.name : "Drop an image here"}
                  description={file ? `${formatBytes(file.size)} (${width}x${height}px)` : "PNG, JPG, WEBP, AVIF up to 50 MB"}
                  accept="image/*"
                  onFiles={(files) => chooseFile(files?.[0] ?? null)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="width" className="text-xs font-semibold text-foreground">Width (px)</Label>
                <Input
                  id="width"
                  type="number"
                  min="1"
                  max="10000"
                  value={width}
                  onChange={(e) => onWidthChange(Math.max(1, Number(e.target.value)))}
                  className="mt-1.5 h-10 text-xs bg-background"
                />
              </div>

              <div>
                <Label htmlFor="height" className="text-xs font-semibold text-foreground">Height (px)</Label>
                <Input
                  id="height"
                  type="number"
                  min="1"
                  max="10000"
                  value={height}
                  onChange={(e) => onHeightChange(Math.max(1, Number(e.target.value)))}
                  className="mt-1.5 h-10 text-xs bg-background"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={lockRatio}
                onChange={(e) => setLockRatio(e.target.checked)}
                className="rounded border-border accent-primary"
              />
              <span>Maintain original aspect ratio</span>
            </label>

            <div className="grid gap-4 sm:grid-cols-2 pt-1 border-t border-border">
              <div>
                <Label htmlFor="format" className="text-xs font-semibold text-foreground">Format</Label>
                <Select value={format} onValueChange={(val) => setFormat(val as OutputFormat)}>
                  <SelectTrigger id="format" className="mt-1.5 h-10 text-xs bg-background">
                    <SelectValue placeholder="Output format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image/jpeg">JPG</SelectItem>
                    <SelectItem value="image/webp">WEBP</SelectItem>
                    <SelectItem value="image/png">PNG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quality" className="text-xs font-semibold text-foreground">Quality ({quality}%)</Label>
                <input
                  id="quality"
                  type="range"
                  min="40"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="mt-3 w-full accent-primary cursor-pointer"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <WarningCircleIcon className="size-4 shrink-0" weight="fill" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="button"
              onClick={resizeImage}
              disabled={!file || isPending}
              className="h-11 w-full rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <SparkleIcon className="size-4" weight="fill" />
              <span>{isPending ? "Resizing Image..." : "Resize Image"}</span>
            </Button>
          </CardContent>
        </Card>

        {/* Right Column */}
        <Card className="rounded-2xl border-border bg-card shadow-xs">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Preview & Output</CardTitle>
            <CardDescription className="text-xs">
              Inspect resized dimensions and save to your preferred directory.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {isPending ? (
              <ToolProcessingState
                title="Resizing Image..."
                description="Rendering canvas pixels to target dimensions and encoding output."
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
