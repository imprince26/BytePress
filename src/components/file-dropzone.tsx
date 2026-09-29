"use client"

import { useEffect, useRef, useState } from "react"
import { UploadSimpleIcon, FilePlusIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

type FileDropzoneProps = {
  id: string
  title: string
  description: string
  accept: string
  multiple?: boolean
  onFiles: (files: FileList | null) => void
  className?: string
  enablePageDrop?: boolean
}

export function FileDropzone({
  id,
  title,
  description,
  accept,
  multiple = false,
  onFiles,
  className,
  enablePageDrop = true,
}: FileDropzoneProps) {
  const [isHoverDragging, setIsHoverDragging] = useState(false)
  const [isPageDragging, setIsPageDragging] = useState(false)
  const dragCounter = useRef(0)

  // Full-page drag and drop listener
  useEffect(() => {
    if (!enablePageDrop) return

    const handleWindowDragEnter = (e: DragEvent) => {
      e.preventDefault()
      if (e.dataTransfer?.types?.includes("Files")) {
        dragCounter.current += 1
        setIsPageDragging(true)
      }
    }

    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault()
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = "copy"
      }
    }

    const handleWindowDragLeave = (e: DragEvent) => {
      e.preventDefault()
      dragCounter.current -= 1
      if (dragCounter.current <= 0) {
        dragCounter.current = 0
        setIsPageDragging(false)
      }
    }

    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault()
      dragCounter.current = 0
      setIsPageDragging(false)
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        onFiles(e.dataTransfer.files)
      }
    }

    window.addEventListener("dragenter", handleWindowDragEnter)
    window.addEventListener("dragover", handleWindowDragOver)
    window.addEventListener("dragleave", handleWindowDragLeave)
    window.addEventListener("drop", handleWindowDrop)

    return () => {
      window.removeEventListener("dragenter", handleWindowDragEnter)
      window.removeEventListener("dragover", handleWindowDragOver)
      window.removeEventListener("dragleave", handleWindowDragLeave)
      window.removeEventListener("drop", handleWindowDrop)
    }
  }, [enablePageDrop, onFiles])

  // Parse accept types for helpful format badges
  const formatBadges = accept
    .split(",")
    .map((item) => item.trim())
    .map((item) => {
      if (item === "application/pdf") return "PDF"
      if (item === "image/*") return "JPG, PNG, WEBP"
      if (item.startsWith("image/")) return item.replace("image/", "").toUpperCase()
      return item.toUpperCase()
    })
    .filter(Boolean)

  return (
    <>
      {/* Full-Page Drag Overlay */}
      {isPageDragging && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12 backdrop-blur-md bg-background/85 transition-all animate-in fade-in duration-150"
          onDragOver={(e) => {
            e.preventDefault()
            if (e.dataTransfer) e.dataTransfer.dropEffect = "copy"
          }}
          onDrop={(e) => {
            e.preventDefault()
            dragCounter.current = 0
            setIsPageDragging(false)
            if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
              onFiles(e.dataTransfer.files)
            }
          }}
        >
          <div className="w-full h-full max-w-4xl border-2 border-dashed border-primary bg-primary/[0.04] rounded-3xl flex flex-col items-center justify-center text-center p-8 pointer-events-none shadow-2xl">
            <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5 shadow-sm animate-pulse">
              <UploadSimpleIcon className="size-10" weight="bold" />
            </div>
            <p className="font-heading text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              Drop file anywhere to upload
            </p>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Release to instantly load and process your document in this tool.
            </p>
            {formatBadges.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {formatBadges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-md border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-mono font-semibold text-primary"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inline Dropzone Box */}
      <label
        htmlFor={id}
        className={cn(
          "group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/60 p-6 sm:p-8 text-center transition-all duration-200",
          "hover:border-primary/60 hover:bg-muted/40 hover:shadow-sm",
          isHoverDragging && "border-primary bg-primary/[0.04] ring-2 ring-primary/20",
          className
        )}
        onDragOver={(event) => {
          event.preventDefault()
          setIsHoverDragging(true)
        }}
        onDragLeave={() => setIsHoverDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setIsHoverDragging(false)
          onFiles(event.dataTransfer.files)
        }}
      >
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-200 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground shadow-xs">
          <FilePlusIcon className="size-7" weight="duotone" />
        </span>

        <span className="mt-4 font-heading text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
          {title}
        </span>

        <span className="mt-1 max-w-md text-xs sm:text-sm leading-relaxed text-muted-foreground">
          {description}
        </span>

        <div className="mt-4 flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground shadow-2xs group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:text-primary transition-all">
            <UploadSimpleIcon className="size-3.5" weight="bold" />
            <span>Browse Files</span>
          </span>
          <span className="text-[11px] text-muted-foreground hidden sm:inline">
            or drop file anywhere
          </span>
        </div>

        <input
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(event) => {
            onFiles(event.target.files)
            event.currentTarget.value = ""
          }}
        />
      </label>
    </>
  )
}
