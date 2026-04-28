"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { ArrowDown, ArrowUp, DownloadSimple, FilePdf, ImagesSquare, Trash } from "@phosphor-icons/react"
import { PDFDocument } from "pdf-lib"

import { FileDropzone } from "@/components/file-dropzone"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { formatBytes } from "@/lib/file-format"
import { maxImageUploadBytes } from "@/lib/image-tools"
import { recordRecentJob } from "@/lib/recent-jobs"

type Usage = { limit: number; used: number; remaining: number; requiresLogin: boolean }
type Result = { url: string; name: string; size: number; pages: number }
type ImageItem = { id: string; file: File; previewUrl: string }

function validateImages(files: File[]) {
  if (!files.length) return "Choose at least one image."
  if (files.some((file) => !["image/jpeg", "image/png"].includes(file.type))) return "Please choose JPG or PNG images only."
  if (files.some((file) => file.size > maxImageUploadBytes)) return "Each image must be 50 MB or smaller."
  return null
}

async function imageDimensions(file: File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: image.naturalWidth, height: image.naturalHeight })
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Could not read one of these images."))
    }
    image.src = url
  })
}

export function ImagesToPdfTool() {
  const [items, setItems] = useState<ImageItem[]>([])
  const [usage, setUsage] = useState<Usage | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const resultUrlRef = useRef<string | null>(null)
  const itemsRef = useRef<ImageItem[]>([])

  useEffect(() => {
    fetch("/api/usage").then((response) => response.json()).then(setUsage).catch(() => setUsage(null))
  }, [])

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

  function convertImages() {
    if (!items.length) {
      setError("Choose at least one image.")
      return
    }

    startTransition(async () => {
      try {
        setError(null)
        const inputBytes = items.reduce((total, item) => total + item.file.size, 0)
        const usageResponse = await fetch("/api/usage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tool: "pdf_merge", inputBytes, metadata: { action: "images_to_pdf", files: items.length } }),
        })
        const nextUsage = await usageResponse.json()
        setUsage(nextUsage)
        if (!usageResponse.ok) {
          setError(nextUsage.message ?? "Please sign in to continue.")
          return
        }

        const pdf = await PDFDocument.create()
        for (const item of items) {
          const file = item.file
          const bytes = await file.arrayBuffer()
          const dims = await imageDimensions(file)
          const image = file.type === "image/png" ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes)
          const page = pdf.addPage([dims.width, dims.height])
          page.drawImage(image, { x: 0, y: 0, width: dims.width, height: dims.height })
        }
        const bytes = await pdf.save()
        const pdfBytes = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
        if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current)
        const url = URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }))
        resultUrlRef.current = url
        setResult({ url, name: "images.pdf", size: bytes.byteLength, pages: items.length })
        recordRecentJob({ tool: "Images to PDF", fileName: `${items.length} images`, inputBytes, outputBytes: bytes.byteLength, summary: `${items.length} pages created` })
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : "Could not create this PDF. JPG and PNG work best.")
      }
    })
  }

  return (
    <section className="py-14">
      <div className="max-w-3xl">
        <Badge variant="privacy" className="rounded-full"><ImagesSquare weight="fill" /> Images to PDF</Badge>
        <h1 className="mt-5 font-heading text-5xl font-black tracking-[-0.05em] text-slate-950">Turn images into one PDF.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">Add images in order and download a clean PDF.</p>
      </div>

      <div id="tool-workspace" className="mt-10 scroll-mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <Card className="rounded-[2rem] border-white/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur">
          <CardHeader><CardTitle>PDF settings</CardTitle><CardDescription>JPG and PNG images work best.</CardDescription></CardHeader>
          <CardContent className="space-y-6">
            <div><Label htmlFor="images">Images</Label><div className="mt-2"><FileDropzone id="images" title="Drop images here" description="Select one or more images in the order you want." accept="image/jpeg,image/png,.jpg,.jpeg,.png" multiple onFiles={chooseFiles} /></div></div>
            {items.length ? (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-[4.5rem_1fr] gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-sm">
                    <div className="overflow-hidden rounded-xl bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.previewUrl} alt={item.file.name} className="aspect-square w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-slate-950">Page {index + 1}</div>
                          <div className="truncate text-slate-500">{item.file.name}</div>
                          <div className="mt-1 text-xs text-slate-500">{formatBytes(item.file.size)}</div>
                        </div>
                        <div className="flex shrink-0 gap-1">
                          <Button variant="outline" size="icon" className="size-8 rounded-full bg-white" disabled={index === 0} onClick={() => moveImage(item.id, -1)}><ArrowUp className="size-4" /></Button>
                          <Button variant="outline" size="icon" className="size-8 rounded-full bg-white" disabled={index === items.length - 1} onClick={() => moveImage(item.id, 1)}><ArrowDown className="size-4" /></Button>
                          <Button variant="outline" size="icon" className="size-8 rounded-full bg-white text-rose-700" onClick={() => removeImage(item.id)}><Trash className="size-4" /></Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
            {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div> : null}
            <Button className="h-12 w-full rounded-full" disabled={!items.length || isPending || usage?.requiresLogin} onClick={convertImages}>{isPending ? "Creating..." : "Create PDF"}</Button>
            {usage ? <p className="text-center text-xs text-slate-500">Anonymous usage: {usage.used}/{usage.limit} today. {usage.remaining} remaining.</p> : null}
          </CardContent>
        </Card>
        <Card className="rounded-[2rem] border-white/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur"><CardHeader><CardTitle>Result</CardTitle><CardDescription>Download when ready.</CardDescription></CardHeader><CardContent className="space-y-5"><div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50 text-center text-slate-500">{result ? <iframe src={result.url} title="PDF preview" className="aspect-video w-full" /> : <div className="flex aspect-video flex-col items-center justify-center"><FilePdf className="size-12" weight="duotone" /><p className="mt-3 text-sm">Your PDF will appear here.</p></div>}</div>{result ? <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4"><p className="text-sm font-medium text-emerald-950">{result.pages} pages ready: {formatBytes(result.size)}</p><Button asChild className="mt-4 h-11 w-full rounded-full"><a href={result.url} download={result.name}><DownloadSimple className="size-4" /> Download PDF</a></Button></div> : null}</CardContent></Card>
      </div>
    </section>
  )
}
