import Link from "next/link"
import { ShieldCheckIcon, CpuIcon } from "@phosphor-icons/react/dist/ssr"

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border bg-background/80 backdrop-blur px-4 py-10 sm:px-6 lg:px-8 text-xs text-muted-foreground">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5 pb-8 border-b border-border/60">
          <div className="md:col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2.5 font-heading text-lg font-bold text-foreground">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CpuIcon className="size-4" weight="duotone" />
              </span>
              BytePress Studio
            </Link>
            <p className="text-xs leading-relaxed max-w-sm text-muted-foreground">
              Zero-server-upload file engineering suite. All operations run directly inside your web browser for speed, unlimited usage, and total data privacy.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-[11px] text-foreground">
              <ShieldCheckIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" weight="fill" />
              Private and direct document processing
            </div>
          </div>

          <div>
            <p className="font-semibold text-foreground uppercase tracking-wider text-[11px] mb-3">PDF Suite</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tools/pdf-compress#tool-workspace" className="hover:text-foreground transition-colors">
                  PDF Compressor
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-merge#tool-workspace" className="hover:text-foreground transition-colors">
                  PDF Merge
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-split#tool-workspace" className="hover:text-foreground transition-colors">
                  PDF Split
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-organize#tool-workspace" className="hover:text-foreground transition-colors">
                  Organize Pages
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-page-numbers#tool-workspace" className="hover:text-foreground transition-colors">
                  Add Page Numbers
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-protect#tool-workspace" className="hover:text-foreground transition-colors">
                  Protect PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-viewer#tool-workspace" className="hover:text-foreground transition-colors">
                  PDF Viewer
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-foreground uppercase tracking-wider text-[11px] mb-3">Image Suite</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tools/image-compress#tool-workspace" className="hover:text-foreground transition-colors">
                  Image Compressor
                </Link>
              </li>
              <li>
                <Link href="/tools/image-resize#tool-workspace" className="hover:text-foreground transition-colors">
                  Image Resizer
                </Link>
              </li>
              <li>
                <Link href="/tools/image-convert#tool-workspace" className="hover:text-foreground transition-colors">
                  Image Format Converter
                </Link>
              </li>
              <li>
                <Link href="/tools/images-to-pdf#tool-workspace" className="hover:text-foreground transition-colors">
                  Images to PDF
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-semibold text-foreground uppercase tracking-wider text-[11px] mb-3">BytePress</p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/tools" className="hover:text-foreground transition-colors">
                  All Document Tools
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-compress" className="hover:text-foreground transition-colors">
                  Compress Documents
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-merge" className="hover:text-foreground transition-colors">
                  Combine Files
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {year} BytePress. Fast and simple document tools.</p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
