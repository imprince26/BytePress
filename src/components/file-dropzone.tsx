"use client"

import { useState } from "react"
import { UploadSimple } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

type FileDropzoneProps = {
  id: string
  title: string
  description: string
  accept: string
  multiple?: boolean
  onFiles: (files: FileList | null) => void
}

export function FileDropzone({
  id,
  title,
  description,
  accept,
  multiple,
  onFiles,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <label
      htmlFor={id}
      className={cn(
        "group flex cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50/80 p-7 text-center transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-white hover:shadow-xl hover:shadow-slate-900/5",
        isDragging && "border-cyan-400 bg-white shadow-xl shadow-cyan-900/10"
      )}
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault()
        setIsDragging(false)
        onFiles(event.dataTransfer.files)
      }}
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-800 transition-transform group-hover:scale-105">
        <UploadSimple className="size-7" weight="duotone" />
      </span>
      <span className="mt-4 font-heading text-lg font-black tracking-tight text-slate-950">
        {title}
      </span>
      <span className="mt-1 max-w-sm text-sm leading-6 text-slate-500">{description}</span>
      <span className="mt-4 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm">
        Browse files
      </span>
      <input
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(event) => onFiles(event.target.files)}
      />
    </label>
  )
}
