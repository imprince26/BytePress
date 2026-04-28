import Link from "next/link"
import { ArrowsClockwise, FilePdf, ImageSquare, Sparkle } from "@phosphor-icons/react/dist/ssr"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const tools = [
  {
    title: "Image Compress",
    description: "Compress images by quality or target size.",
    href: "/tools/image-compress",
    icon: ImageSquare,
    status: "Ready",
  },
  {
    title: "Image Resize",
    description: "Resize images to exact dimensions for forms, websites, and sharing.",
    href: "/tools/image-resize",
    icon: ArrowsClockwise,
    status: "Ready",
  },
  {
    title: "Image Convert",
    description: "Convert images between JPG, PNG, and WEBP.",
    href: "/tools/image-convert",
    icon: Sparkle,
    status: "Ready",
  },
  {
    title: "PDF Merge",
    description: "Combine multiple PDFs into one document.",
    href: "/tools/pdf-merge",
    icon: FilePdf,
    status: "Ready",
  },
  {
    title: "PDF Split",
    description: "Extract selected pages into a new PDF.",
    href: "/tools/pdf-split",
    icon: FilePdf,
    status: "Ready",
  },
]

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,oklch(0.99_0.014_95.277),oklch(0.96_0.026_95.277))] px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SiteHeader className="px-0 lg:px-0" nav={[{ href: "/", label: "Home" }]} />

        <section className="py-16">
          <Badge variant="privacy" className="rounded-full">
            Tools
          </Badge>
          <h1 className="mt-5 max-w-3xl font-heading text-5xl font-black tracking-[-0.05em] text-slate-950">
            Choose a tool and get the finished file.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Image and PDF essentials are ready now. More document tools are coming next.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {tools.map((tool) => {
            const Icon = tool.icon

            return (
              <Card key={tool.title} className="rounded-[1.75rem] border-white/70 bg-white/75 shadow-sm backdrop-blur">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-800">
                      <Icon className="size-6" weight="duotone" />
                    </span>
                    <Badge variant="outline" className="rounded-full bg-white">
                      {tool.status}
                    </Badge>
                  </div>
                  <CardTitle>{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                  <Button asChild className="mt-3 rounded-full">
                    <Link href={tool.href}>Open tool</Link>
                  </Button>
                </CardHeader>
              </Card>
            )
          })}
        </section>
      </div>
    </main>
  )
}
