"use client"

import { useSyncExternalStore } from "react"
import { ClockCounterClockwise, Trash } from "@phosphor-icons/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatBytes } from "@/lib/file-format"
import { clearRecentJobs, getRecentJobs, RecentJob } from "@/lib/recent-jobs"

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}

function getRecentJobsSnapshot() {
  return JSON.stringify(getRecentJobs())
}

export function RecentJobs() {
  const snapshot = useSyncExternalStore(
    subscribeToStorage,
    getRecentJobsSnapshot,
    () => "[]"
  )
  const jobs = JSON.parse(snapshot) as RecentJob[]

  function clearJobs() {
    clearRecentJobs()
    window.dispatchEvent(new StorageEvent("storage"))
    toast.success("Recent jobs cleared")
  }

  return (
    <Card className="rounded-[2rem] border-white/70 bg-white/80 shadow-sm backdrop-blur">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Recent jobs</CardTitle>
          <CardDescription>Metadata-only activity from this browser.</CardDescription>
        </div>
        {jobs.length ? (
          <Button variant="outline" size="sm" className="rounded-full bg-white" onClick={clearJobs}>
            <Trash className="size-4" /> Clear
          </Button>
        ) : null}
      </CardHeader>
      <CardContent>
        {jobs.length ? (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="font-semibold text-slate-950">{job.tool}</div>
                    <div className="mt-1 max-w-xl truncate text-sm text-slate-500">{job.fileName}</div>
                    <div className="mt-2 text-sm text-slate-600">{job.summary}</div>
                  </div>
                  <div className="shrink-0 text-sm text-slate-500">
                    {job.outputBytes ? formatBytes(job.outputBytes) : job.inputBytes ? formatBytes(job.inputBytes) : "Ready"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-40 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 text-center text-slate-500">
            <ClockCounterClockwise className="size-10" weight="duotone" />
            <p className="mt-3 text-sm">Completed jobs will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
