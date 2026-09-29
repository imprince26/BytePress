import type { Metadata } from "next"

import { SiteHeader } from "@/components/site-header"
import { PdfProtectTool } from "./pdf-protect-tool"

export const metadata: Metadata = {
  title: "Protect PDF Online - Encrypt PDF with Password",
  description: "Secure confidential PDF files with standard AES-256 password protection and encryption.",
}

export default function PdfProtectPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader nav={[{ href: "/tools", label: "All Tools" }, { href: "/tools/pdf-protect", label: "Protect PDF" }]} />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <PdfProtectTool />
      </div>
    </main>
  )
}
