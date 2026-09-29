import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"

/**
 * Sliding window IP-based rate limiter for tools that require server-side computation.
 * Browser-processed tools have zero usage restrictions or login gates.
 */

interface RateLimitRecord {
  count: number
  resetTime: number
}

// In-memory sliding window cache
const ipRateLimitMap = new Map<string, RateLimitRecord>()

const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 60 // 60 server operations per 15 min per IP

// Periodically clean expired records to prevent memory leak
setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of ipRateLimitMap.entries()) {
    if (now > record.resetTime) {
      ipRateLimitMap.delete(ip)
    }
  }
}, 5 * 60 * 1000)

const serverToolSchema = z.object({
  tool: z.string(),
  inputBytes: z.number().int().nonnegative().optional(),
})

async function getClientIp(): Promise<string> {
  const headerList = await headers()
  const forwarded = headerList.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  return (
    headerList.get("x-real-ip") ||
    headerList.get("cf-connecting-ip") ||
    "127.0.0.1"
  )
}

export async function GET() {
  const ip = await getClientIp()
  const now = Date.now()
  const record = ipRateLimitMap.get(ip)

  const used = record && now < record.resetTime ? record.count : 0
  const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - used)

  return NextResponse.json({
    status: "ok",
    browserToolsUnlimited: true,
    serverRateLimit: {
      limit: MAX_REQUESTS_PER_WINDOW,
      used,
      remaining,
      windowMinutes: 15,
    },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const parsed = serverToolSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid tool payload" },
        { status: 400 }
      )
    }

    const ip = await getClientIp()
    const now = Date.now()
    const record = ipRateLimitMap.get(ip)

    if (record && now < record.resetTime) {
      if (record.count >= MAX_REQUESTS_PER_WINDOW) {
        const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000)
        return NextResponse.json(
          {
            error: "Rate limit exceeded. Please wait before processing more server-intensive tasks.",
            retryAfter: retryAfterSeconds,
          },
          {
            status: 429,
            headers: {
              "Retry-After": retryAfterSeconds.toString(),
            },
          }
        )
      }
      record.count += 1
    } else {
      ipRateLimitMap.set(ip, {
        count: 1,
        resetTime: now + WINDOW_MS,
      })
    }

    const currentRecord = ipRateLimitMap.get(ip)!
    return NextResponse.json({
      success: true,
      remaining: Math.max(0, MAX_REQUESTS_PER_WINDOW - currentRecord.count),
    })
  } catch {
    return NextResponse.json(
      { error: "Server rate limiting error" },
      { status: 500 }
    )
  }
}
