import type { Metadata } from "next"
import Link from "next/link"
import { ShieldCheck, LockKey, EyeSlash, FileText } from "@phosphor-icons/react/dist/ssr"

import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Privacy Policy - BytePress",
  description: "Learn how BytePress protects your privacy with client-side document processing and zero file storage.",
}

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 2026"

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader nav={[{ href: "/tools", label: "All Tools" }, { href: "/privacy", label: "Privacy Policy" }]} />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border/70 bg-muted/20 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="size-4" weight="fill" />
              Privacy & Security
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
            {/* Highlights Grid */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                  <LockKey className="size-5" weight="duotone" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">Client-Side Processing</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-normal">
                  Your files are processed directly inside your browser. Your sensitive files never reach our servers.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                  <EyeSlash className="size-5" weight="duotone" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">No File Retention</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-normal">
                  We do not save, store, index, or inspect any PDF or image files you process with our tools.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                  <FileText className="size-5" weight="duotone" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">No Account Needed</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-normal">
                  All tools are accessible without registration, email capture, or account creation.
                </p>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">
                1. Overview & Commitment
              </h2>
              <p>
                BytePress is committed to protecting your privacy. This policy outlines how information is handled when you access and utilize our web-based document and image utilities. Our core architectural design prioritizes on-device, client-side computation, ensuring that user documents remain private by default.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">
                2. Document and File Data
              </h2>
              <p>
                When you drag, drop, or select PDF documents, images, or graphics for compression, merging, splitting, rotation, encryption, or conversion:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-foreground">Local Execution:</strong> Processing calculations are performed in your browser using WebAssembly and client-side JavaScript libraries (such as PDF-Lib and PDF.js).
                </li>
                <li>
                  <strong className="text-foreground">Zero Server Uploads:</strong> Files remain in your device&apos;s memory and are not uploaded to remote databases or cloud storage infrastructure.
                </li>
                <li>
                  <strong className="text-foreground">Immediate Disposal:</strong> Once you close or reload the browser tab, all memory allocated for file manipulation is released.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">
                3. Information We Collect
              </h2>
              <p>
                Because BytePress requires no registration or authentication, we do not collect personal identifiers such as names, passwords, or payment records. We collect only minimal technical information necessary to maintain website availability:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-foreground">Network & Rate Limiting:</strong> Temporary IP addresses may be tracked in an in-memory sliding window to prevent automated service abuse, denial-of-service attempts, and server strain. These records are held in memory for a maximum of 15 minutes before being discarded.
                </li>
                <li>
                  <strong className="text-foreground">Browser LocalStorage:</strong> Certain client preferences (such as recent tool activity records or preferred view settings) are stored strictly on your local device. You can clear this data at any time via your browser settings.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">
                4. Cookies and Tracking
              </h2>
              <p>
                BytePress does not deploy third-party advertising cookies, cross-site trackers, or behavioral profiling mechanisms. Any cookies utilized are strictly functional and temporary.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">
                5. Third-Party Links
              </h2>
              <p>
                Our website may contain links to external sites or documentation. We are not responsible for the privacy practices or content of third-party platforms. We encourage you to review the privacy notices of any external site you visit.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">
                6. Changes to this Policy
              </h2>
              <p>
                We may periodically update this Privacy Policy to reflect technical improvements or legal requirements. Updated versions will be posted directly on this page with a revised effective date.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">
                7. Contact
              </h2>
              <p>
                If you have questions regarding this Privacy Policy or file security on BytePress, you can review our open source repository or return to the{" "}
                <Link href="/tools" className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">
                  Document Tools Suite
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>

    </div>
  )
}
