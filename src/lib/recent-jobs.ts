export type RecentJob = {
  id: string
  tool: string
  fileName: string
  inputBytes?: number
  outputBytes?: number
  summary: string
  createdAt: string
}

const recentJobsKey = "bytepress_recent_jobs"
const maxRecentJobs = 12

export function getRecentJobs() {
  if (typeof window === "undefined") {
    return [] satisfies RecentJob[]
  }

  try {
    const value = window.localStorage.getItem(recentJobsKey)
    if (!value) {
      return [] satisfies RecentJob[]
    }

    return JSON.parse(value) as RecentJob[]
  } catch {
    return [] satisfies RecentJob[]
  }
}

export function recordRecentJob(job: Omit<RecentJob, "id" | "createdAt">) {
  if (typeof window === "undefined") {
    return
  }

  const nextJob: RecentJob = {
    ...job,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }

  const nextJobs = [nextJob, ...getRecentJobs()].slice(0, maxRecentJobs)
  window.localStorage.setItem(recentJobsKey, JSON.stringify(nextJobs))
}

export function clearRecentJobs() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(recentJobsKey)
  }
}
