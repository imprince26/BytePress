"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { DownloadSimple, FilePdf, Plus } from "@phosphor-icons/react"
import { PDFDocument } from "pdf-lib"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatBytes } from "@/lib/file-format"
import { validatePdfFiles } from "@/lib/pdf-tools"

type Usage = { limit: number; used: number; remaining: number; requiresLogin: boolean }
type Result = { url: string; name: string; size: number; pages: number }

export function PdfMergeTool() {
  const [files, setFiles] = useState<File[]>([])
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

  function chooseFiles(nextFiles: FileList | null) {
    const selected = Array.from(nextFiles ?? [])
    const validationError = validatePdfFiles(selected)
    setResult(null)
    setError(validationError)
    setFiles(validationError ? [] : selected)
  }

  function mergePdfs() {
    if (files.length < 2) {
      setError("Choose at least two PDFs to merge.")
      return
    }

    startTransition(async () => {
      try {
        setError(null)
        const inputBytes = files.reduce((total, file) => total + file.size, 0)
        const usageResponse = await fetch("/api/usage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tool: "pdf_merge", inputBytes, metadata: { files: files.length } }),
        })
        const nextUsage = await usageResponse.json()
        setUsage(nextUsage)
        if (!usageResponse.ok) {
          setError(nextUsage.message ?? "Please sign in to continue.")
          return
        }

        const merged = await PDFDocument.create()
        let pageTotal = 0

        for (const file of files) {
          const source = await PDFDocument.load(await file.arrayBuffer())
          const copiedPages = await merged.copyPages(source, source.getPageIndices())
          copiedPages.forEach((page) => merged.addPage(page))
          pageTotal += copiedPages.length
        }

        const bytes = await merged.save()
        if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current)
        const pdfBytes = bytes.buffer.slice(
          bytes.byteOffset,
          bytes.byteOffset + bytes.byteLength
        ) as ArrayBuffer
        const url = URL.createObjectURL(new Blob([pdfBytes], { type: "application/pdf" }))
        resultUrlRef.current = url
        setResult({ url, name: "merged.pdf", size: bytes.byteLength, pages: pageTotal })
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : "Could not merge these PDFs.")
      }
    })
  }

  return (
    <section className="py-14">
      <div className="max-w-3xl">
        <Badge variant="privacy" className="rounded-full"><Plus weight="fill" /> PDF merge</Badge>
        <h1 className="mt-5 font-heading text-5xl font-black tracking-[-0.05em] text-slate-950">Combine PDFs into one file.</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">Select PDFs in the order you want and download one finished document.</p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <Card className="rounded-[2rem] border-white/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur">
          <CardHeader><CardTitle>Merge settings</CardTitle><CardDescription>Add two or more PDFs.</CardDescription></CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="pdfs">PDF files</Label>
              <Input id="pdfs" type="file" accept="application/pdf,.pdf" multiple className="mt-2 bg-white" onChange={(event) => chooseFiles(event.target.files)} />
            </div>
            {files.length ? <FileList files={files} /> : null}
            {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div> : null}
            <Button className="h-12 w-full rounded-full" disabled={files.length < 2 || isPending || usage?.requiresLogin} onClick={mergePdfs}>{isPending ? "Merging..." : "Merge PDFs"}</Button>
            {usage ? <p className="text-center text-xs text-slate-500">Anonymous usage: {usage.used}/{usage.limit} today. {usage.remaining} remaining.</p> : null}
          </CardContent>
        </Card>

        <ResultCard result={result} empty="Your merged PDF will appear here." />
      </div>
    </section>
  )
}

function FileList({ files }: { files: File[] }) {
  return <div className="space-y-2">{files.map((file, index) => <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-sm"><span className="truncate">{index + 1}. {file.name}</span><span className="shrink-0 text-slate-500">{formatBytes(file.size)}</span></div>)}</div>
}

function ResultCard({ result, empty }: { result: Result | null; empty: string }) {
  return <Card className="rounded-[2rem] border-white/70 bg-white/80 shadow-xl shadow-slate-900/5 backdrop-blur"><CardHeader><CardTitle>Result</CardTitle><CardDescription>Download when ready.</CardDescription></CardHeader><CardContent className="space-y-5"><div className="flex aspect-video flex-col items-center justify-center rounded-[1.5rem] border border-slate-200 bg-slate-50 text-center text-slate-500"><FilePdf className="size-12" weight="duotone" /><p className="mt-3 text-sm">{result ? `${result.pages} pages ready` : empty}</p></div>{result ? <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-4"><p className="text-sm font-medium text-emerald-950">Ready: {formatBytes(result.size)}</p><Button asChild className="mt-4 h-11 w-full rounded-full"><a href={result.url} download={result.name}><DownloadSimple className="size-4" /> Download PDF</a></Button></div> : null}</CardContent></Card>
}
