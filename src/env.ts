import { z } from "zod"

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("CompressX"),
  DATABASE_URL: z.string().optional(),
  AUTH_SECRET: z.string().optional(),
  AUTH_TRUST_HOST: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  ANONYMOUS_DAILY_LIMIT: z.coerce.number().int().positive().default(5),
  USER_DAILY_LIMIT: z.coerce.number().int().positive().default(25),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().int().positive().default(50),
  TEMP_FILE_TTL_MINUTES: z.coerce.number().int().positive().default(30),
  PROCESSING_MODE: z.enum(["browser", "server", "hybrid"]).default("hybrid"),
  LOCAL_TEMP_DIR: z.string().default("./tmp/uploads"),
  WORKER_BASE_URL: z.string().url().optional(),
  WORKER_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("CompressX <hello@princepatel.me>"),
  RESEND_API_KEY: z.string().optional(),
})

export const env = envSchema.parse(process.env)
