"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { DownloadSimple, FilePdf, Scissors } from "@phosphor-icons/react"
import { PDFDocument } from "pdf-lib"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileDropzone } from "@/components/file-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatBytes } from "@/lib/file-format"
import { parsePageRanges, validatePdfFiles } from "@/lib/pdf-tools"
import { recordRecentJob } from "@/lib/recent-jobs"

type Usage = { limit: number; used: number; remaining: number; requiresLogin: boolean }
type Result = { url: string; name: string; size: number; pages: number }

export function PdfSplitTool() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [range, setRange] = useState("1")
  const [usage, setUsage] = useState<Usage | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const resultUrlRef = useRef<string | null>(null)

  useEffect(() => {
    fetch("/api/usage").then((response) => response.json()).then(setUsage).catch(() => setUsage(null))
  }, [])

  useEffect(() => {
    return () => {
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current)
    }
  }, [])

  function chooseFile(nextFile: File | null) {
    setError(null)
    setResult(null)
    setPageCount(null)

    const validationError = validatePdfFiles(nextFile ? [nextFile] : [])
    if (validationError) {
      setFile(null)
      setError(validationError)
      return
    }

    setFile(nextFile)
    if (nextFile) {
      startTransition(async () => {
        try {
          const pdf = await PDFDocument.load(await nextFile.arrayBuffer())
          setPageCount(pdf.getPageCount())
          setRange(`1-${pdf.getPageCount()}`)
        } catch {
          setError("Could not read this PDF.")
        }
      })
    }
  }

  function splitPdf() {
    if (!file || !pageCount) {
      setError("Choose a PDF first.")
      return
    }

    startTransition(async () => {
      try {
        setError(null)
        const selectedPages = parsePageRanges(range, pageCount)
        const usageResponse = await fetch("/api/usage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tool: "pdf_split", inputBytes: file.size, metadata: { pages: selectedPages.length, range } }),
        })
        const nextUsage = await usageResponse.json()
        setUsage(nextUsage)
        if (!usageResponse.ok) {
          setError(nextUsage.message ?? "Please sign in to continue.")
          return
        }

        const source = await PDFDocument.load(await file.arrayBuffer())
        const output = await PDFDocument.create()
        const copiedPages = await output.copyPages(source, selectedPages)
        copiedPages.forEach((page) => output.addPage(page))
        const bytes = await output.save()
        if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current)
        const pdfBytes = bytes.buffer.slice(
          bytes.byteOffset,
          bytes.byteOffset + bytes.byteLength
        ) as ArrayBuffer
        const url = URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }))
        resultUrlRef.current = url
        setResult({ url, name: file.name.replace(/\.pdf$/i, "-split.pdf"), size: bytes.byteLength, pages: copiedPages.length })
        recordRecentJob({
          tool: "PDF Split",
          fileName: file.name,
          inputBytes: file.size,
          outputBytes: bytes.byteLength,
          summary: `${copiedPages.length} pages extracted`,
        })
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : "Could not split this PDF.")
      }
    })
  }

  return (
    <section className="py-14">
      <div className="max-w-3xl">
        <Badge variant="privacy" className="rounded-full"><Scissors weight="fill" /> PDF split</Badge>
        <h1 className="mt-5 font-heading text-5xl font-black tracking-[-0.05em] text-slate-950">Extract the pages you need.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">Pick a PDF, enter page ranges, and download a new document.</p>
      </div>

      <div id="tool-workspace" className="mt-10 scroll-mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <Card className="rounded-[2rem] border-white/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur">
          <CardHeader><CardTitle>Split settings</CardTitle><CardDescription>Use ranges like 1-3, 5, 8-10.</CardDescription></CardHeader>
          <CardContent className="space-y-6">
            <div><Label htmlFor="pdf">PDF file</Label><div className="mt-2"><FileDropzone id="pdf" title="Drop a PDF here" description="Choose the PDF you want to split." accept="application/pdf,.pdf" onFiles={(files) => chooseFile(files?.[0] ?? null)} /></div></div>
            <div><Label htmlFor="range">Pages {pageCount ? `(1-${pageCount})` : ""}</Label><Input id="range" className="mt-2 bg-white" value={range} onChange={(event) => setRange(event.target.value)} placeholder="1-3, 5" /></div>
            {file ? <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600"><span className="font-semibold text-slate-950">{file.name}</span><br />{formatBytes(file.size)}{pageCount ? ` • ${pageCount} pages` : ""}</div> : null}
            {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div> : null}
            <Button className="h-12 w-full rounded-full" disabled={!file || !pageCount || isPending || usage?.requiresLogin} onClick={splitPdf}>{isPending ? "Preparing..." : "Split PDF"}</Button>
            {usage ? <p className="text-center text-xs text-slate-500">Anonymous usage: {usage.used}/{usage.limit} today. {usage.remaining} remaining.</p> : null}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur">
          <CardHeader><CardTitle>Result</CardTitle><CardDescription>Download when ready.</CardDescription></CardHeader>
          <CardContent className="space-y-5"><div className="flex aspect-video flex-col items-center justify-center rounded-[1.5rem] border border-slate-200 bg-slate-50 text-center text-slate-500"><FilePdf className="size-12" weight="duotone" /><p className="mt-3 text-sm">{result ? `${result.pages} pages ready` : "Your split PDF will appear here."}</p></div>{result ? <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4"><p className="text-sm font-medium text-emerald-950">Ready: {formatBytes(result.size)}</p><Button asChild className="mt-4 h-11 w-full rounded-full"><a href={result.url} download={result.name}><DownloadSimple className="size-4" /> Download PDF</a></Button></div> : null}</CardContent>
        </Card>
      </div>
    </section>
  )
}
