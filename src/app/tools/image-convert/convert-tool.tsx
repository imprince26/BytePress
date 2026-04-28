"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { DownloadSimple, ImageSquare, Sparkle } from "@phosphor-icons/react"

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

export function ImageConvertTool() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
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
  }

  function convertImage() {
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
            tool: "image_convert",
            inputBytes: file.size,
            metadata: { format, quality },
          }),
        })
        const nextUsage = await usageResponse.json()
        setUsage(nextUsage)
        if (!usageResponse.ok) {
          setError(nextUsage.message ?? "Please sign in to continue.")
          return
        }

        const { canvas } = await renderImageToCanvas(file)
        const blob = await canvasToBlob(canvas, format, quality / 100)
        if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current)
        const url = URL.createObjectURL(blob)
        resultUrlRef.current = url
        setResult({
          url,
          name: outputName(file.name, "converted", format),
          size: blob.size,
          width: canvas.width,
          height: canvas.height,
        })
        recordRecentJob({
          tool: "Image Convert",
          fileName: file.name,
          inputBytes: file.size,
          outputBytes: blob.size,
          summary: `Converted to ${format.split("/")[1].toUpperCase()}`,
        })
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : "Conversion failed.")
      }
    })
  }

  return (
    <section className="py-14">
      <div className="max-w-3xl">
        <Badge variant="privacy" className="rounded-full">
          <Sparkle weight="fill" /> Convert images
        </Badge>
        <h1 className="mt-5 font-heading text-5xl font-black tracking-[-0.05em] text-slate-950">
          Convert images into the right format.
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Prepare images for uploads, websites, messages, and everyday sharing.
        </p>
      </div>

      <div id="tool-workspace" className="mt-10 scroll-mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <Card className="rounded-[2rem] border-white/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur">
          <CardHeader>
            <CardTitle>Conversion settings</CardTitle>
            <CardDescription>Choose the output format and final quality.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="convert-image">Image file</Label>
              <div className="mt-2">
                <FileDropzone id="convert-image" title="Drop an image here" description="Choose the image you want to convert." accept="image/*" onFiles={(files) => chooseFile(files?.[0] ?? null)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="convert-format">Output format</Label>
                <Select value={format} onValueChange={(value) => setFormat(value as OutputFormat)}>
                  <SelectTrigger id="convert-format" className="mt-2 bg-white">
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
                <Label htmlFor="convert-quality">Quality: {quality}%</Label>
                <Input id="convert-quality" type="range" min="10" max="100" className="mt-2 px-0" value={quality} onChange={(event) => setQuality(Number(event.target.value))} />
              </div>
            </div>

            {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div> : null}

            <Button className="h-12 w-full rounded-full" disabled={!file || isPending || usage?.requiresLogin} onClick={convertImage}>
              {isPending ? "Converting..." : "Convert image"}
            </Button>
            {usage ? <p className="text-center text-xs text-slate-500">Anonymous usage: {usage.used}/{usage.limit} today. {usage.remaining} remaining.</p> : null}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur">
          <CardHeader>
            <CardTitle>Preview and result</CardTitle>
            <CardDescription>Review the output summary before downloading.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
              {result?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={result.url} alt="Converted preview" className="aspect-video w-full object-contain" />
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
                  <a href={result.url} download={result.name}><DownloadSimple className="size-4" /> Download converted image</a>
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4"><div className="text-xs uppercase tracking-wide text-slate-500">{label}</div><div className="mt-1 font-heading text-lg font-black text-slate-950">{value}</div></div>
}
