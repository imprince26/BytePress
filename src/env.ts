import { z } from "zod"

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("BytePress"),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().int().positive().default(50),
})

export const env = envSchema.parse(process.env)
