import Link from "next/link"
import {
  ArrowRight,
  ArrowsClockwise,
  FilePdf,
  ImageSquare,
  MagicWand,
  Scissors,
  ShieldCheck,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const featuredTools = [
  {
    title: "Compress Images",
    description: "Reduce image file size with quality and target-size controls.",
    href: "/tools/image-compress",
    icon: ImageSquare,
    accent: "bg-cyan-100 text-cyan-800",
  },
  {
    title: "Resize Images",
    description: "Create exact dimensions for forms, websites, profiles, and sharing.",
    href: "/tools/image-resize",
    icon: ArrowsClockwise,
    accent: "bg-emerald-100 text-emerald-800",
  },
  {
    title: "Convert Images",
    description: "Switch between JPG, PNG, and WEBP in a few seconds.",
    href: "/tools/image-convert",
    icon: Sparkle,
    accent: "bg-amber-100 text-amber-800",
  },
  {
    title: "PDF Tools",
    description: "Merge PDFs and extract the pages you need.",
    href: "/tools/pdf-merge",
    icon: FilePdf,
    accent: "bg-rose-100 text-rose-800",
  },
]

const workflow = [
  "Choose a tool",
  "Drop your file",
  "Adjust settings",
  "Download the result",
]

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,oklch(0.94_0.07_176.24),transparent_30rem),radial-gradient(circle_at_bottom_right,oklch(0.93_0.08_78),transparent_26rem),linear-gradient(135deg,oklch(0.99_0.014_95.277),oklch(0.96_0.026_95.277))]">
      <div className="absolute left-1/2 top-16 h-96 w-96 -translate-x-1/2 rounded-full bg-white/60 blur-3xl" />
      <div className="absolute -right-24 top-40 h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl" />

      <SiteHeader
        nav={[
          { href: "#tools", label: "Tools" },
          { href: "#workflow", label: "Workflow" },
          { href: "#formats", label: "Formats" },
        ]}
      />

      <section className="relative z-10 mx-auto grid min-h-[calc(100svh-6.5rem)] w-full max-w-7xl items-center gap-10 px-6 pb-14 pt-8 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:pb-16 lg:pt-8">
        <div>
          <Badge variant="outline" className="rounded-full border-emerald-200 bg-white/75 text-emerald-800">
            <ShieldCheck weight="fill" /> File tools for people who care about control
          </Badge>

          <h1 className="mt-6 max-w-4xl font-heading text-4xl font-black tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl xl:text-7xl">
            Beautiful tools to compress, convert, resize, and organize your files.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
            CompressX brings everyday image and document utilities into one clean workspace, made for fast results and simple decisions.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full px-6 text-sm">
              <Link href="/tools">
                Start converting <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 rounded-full border-slate-300 bg-white/70 px-6 text-sm backdrop-blur">
              <Link href="/tools/image-compress">Compress image</Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm font-medium text-slate-700">
            <span className="rounded-full border border-white/70 bg-white/70 px-4 py-2 shadow-sm backdrop-blur">Images</span>
            <span className="rounded-full border border-white/70 bg-white/70 px-4 py-2 shadow-sm backdrop-blur">PDFs</span>
            <span className="rounded-full border border-white/70 bg-white/70 px-4 py-2 shadow-sm backdrop-blur">Word documents</span>
            <span className="rounded-full border border-white/70 bg-white/70 px-4 py-2 shadow-sm backdrop-blur">Fast downloads</span>
          </div>
        </div>

        <Card className="relative overflow-hidden rounded-[2.25rem] border-white/70 bg-white/80 shadow-2xl shadow-slate-900/10 backdrop-blur-xl lg:translate-y-4">
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300" />
          <CardHeader className="p-7">
            <Badge variant="outline" className="w-fit rounded-full bg-white/80">
              Smart workspace
            </Badge>
            <CardTitle className="text-2xl">Pick a file task and finish it fast</CardTitle>
            <CardDescription>
              Clear settings, instant previews, file-size summaries, and download-ready outputs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-7 pt-0">
            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/90 p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-800">
                    <ImageSquare className="size-6" weight="duotone" />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-950">Image toolkit</p>
                    <p className="text-sm text-slate-500">Compress, resize, convert</p>
                  </div>
                </div>
                <Badge variant="privacy" className="rounded-full">Ready</Badge>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MiniCard icon={MagicWand} title="Clean controls" text="Only the settings you need." />
              <MiniCard icon={Scissors} title="PDF workflow" text="Merge and split tools next." />
            </div>

            <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white shadow-lg">
              <p className="font-heading text-xl font-black">Designed for everyday files</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                A focused interface for school forms, work documents, social uploads, website assets, and quick sharing.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="tools" className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Badge variant="outline" className="rounded-full bg-white/70">
              Tools
            </Badge>
            <h2 className="mt-4 font-heading text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Everything starts from a simple action.
            </h2>
          </div>
          <Button asChild variant="outline" className="w-fit rounded-full bg-white/70">
            <Link href="/tools">View all tools</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featuredTools.map((tool) => {
            const Icon = tool.icon

            return (
              <Link key={tool.title} href={tool.href}>
                <Card className="group h-full rounded-[1.75rem] border-white/70 bg-white/75 shadow-sm backdrop-blur transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
                  <CardHeader>
                    <span className={`flex size-12 items-center justify-center rounded-2xl ${tool.accent}`}>
                      <Icon className="size-6" weight="duotone" />
                    </span>
                    <CardTitle>{tool.title}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      <section id="workflow" className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
        <Card className="overflow-hidden rounded-[2rem] border-white/70 bg-white/75 shadow-xl shadow-slate-900/5 backdrop-blur">
          <CardHeader className="p-8 sm:p-10">
            <Badge variant="outline" className="w-fit rounded-full bg-white/80">
              Workflow
            </Badge>
            <CardTitle className="max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
              A fast path from original file to finished result.
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 p-8 pt-0 sm:grid-cols-4 sm:p-10 sm:pt-0">
            {workflow.map((step, index) => (
              <div key={step} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="font-heading text-3xl font-black text-slate-300">0{index + 1}</div>
                <p className="mt-4 font-semibold text-slate-950">{step}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section id="formats" className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
        <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-900/20 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Badge variant="privacy" className="rounded-full">
                Growing toolkit
              </Badge>
              <h2 className="mt-5 font-heading text-3xl font-black tracking-tight sm:text-4xl">
                Built around the formats people actually use.
              </h2>
              <p className="mt-4 leading-7 text-slate-300">
                Start with images today. PDF and document tools continue from the same clean experience.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {['JPG', 'PNG', 'WEBP', 'PDF', 'DOCX', 'AVIF'].map((format) => (
                <div key={format} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center font-heading text-xl font-black">
                  {format}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function MiniCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof MagicWand
  title: string
  text: string
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
      <Icon className="size-5 text-slate-500" weight="duotone" />
      <p className="mt-3 font-semibold text-slate-950">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
  )
}
