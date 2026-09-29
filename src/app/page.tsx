import Link from "next/link"
import type { Metadata } from "next"
import {
  ArrowRightIcon,
  EyeIcon,
  FileArrowDownIcon,
  FilesIcon,
  HashStraightIcon,
  ImageSquareIcon,
  ImagesSquareIcon,
  LockKeyIcon,
  ScissorsIcon,
  SquaresFourIcon,
  ArrowsClockwiseIcon,
  ArrowsLeftRightIcon,
  ArrowsOutLineHorizontalIcon,
} from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TOOLS_LIST } from "@/config/tools"

export const metadata: Metadata = {
  title: "BytePress - Online PDF and Image Tools",
  description:
    "Compress, merge, split, organize, convert, and protect your PDF documents and images quickly and easily.",
}

const ICON_MAP: Record<string, React.ElementType> = {
  FileArrowDown: FileArrowDownIcon,
  Files: FilesIcon,
  Scissors: ScissorsIcon,
  SquaresFour: SquaresFourIcon,
  ArrowClockwise: ArrowsClockwiseIcon,
  HashStraight: HashStraightIcon,
  LockKey: LockKeyIcon,
  Eye: EyeIcon,
  ImageSquare: ImageSquareIcon,
  ArrowsOutLineHorizontal: ArrowsOutLineHorizontalIcon,
  ArrowsLeftRight: ArrowsLeftRightIcon,
  ImagesSquare: ImagesSquareIcon,
}

const POPULAR_ACTIONS = [
  { label: "Compress PDF", href: "/tools/pdf-compress" },
  { label: "Merge PDFs", href: "/tools/pdf-merge" },
  { label: "Split PDF", href: "/tools/pdf-split" },
  { label: "Compress Image", href: "/tools/image-compress" },
  { label: "Convert Image", href: "/tools/image-convert" },
  { label: "Organize Pages", href: "/tools/pdf-organize" },
]

const WORKFLOW = [
  {
    step: "1",
    title: "Choose a tool",
    desc: "Select the specific task you want to perform on your file.",
  },
  {
    step: "2",
    title: "Add your file",
    desc: "Drop or browse your document or image from your computer.",
  },
  {
    step: "3",
    title: "Adjust settings",
    desc: "Customize compression quality, page ranges, or dimensions.",
  },
  {
    step: "4",
    title: "Download result",
    desc: "Verify in the viewer and save your updated file with custom name.",
  },
]

export default function Home() {
  const pdfTools = TOOLS_LIST.filter((t) => t.category === "pdf" || t.category === "security")
  const imageTools = TOOLS_LIST.filter((t) => t.category === "image")

  return (
    <div className="bg-background">

      {/* Hero Section */}
      <section className="border-b border-border/70 bg-muted/20 px-4 py-16 sm:px-6 sm:py-24 lg:px-8 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Every tool you need for PDFs and images.
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            Compress, merge, split, convert, and organize your files with clean, fast, and simple tools that just work.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {POPULAR_ACTIONS.map((action) => (
              <Button
                key={action.label}
                asChild
                variant="outline"
                size="sm"
                className="rounded-full bg-card hover:bg-muted text-xs font-medium border-border"
              >
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-xl px-6 font-semibold bg-primary text-primary-foreground">
              <Link href="/tools">
                <span>View All Tools</span>
                <ArrowRightIcon className="size-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* PDF Suite Tools Section */}
      <section id="pdf" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-border/70 pb-4 mb-8">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              PDF Tools
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Tools to compress, merge, split, view, organize, and protect PDF files.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs font-semibold text-primary">
            <Link href="/tools#pdf">View all &rarr;</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pdfTools.map((tool) => {
            const Icon = ICON_MAP[tool.iconName] || FileArrowDownIcon
            return (
              <Link key={tool.id} href={tool.href} className="group">
                <Card className="h-full rounded-xl border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                      <Icon className="size-5" weight="duotone" />
                    </div>
                    <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/50 text-xs font-medium text-primary">
                    Open tool &rarr;
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Image Suite Tools Section */}
      <section id="image" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-border/70 pb-4 mb-8">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Image Tools
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Compress, resize, and convert image files with high quality.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs font-semibold text-primary">
            <Link href="/tools#image">View all &rarr;</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {imageTools.map((tool) => {
            const Icon = ICON_MAP[tool.iconName] || ImageSquareIcon
            return (
              <Link key={tool.id} href={tool.href} className="group">
                <Card className="h-full rounded-xl border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                      <Icon className="size-5" weight="duotone" />
                    </div>
                    <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/50 text-xs font-medium text-primary">
                    Open tool &rarr;
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="border-t border-border/70 bg-muted/20 px-4 py-16 sm:px-6 lg:px-8 mt-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Simple 4-Step Process
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Fast and straightforward from start to finish.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WORKFLOW.map((item) => (
              <div key={item.step} className="rounded-xl border border-border bg-card p-6 space-y-2 text-center sm:text-left">
                <span className="font-mono text-xl font-bold text-primary">{item.step}</span>
                <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
