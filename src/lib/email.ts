import { Resend } from "resend"

import { env } from "@/env"

let resend: Resend | null = null

function getResend() {
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is required to send magic links.")
  }

  resend ??= new Resend(env.RESEND_API_KEY)
  return resend
}

export async function sendMagicLinkEmail(input: { email: string; url: string }) {
  await getResend().emails.send({
    from: env.EMAIL_FROM,
    to: input.email,
    subject: "Sign in to CompressX",
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; color: #0f172a;">
        <div style="font-size: 24px; font-weight: 800; letter-spacing: -0.04em;">CompressX</div>
        <h1 style="font-size: 28px; line-height: 1.2; margin: 32px 0 12px;">Your sign-in link is ready</h1>
        <p style="font-size: 16px; line-height: 1.7; color: #475569; margin: 0 0 24px;">Use this secure link to open your CompressX workspace.</p>
        <a href="${input.url}" style="display: inline-block; background: #172554; color: #ffffff; padding: 14px 20px; border-radius: 999px; text-decoration: none; font-weight: 700;">Sign in</a>
        <p style="font-size: 13px; line-height: 1.6; color: #64748b; margin-top: 28px;">If you did not request this email, you can safely ignore it.</p>
      </div>
    `,
    text: `Sign in to CompressX: ${input.url}`,
  })
}
