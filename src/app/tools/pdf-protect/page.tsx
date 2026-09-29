import type { Metadata } from "next"

import { PdfProtectTool } from "./pdf-protect-tool"

export const metadata: Metadata = {
  title: "Protect PDF Online - Encrypt PDF with Password",
  description: "Secure confidential PDF files with standard AES-256 password protection and encryption.",
}

export default function PdfProtectPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PdfProtectTool />
    </div>
  )
}
