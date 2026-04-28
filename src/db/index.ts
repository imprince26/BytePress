import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

import * as schema from "@/db/schema"
import { env } from "@/env"

export function getDb() {
  if (!env.DATABASE_URL) {
    return null
  }

  return drizzle(neon(env.DATABASE_URL), { schema })
}

export type Db = NonNullable<ReturnType<typeof getDb>>
