import { drizzleAdapter } from "@better-auth/drizzle-adapter"
import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"
import { emailOTP } from "better-auth/plugins"

import { getDb } from "@/db"
import * as schema from "@/db/schema"
import { sendOtpEmail } from "@/lib/email"
import { env } from "@/env"

const db = getDb()

export const auth = betterAuth({
  appName: env.NEXT_PUBLIC_APP_NAME,
  baseURL: env.NEXT_PUBLIC_APP_URL,
  secret: env.AUTH_SECRET ?? "dev-only-replace-before-production",
  database: db
    ? drizzleAdapter(db, {
        provider: "pg",
        schema,
      })
    : undefined,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders:
    env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          },
        }
      : undefined,
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 60 * 10,
      allowedAttempts: 5,
      sendVerificationOnSignUp: true,
      sendVerificationOTP: async ({ email, otp, type }) => {
        await sendOtpEmail({ email, otp, type })
      },
    }),
    nextCookies(),
  ],
})
