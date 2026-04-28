import Link from "next/link"
import {
  ArrowClockwise,
  ArrowsClockwise,
  FilePdf,
  ImageSquare,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr"

import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const tools = [
  {
    title: "Image Compress",
    description: "Make images lighter for uploads, websites, and sharing.",
    href: "/tools/image-compress#tool-workspace",
    icon: ImageSquare,
    accent: "bg-cyan-100 text-cyan-800",
    category: "Image",
  },
  {
    title: "Image Resize",
    description: "Create exact dimensions without opening design software.",
    href: "/tools/image-resize#tool-workspace",
    icon: ArrowsClockwise,
    accent: "bg-emerald-100 text-emerald-800",
    category: "Image",
  },
  {
    title: "Image Convert",
    description: "Switch between JPG, PNG, and WEBP in seconds.",
    href: "/tools/image-convert#tool-workspace",
    icon: Sparkle,
    accent: "bg-amber-100 text-amber-800",
    category: "Image",
  },
  {
    title: "PDF Merge",
    description: "Combine multiple PDFs into one clean document.",
    href: "/tools/pdf-merge#tool-workspace",
    icon: FilePdf,
    accent: "bg-rose-100 text-rose-800",
    category: "PDF",
  },
  {
    title: "PDF Split",
    description: "Extract selected pages into a fresh PDF.",
    href: "/tools/pdf-split#tool-workspace",
    icon: FilePdf,
    accent: "bg-violet-100 text-violet-800",
    category: "PDF",
  },
  {
    title: "PDF Rotate",
    description: "Fix sideways PDF pages and export the corrected file.",
    href: "/tools/pdf-rotate#tool-workspace",
    icon: ArrowClockwise,
    accent: "bg-orange-100 text-orange-800",
    category: "PDF",
  },
]

export default function ToolsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,oklch(0.94_0.07_176.24),transparent_30rem),radial-gradient(circle_at_bottom_right,oklch(0.93_0.08_78),transparent_26rem),linear-gradient(135deg,oklch(0.99_0.014_95.277),oklch(0.96_0.026_95.277))]">
      <div className="absolute -right-24 top-40 h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl" />
      <SiteHeader nav={[{ href: "/", label: "Home" }, { href: "/dashboard", label: "Dashboard" }]} />

      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-10 pt-8 lg:px-8 lg:pt-14">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_0.7fr] lg:items-end">
          <div>
            <Badge variant="outline" className="rounded-full border-emerald-200 bg-white/75 text-emerald-800">
              Tools workspace
            </Badge>
            <h1 className="mt-5 max-w-4xl font-heading text-4xl font-black tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl">
              Pick a tool. Finish the file. Move on.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Fast image and PDF actions with clear settings, preview-ready results, and instant downloads.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-xl shadow-slate-900/5 backdrop-blur">
            <div className="grid grid-cols-3 gap-3 text-center">
              <Metric value="6" label="tools" />
              <Metric value="3" label="image" />
              <Metric value="3" label="pdf" />
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto grid w-full max-w-7xl gap-4 px-6 pb-20 lg:grid-cols-3 lg:px-8">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Link key={tool.title} href={tool.href} className="group">
              <Card className="h-full overflow-hidden rounded-[2rem] border-white/70 bg-white/78 shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/10">
                <CardHeader className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <span className={`flex size-14 items-center justify-center rounded-2xl ${tool.accent}`}>
                      <Icon className="size-7" weight="duotone" />
                    </span>
                    <Badge variant="outline" className="rounded-full bg-white">
                      {tool.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                  <Button className="mt-3 w-fit rounded-full">Open tool</Button>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </section>
    </main>
  )
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <div className="font-heading text-3xl font-black text-slate-950">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">{label}</div>
    </div>
  )
}
