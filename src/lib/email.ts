import { Resend } from "resend"

import { env } from "@/env"

let resend: Resend | null = null

function getResend() {
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is required to send emails.")
  }

  resend ??= new Resend(env.RESEND_API_KEY)
  return resend
}

function emailLayout(input: {
  eyebrow: string
  title: string
  body: string
  action?: string
  footer?: string
}) {
  return `
    <div style="margin:0;background:#f8f4e8;padding:32px 16px;font-family:Inter,Arial,sans-serif;color:#0f172a;">
      <div style="max-width:600px;margin:0 auto;border:1px solid rgba(15,23,42,0.08);background:rgba(255,255,255,0.92);border-radius:28px;overflow:hidden;box-shadow:0 24px 80px rgba(15,23,42,0.12);">
        <div style="height:8px;background:linear-gradient(90deg,#22d3ee,#34d399,#fbbf24);"></div>
        <div style="padding:36px;">
          <div style="font-size:26px;font-weight:900;letter-spacing:-0.05em;color:#0f172a;">BytePress</div>
          <div style="margin-top:32px;font-size:12px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#047857;">${input.eyebrow}</div>
          <h1 style="font-size:32px;line-height:1.12;margin:12px 0 12px;font-weight:900;letter-spacing:-0.04em;color:#0f172a;">${input.title}</h1>
          <p style="font-size:16px;line-height:1.75;color:#475569;margin:0 0 28px;">${input.body}</p>
          ${input.action ? `<div style="display:inline-block;border:1px solid rgba(15,23,42,0.08);background:#0f172a;color:white;border-radius:22px;padding:18px 24px;font-size:30px;letter-spacing:0.3em;font-weight:900;">${input.action}</div>` : ""}
          <p style="font-size:13px;line-height:1.65;color:#64748b;margin:30px 0 0;">${input.footer ?? "If you did not request this email, you can safely ignore it."}</p>
        </div>
      </div>
    </div>
  `
}

export async function sendOtpEmail(input: {
  email: string
  otp: string
  type: "sign-in" | "email-verification" | "forget-password" | "change-email"
}) {
  const isReset = input.type === "forget-password"

  await getResend().emails.send({
    from: env.EMAIL_FROM,
    to: input.email,
    subject: isReset ? "Reset your BytePress password" : "Verify your BytePress email",
    html: emailLayout({
      eyebrow: isReset ? "Password reset" : "Email verification",
      title: isReset ? "Use this code to reset your password" : "Use this code to finish your account",
      body: isReset
        ? "Enter this code on the password reset page to choose a new password. The code expires soon for your security."
        : "Enter this code on BytePress to verify your email address and complete account creation.",
      action: input.otp,
    }),
    text: `Your BytePress code is ${input.otp}`,
  })
}
