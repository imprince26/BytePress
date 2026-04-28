import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"

import {
  anonymousIdCookie,
  getAnonymousDailyLimit,
  getAnonymousUsageCount,
  localUsageCookie,
  parseLocalUsage,
  recordAnonymousUsage,
} from "@/lib/usage"

const usageSchema = z.object({
  tool: z.enum([
    "image_compress",
    "image_convert",
    "image_resize",
    "pdf_merge",
    "pdf_split",
    "pdf_compress",
    "pdf_to_word",
    "word_to_pdf",
  ]),
  inputBytes: z.number().int().nonnegative().optional(),
  outputBytes: z.number().int().nonnegative().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  }
}

export async function GET() {
  const cookieStore = await cookies()
  const anonymousId =
    cookieStore.get(anonymousIdCookie)?.value ?? crypto.randomUUID()
  const limit = getAnonymousDailyLimit()
  const dbCount = await getAnonymousUsageCount(anonymousId)
  const localUsage = parseLocalUsage(cookieStore.get(localUsageCookie)?.value)
  const used = dbCount ?? localUsage.count

  const response = NextResponse.json({
    limit,
    used,
    remaining: Math.max(limit - used, 0),
    requiresLogin: used >= limit,
  })

  response.cookies.set(anonymousIdCookie, anonymousId, {
    ...cookieOptions(),
    maxAge: 60 * 60 * 24 * 365,
  })

  return response
}

export async function POST(request: Request) {
  const parsed = usageSchema.safeParse(await request.json())

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid usage payload" },
      { status: 400 }
    )
  }

  const cookieStore = await cookies()
  const anonymousId =
    cookieStore.get(anonymousIdCookie)?.value ?? crypto.randomUUID()
  const limit = getAnonymousDailyLimit()
  const dbCount = await getAnonymousUsageCount(anonymousId)
  const localUsage = parseLocalUsage(cookieStore.get(localUsageCookie)?.value)
  const used = dbCount ?? localUsage.count

  if (used >= limit) {
    const response = NextResponse.json(
      {
        limit,
        used,
        remaining: 0,
        requiresLogin: true,
        message: "Daily anonymous limit reached. Please sign in to continue.",
      },
      { status: 429 }
    )
    response.cookies.set(anonymousIdCookie, anonymousId, {
      ...cookieOptions(),
      maxAge: 60 * 60 * 24 * 365,
    })
    return response
  }

  await recordAnonymousUsage({
    anonymousId,
    ...parsed.data,
  })

  const nextUsed = used + 1
  const response = NextResponse.json({
    limit,
    used: nextUsed,
    remaining: Math.max(limit - nextUsed, 0),
    requiresLogin: nextUsed >= limit,
  })

  response.cookies.set(anonymousIdCookie, anonymousId, {
    ...cookieOptions(),
    maxAge: 60 * 60 * 24 * 365,
  })

  if (dbCount === null) {
    response.cookies.set(localUsageCookie, `${localUsage.date}:${nextUsed}`, {
      ...cookieOptions(),
      maxAge: 60 * 60 * 24,
    })
  }

  return response
}
