"use client"

import { useState, useTransition } from "react"
import {
  EyeIcon,
  EyeSlashIcon,
  FilePdfIcon,
  LockKeyIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDropzone } from "@/components/file-dropzone"
import { FileSaveBar } from "@/components/file-save-bar"
import { ToolProcessingState } from "@/components/tool-skeleton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatBytes } from "@/lib/file-format"
import { protectPdf, type ProtectPdfResult } from "@/lib/pdf-protect"
import { validatePdfFiles } from "@/lib/pdf-tools"

export function PdfProtectTool() {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [result, setResult] = useState<ProtectPdfResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleFileSelect(selectedFiles: FileList | null) {
    setError(null)
    setResult(null)

    const list = Array.from(selectedFiles ?? [])
    if (!list.length) {
      setFile(null)
      return
    }

    const validationError = validatePdfFiles(list)
    if (validationError) {
      setError(validationError)
      setFile(null)
      return
    }

    setFile(list[0])
  }

  function handleProtect() {
    if (!file) {
      setError("Please select a PDF document first.")
      return
    }

    if (!password || password.trim().length < 3) {
      setError("Password must be at least 3 characters long.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.")
      return
    }

    setError(null)
    startTransition(async () => {
      try {
        const protectedDoc = await protectPdf({
          file,
          password,
        })
        setResult(protectedDoc)
        toast.success("PDF encrypted and protected successfully!")
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to protect PDF.")
      }
    })
  }

  return (
    <section className="space-y-6">
      {/* Tool Header */}
      <div className="space-y-1.5">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Protect PDF
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Encrypt your PDF with a password so only authorized viewers can open it.
        </p>
      </div>

      <div id="tool-workspace" className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Column */}
        <Card className="rounded-xl border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Document & Password</CardTitle>
            <CardDescription className="text-xs">
              Upload your PDF and set a security password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <FileDropzone
              id="pdf-protect-input"
              title={file ? file.name : "Select or drop a PDF file"}
              description={file ? `File size: ${formatBytes(file.size)}` : "PDF files up to 50 MB"}
              accept="application/pdf"
              onFiles={(files) => handleFileSelect(files)}
            />

            {/* Passwords */}
            <div className="space-y-3 pt-1">
              <div>
                <Label htmlFor="pdf-pass" className="text-xs font-semibold text-foreground">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="pdf-pass"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="pr-10 h-9 text-xs bg-background"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeSlashIcon className="size-4" /> : <EyeIcon className="size-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="pdf-confirm-pass" className="text-xs font-semibold text-foreground">
                  Confirm Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="pdf-confirm-pass"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="h-9 text-xs bg-background"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <WarningCircleIcon className="size-4 shrink-0" weight="fill" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="button"
              onClick={handleProtect}
              disabled={!file || isPending}
              className="h-10 w-full rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <LockKeyIcon className="size-4" weight="bold" />
              <span>{isPending ? "Encrypting PDF..." : "Protect PDF"}</span>
            </Button>
          </CardContent>
        </Card>

        {/* Right Column */}
        <Card className="rounded-xl border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold">Protected Output</CardTitle>
            <CardDescription className="text-xs">
              Save your encrypted document.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPending ? (
              <ToolProcessingState
                title="Encrypting PDF with AES-256..."
                description="Applying password protection."
              />
            ) : result ? (
              <>
                <div className="rounded-lg border border-border bg-muted/20 p-3.5 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <FilePdfIcon className="size-5" weight="duotone" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{result.name}</p>
                    <p className="text-[11px] text-muted-foreground">{formatBytes(result.size)} • Encrypted</p>
                  </div>
                </div>

                <FileSaveBar
                  fileUrl={result.url}
                  defaultFileName={result.name}
                  fileSize={result.size}
                  originalSize={file ? file.size : undefined}
                  mimeType="application/pdf"
                  isPdf={true}
                />
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                <LockKeyIcon className="size-8 mx-auto mb-2 text-muted-foreground/40" weight="duotone" />
                Upload a PDF, set your password, and click &quot;Protect PDF&quot; to download the secured file.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
