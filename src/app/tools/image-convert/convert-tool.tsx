"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { ArrowsLeftRightIcon, ImageSquareIcon, SparkleIcon, WarningCircleIcon } from "@phosphor-icons/react"
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

export function ImageConvertTool() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [format, setFormat] = useState<OutputFormat>("image/webp")
  const [quality, setQuality] = useState(90)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const previewUrlRef = useRef<string | null>(null)
  const resultUrlRef = useRef<string | null>(null)
  const outputRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (result && outputRef.current && window.innerWidth < 1024) {
      outputRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [result])

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

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    const nextUrl = URL.createObjectURL(nextFile)
    previewUrlRef.current = nextUrl
    setPreviewUrl(nextUrl)
    setFile(nextFile)
  }

  function convertImage() {
    if (!file) {
      setError("Please select an image first.")
      return
    }

    startTransition(async () => {
      try {
        setError(null)
        const image = await loadImage(file)
        const { canvas } = await renderImageToCanvas(file, image.naturalWidth, image.naturalHeight)
        const blob = await canvasToBlob(canvas, format, quality / 100)

        if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current)
        const url = URL.createObjectURL(blob)
        resultUrlRef.current = url

        const nextResult = {
          url,
          name: outputName(file.name, "converted", format),
          size: blob.size,
          width: image.naturalWidth,
          height: image.naturalHeight,
        }
        setResult(nextResult)
        toast.success(`Converted image to ${format.split("/")[1].toUpperCase()}!`)

        recordRecentJob({
          tool: "Image Convert",
          fileName: file.name,
          inputBytes: file.size,
          outputBytes: blob.size,
          summary: `${format.split("/")[1].toUpperCase()}`,
        })
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Image conversion failed."
        )
      }
    })
  }

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-3xl">
        <Badge variant="outline" className="rounded-md border-primary/30 text-primary bg-primary/5 text-xs font-mono">
          <ArrowsLeftRightIcon className="size-3.5 mr-1" weight="bold" /> Convert Image
        </Badge>
        <h1 className="mt-3 font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Convert images between formats
        </h1>
        <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted-foreground">
          Transform images between JPG, PNG, and WEBP formats with custom quality settings.
        </p>
      </div>

      <div id="tool-workspace" className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] min-w-0 w-full">
        <Card className="rounded-2xl border-border bg-card shadow-xs min-w-0 w-full overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Target Format & Quality</CardTitle>
            <CardDescription className="text-xs">
              Upload an image file and select your desired output container.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 min-w-0">
            <div className="min-w-0">
              <Label htmlFor="image-convert-file" className="text-xs font-semibold text-foreground">Image File</Label>
              <div className="mt-1.5 min-w-0">
                <FileDropzone
                  id="image-convert-file"
                  title={file ? file.name : "Drop an image here"}
                  description={file ? `File size: ${formatBytes(file.size)}` : "PNG, JPG, WEBP, AVIF up to 50 MB"}
                  accept="image/*"
                  onFiles={(files) => chooseFile(files?.[0] ?? null)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="target-format" className="text-xs font-semibold text-foreground">Target Format</Label>
                <Select value={format} onValueChange={(val) => setFormat(val as OutputFormat)}>
                  <SelectTrigger id="target-format" className="mt-1.5 h-10 text-xs bg-background">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image/webp">WEBP (Modern & Lightweight)</SelectItem>
                    <SelectItem value="image/jpeg">JPG (Universal Compatibility)</SelectItem>
                    <SelectItem value="image/png">PNG (Lossless Transparency)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {format !== "image/png" ? (
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <Label htmlFor="convert-quality" className="font-semibold text-foreground">Quality</Label>
                    <span className="font-mono font-bold text-primary">{quality}%</span>
                  </div>
                  <input
                    id="convert-quality"
                    type="range"
                    min="30"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="mt-3 w-full accent-primary cursor-pointer"
                  />
                </div>
              ) : (
                <div className="flex flex-col justify-end text-[11px] text-muted-foreground pb-1">
                  PNG uses lossless compression automatically.
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <WarningCircleIcon className="size-4 shrink-0" weight="fill" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="button"
              onClick={convertImage}
              disabled={!file || isPending}
              className="h-11 w-full rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <SparkleIcon className="size-4" weight="fill" />
              <span>{isPending ? "Converting Image..." : `Convert to ${format.split("/")[1].toUpperCase()}`}</span>
            </Button>
          </CardContent>
        </Card>

        {/* Right Column */}
        <Card ref={outputRef} id="output-section" className="rounded-2xl border-border bg-card shadow-xs min-w-0 w-full overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Preview & Output</CardTitle>
            <CardDescription className="text-xs">
              Review converted format and save directly to your computer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 min-w-0">
            {isPending ? (
              <ToolProcessingState
                title="Converting Image..."
                description="Encoding format structures and writing target output."
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
      reject(new Error("Could not load image."))
    }
    image.src = url
  })
}
