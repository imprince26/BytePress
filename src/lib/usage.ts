import { and, count, eq, gte } from "drizzle-orm"

import { getDb } from "@/db"
import { usageEvent } from "@/db/schema"
import { env } from "@/env"

export type ToolType = typeof usageEvent.$inferInsert.tool

export const anonymousIdCookie = "bytepress_anonymous_id"
export const localUsageCookie = "bytepress_usage"

export function startOfToday() {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now
}

export function getAnonymousDailyLimit() {
  return env.ANONYMOUS_DAILY_LIMIT
}

export function parseLocalUsage(value: string | undefined) {
  const today = startOfToday().toISOString().slice(0, 10)

  if (!value) {
    return { date: today, count: 0 }
  }

  const [date, rawCount] = value.split(":")
  const parsedCount = Number(rawCount)

  if (date !== today || !Number.isFinite(parsedCount)) {
    return { date: today, count: 0 }
  }

  return { date, count: parsedCount }
}

export async function getAnonymousUsageCount(anonymousId: string) {
  const db = getDb()

  if (!db) {
    return null
  }

  const [result] = await db
    .select({ value: count() })
    .from(usageEvent)
    .where(
      and(
        eq(usageEvent.anonymousId, anonymousId),
        gte(usageEvent.createdAt, startOfToday())
      )
    )

  return result?.value ?? 0
}

export async function recordAnonymousUsage(input: {
  anonymousId: string
  tool: ToolType
  inputBytes?: number
  outputBytes?: number
  metadata?: Record<string, unknown>
}) {
  const db = getDb()

  if (!db) {
    return
  }

  await db.insert(usageEvent).values({
    id: crypto.randomUUID(),
    anonymousId: input.anonymousId,
    tool: input.tool,
    inputBytes: input.inputBytes,
    outputBytes: input.outputBytes,
    metadata: input.metadata,
  })
}
