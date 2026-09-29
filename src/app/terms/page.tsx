import type { Metadata } from "next"
import Link from "next/link"
import { Scales, CheckCircle, Warning, FileText } from "@phosphor-icons/react/dist/ssr"

import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Terms of Service - BytePress",
  description: "Read the BytePress Terms of Service regarding acceptable use, user content ownership, and service availability.",
}

export default function TermsPage() {
  const lastUpdated = "September 2026"

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader nav={[{ href: "/tools", label: "All Tools" }, { href: "/terms", label: "Terms of Service" }]} />

      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border/70 bg-muted/20 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">
              <Scales className="size-4" weight="fill" />
              Legal Terms
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Terms of Service
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
            {/* Principles Grid */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                  <FileText className="size-5" weight="duotone" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">Your Files, Your Rights</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-normal">
                  You retain 100% ownership and copyright over all documents, photos, and files processed.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                  <CheckCircle className="size-5" weight="duotone" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">Fair & Lawful Use</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-normal">
                  Use our tools freely for personal, professional, and educational file preparation tasks.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                  <Warning className="size-5" weight="duotone" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">As-Is Utility</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-normal">
                  Provided free of charge without warranties; always verify outputs before discarding originals.
                </p>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">
                1. Acceptance of Terms
              </h2>
              <p>
                By visiting, accessing, or using the website BytePress (the &quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of these Terms, you may discontinue use of the Service immediately.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">
                2. Description of Service
              </h2>
              <p>
                BytePress provides digital utilities for inspecting, converting, compressing, reordering, and securing PDF and image files. The Service operates primarily on client-side browser technology without mandatory account creation or recurring subscription fees.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">
                3. User Content & Intellectual Property
              </h2>
              <p>
                We claim no intellectual property or ownership rights over the files, text, images, or documents you submit to the Service:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-foreground">Ownership:</strong> All ownership, copyright, and distribution rights remain solely with you or the lawful copyright holders.
                </li>
                <li>
                  <strong className="text-foreground">No File Storage:</strong> BytePress does not host, publish, broadcast, or sell your uploaded content.
                </li>
                <li>
                  <strong className="text-foreground">Responsibility:</strong> You represent and warrant that you possess the necessary rights and permissions to modify and process any files you load into the Service.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">
                4. Acceptable Use
              </h2>
              <p>
                You agree not to use the Service:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>For any unlawful purpose or in violation of any applicable local, national, or international law.</li>
                <li>To attempt to reverse engineer, disrupt, overload, or launch denial-of-service attacks against our infrastructure.</li>
                <li>To distribute malicious software, viruses, or harmful payloads via modified document files.</li>
                <li>To bypass rate limiting or automated query protection mechanisms.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">
                5. Disclaimer of Warranties
              </h2>
              <p>
                The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
              </p>
              <p>
                We do not warrant that the results obtained from using our document tools will be error-free or uninterrupted. Always maintain independent backups of your important files before using compression or reorganization tools.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">
                6. Limitation of Liability
              </h2>
              <p>
                In no event shall BytePress, its creators, or contributors be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of data, loss of business, or file corruption arising out of or related to your use of the Service.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">
                7. Modifications to the Service and Terms
              </h2>
              <p>
                We reserve the right to alter, suspend, or discontinue any feature of the Service at any time without notice. Continued use of the Service following any updates to these Terms constitutes your acceptance of the revised Terms.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground">
                8. Contact
              </h2>
              <p>
                If you have questions about these Terms, feel free to visit our{" "}
                <Link href="/privacy" className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">
                  Privacy Policy
                </Link>{" "}
                or explore all available utilities on the{" "}
                <Link href="/tools" className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">
                  Tools Page
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
