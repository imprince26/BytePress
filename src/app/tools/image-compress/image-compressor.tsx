"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { DownloadSimple, ImageSquare, LockKey, WarningCircle } from "@phosphor-icons/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

type OutputFormat = "image/jpeg" | "image/webp" | "image/png"
type CompressionMode = "quality" | "target"

type Usage = {
  limit: number
  used: number
  remaining: number
  requiresLogin: boolean
}

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
  const [format, setFormat] = useState<OutputFormat>("image/webp")
  const [result, setResult] = useState<Result | null>(null)
  const [usage, setUsage] = useState<Usage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const previewUrlRef = useRef<string | null>(null)
  const resultUrlRef = useRef<string | null>(null)

  useEffect(() => {
    fetch("/api/usage")
      .then((response) => response.json())
      .then(setUsage)
      .catch(() => setUsage(null))
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
      }

      if (resultUrlRef.current) {
        URL.revokeObjectURL(resultUrlRef.current)
      }
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
      setError("This file is larger than the current 50 MB limit.")
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
        const usageResponse = await fetch("/api/usage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tool: "image_compress",
            inputBytes: file.size,
            metadata: {
              mode,
              format,
              quality,
              targetKb: mode === "target" ? targetKb : undefined,
            },
          }),
        })

        const nextUsage = await usageResponse.json()
        setUsage(nextUsage)

        if (!usageResponse.ok) {
          setError(nextUsage.message ?? "Please sign in to continue.")
          return
        }

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
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Image compression failed. Try another file."
        )
      }
    })
  }

  const savings = result && file ? Math.max(0, 1 - result.size / file.size) : 0

  return (
    <section className="py-14">
      <div className="max-w-3xl">
        <Badge variant="privacy" className="rounded-full">
          <LockKey weight="fill" /> Image compressor
        </Badge>
        <h1 className="mt-5 font-heading text-5xl font-black tracking-[-0.05em] text-slate-950">
          Make images lighter and easier to share.
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Choose the result you want, preview the savings, and download a cleaner file.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <Card className="rounded-[2rem] border-white/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur">
          <CardHeader>
            <CardTitle>Image settings</CardTitle>
            <CardDescription>
              Pick a format and control how small the image should be.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="image">Image file</Label>
              <div className="mt-2 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50/80 p-5">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="bg-white"
                  onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
                />
                <p className="mt-3 text-xs text-slate-500">
                  Max size: 50 MB.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="mode">Compression mode</Label>
                <Select value={mode} onValueChange={(value) => setMode(value as CompressionMode)}>
                  <SelectTrigger id="mode" className="mt-2 bg-white">
                    <SelectValue placeholder="Compression mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quality">Quality percentage</SelectItem>
                    <SelectItem value="target">Target file size</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="format">Output format</Label>
                <Select value={format} onValueChange={(value) => setFormat(value as OutputFormat)}>
                  <SelectTrigger id="format" className="mt-2 bg-white">
                    <SelectValue placeholder="Output format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image/webp">WEBP</SelectItem>
                    <SelectItem value="image/jpeg">JPG</SelectItem>
                    <SelectItem value="image/png">PNG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {mode === "quality" ? (
              <div>
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="quality">Quality</Label>
                  <span className="font-heading text-sm font-black">{quality}%</span>
                </div>
                <Input
                  id="quality"
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  className="mt-2 px-0"
                  onChange={(event) => setQuality(Number(event.target.value))}
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="target">Target size in KB</Label>
                <Input
                  id="target"
                  type="number"
                  min="20"
                  value={targetKb}
                  className="mt-2 bg-white"
                  onChange={(event) => setTargetKb(Number(event.target.value))}
                />
                {format === "image/png" ? (
                  <p className="mt-2 flex items-center gap-2 text-xs text-amber-700">
                    <WarningCircle className="size-4" /> PNG target-size compression is limited by browser support. WEBP or JPG is recommended.
                  </p>
                ) : null}
              </div>
            )}

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                {error}
              </div>
            ) : null}

            <Button
              className="h-12 w-full rounded-full"
              disabled={!file || isPending || usage?.requiresLogin}
              onClick={compressSelectedImage}
            >
              {isPending ? "Compressing..." : "Compress image"}
            </Button>

            {usage ? (
              <p className="text-center text-xs text-slate-500">
                Anonymous usage: {usage.used}/{usage.limit} today. {usage.remaining} remaining.
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur">
          <CardHeader>
            <CardTitle>Preview and result</CardTitle>
            <CardDescription>
              Compare original and compressed output before downloading.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Selected preview" className="aspect-video w-full object-contain" />
              ) : (
                <div className="flex aspect-video flex-col items-center justify-center text-slate-500">
                  <ImageSquare className="size-12" weight="duotone" />
                  <p className="mt-3 text-sm">No image selected</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <ResultMetric label="Original" value={file ? formatBytes(file.size) : "-"} />
              <ResultMetric label="Output" value={result ? formatBytes(result.size) : "-"} />
              <ResultMetric label="Saved" value={result ? `${Math.round(savings * 100)}%` : "-"} />
            </div>

            {result ? (
              <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm font-medium text-emerald-950">
                  Ready: {result.width} x {result.height}px, {formatBytes(result.size)}
                </p>
                <Button asChild className="mt-4 h-11 w-full rounded-full">
                  <a href={result.url} download={result.name}>
                    <DownloadSimple className="size-4" /> Download compressed image
                  </a>
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function ResultMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 font-heading text-lg font-black text-slate-950">{value}</div>
    </div>
  )
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
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
    throw new Error("Your browser could not create an image canvas.")
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

  if (format === "image/png") {
    return bestBlob
  }

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
