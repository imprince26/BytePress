"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { ArrowsClockwise, DownloadSimple, ImageSquare } from "@phosphor-icons/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileDropzone } from "@/components/file-dropzone"
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

export function ImageResizeTool() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [width, setWidth] = useState(1200)
  const [height, setHeight] = useState(800)
  const [ratio, setRatio] = useState<number | null>(null)
  const [lockRatio, setLockRatio] = useState(true)
  const [format, setFormat] = useState<OutputFormat>("image/jpeg")
  const [quality, setQuality] = useState(90)
  const [usage, setUsage] = useState<Usage | null>(null)
  const [result, setResult] = useState<Result | null>(null)
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
      setError("This file is larger than the current 50 MB limit.")
      return
    }

    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    const nextPreviewUrl = URL.createObjectURL(nextFile)
    previewUrlRef.current = nextPreviewUrl
    setPreviewUrl(nextPreviewUrl)
    setFile(nextFile)

    const image = new Image()
    image.onload = () => {
      setWidth(image.naturalWidth)
      setHeight(image.naturalHeight)
      setRatio(image.naturalWidth / image.naturalHeight)
      URL.revokeObjectURL(image.src)
    }
    image.src = URL.createObjectURL(nextFile)
  }

  function updateWidth(nextWidth: number) {
    setWidth(nextWidth)
    if (lockRatio && ratio) setHeight(Math.round(nextWidth / ratio))
  }

  function updateHeight(nextHeight: number) {
    setHeight(nextHeight)
    if (lockRatio && ratio) setWidth(Math.round(nextHeight * ratio))
  }

  function resizeImage() {
    if (!file) {
      setError("Choose an image first.")
      return
    }

    startTransition(async () => {
      try {
        setError(null)
        const usageResponse = await fetch("/api/usage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tool: "image_resize",
            inputBytes: file.size,
            metadata: { width, height, format, quality },
          }),
        })
        const nextUsage = await usageResponse.json()
        setUsage(nextUsage)
        if (!usageResponse.ok) {
          setError(nextUsage.message ?? "Please sign in to continue.")
          return
        }

        const { canvas } = await renderImageToCanvas(file, width, height)
        const blob = await canvasToBlob(canvas, format, quality / 100)
        if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current)
        const url = URL.createObjectURL(blob)
        resultUrlRef.current = url
        setResult({
          url,
          name: outputName(file.name, "resized", format),
          size: blob.size,
          width: canvas.width,
          height: canvas.height,
        })
        recordRecentJob({
          tool: "Image Resize",
          fileName: file.name,
          inputBytes: file.size,
          outputBytes: blob.size,
          summary: `${canvas.width} x ${canvas.height}px`,
        })
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : "Resize failed.")
      }
    })
  }

  return (
    <section className="py-14">
      <div className="max-w-3xl">
        <Badge variant="privacy" className="rounded-full">
          <ArrowsClockwise weight="fill" /> Resize images
        </Badge>
        <h1 className="mt-5 font-heading text-5xl font-black tracking-[-0.05em] text-slate-950">
          Create the exact image size you need.
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Resize photos, graphics, and uploads for any destination.
        </p>
      </div>

      <div id="tool-workspace" className="mt-10 scroll-mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <Card className="rounded-[2rem] border-white/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur">
          <CardHeader>
            <CardTitle>Resize settings</CardTitle>
            <CardDescription>Set dimensions, choose a format, and download the result.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="resize-image">Image file</Label>
              <div className="mt-2">
                <FileDropzone id="resize-image" title="Drop an image here" description="Choose the image you want to resize." accept="image/*" onFiles={(files) => chooseFile(files?.[0] ?? null)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="width">Width</Label>
                <Input id="width" type="number" min="1" className="mt-2 bg-white" value={width} onChange={(event) => updateWidth(Number(event.target.value))} />
              </div>
              <div>
                <Label htmlFor="height">Height</Label>
                <Input id="height" type="number" min="1" className="mt-2 bg-white" value={height} onChange={(event) => updateHeight(Number(event.target.value))} />
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
              <input type="checkbox" checked={lockRatio} onChange={(event) => setLockRatio(event.target.checked)} />
              Keep aspect ratio
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="resize-format">Output format</Label>
                <Select value={format} onValueChange={(value) => setFormat(value as OutputFormat)}>
                  <SelectTrigger id="resize-format" className="mt-2 bg-white">
                    <SelectValue placeholder="Output format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image/webp">WEBP</SelectItem>
                    <SelectItem value="image/jpeg">JPG</SelectItem>
                    <SelectItem value="image/png">PNG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="resize-quality">Quality: {quality}%</Label>
                <Input id="resize-quality" type="range" min="10" max="100" className="mt-2 px-0" value={quality} onChange={(event) => setQuality(Number(event.target.value))} />
              </div>
            </div>

            {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div> : null}

            <Button className="h-12 w-full rounded-full" disabled={!file || isPending || usage?.requiresLogin} onClick={resizeImage}>
              {isPending ? "Resizing..." : "Resize image"}
            </Button>
            {usage ? <p className="text-center text-xs text-slate-500">Anonymous usage: {usage.used}/{usage.limit} today. {usage.remaining} remaining.</p> : null}
          </CardContent>
        </Card>

        <PreviewCard file={file} previewUrl={previewUrl} result={result} />
      </div>
    </section>
  )
}

function PreviewCard({ file, previewUrl, result }: { file: File | null; previewUrl: string | null; result: Result | null }) {
  return (
    <Card className="rounded-[2rem] border-white/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur">
      <CardHeader>
        <CardTitle>Preview and result</CardTitle>
        <CardDescription>Download the resized image when it is ready.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
          {result?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={result.url} alt="Resized preview" className="aspect-video w-full object-contain" />
          ) : previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="Selected preview" className="aspect-video w-full object-contain" />
          ) : (
            <div className="flex aspect-video flex-col items-center justify-center text-slate-500">
              <ImageSquare className="size-12" weight="duotone" />
              <p className="mt-3 text-sm">No image selected</p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Metric label="Original" value={file ? formatBytes(file.size) : "-"} />
          <Metric label="Output" value={result ? formatBytes(result.size) : "-"} />
        </div>
        {result ? (
          <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-950">Ready: {result.width} x {result.height}px</p>
            <Button asChild className="mt-4 h-11 w-full rounded-full">
              <a href={result.url} download={result.name}><DownloadSimple className="size-4" /> Download resized image</a>
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="text-xs uppercase tracking-wide text-slate-500">{label}</div><div className="mt-1 font-heading text-lg font-black text-slate-950">{value}</div></div>
}
