"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowClockwise,
  ArrowsLeftRight,
  ArrowsOutLineHorizontal,
  Eye,
  FileArrowDown,
  Files,
  HashStraight,
  ImageSquare,
  ImagesSquare,
  LockKey,
  MagnifyingGlass,
  Scissors,
  SquaresFour,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { TOOLS_LIST, type ToolCategory } from "@/config/tools"

const ICON_MAP: Record<string, React.ElementType> = {
  FileArrowDown,
  Files,
  Scissors,
  SquaresFour,
  ArrowClockwise,
  HashStraight,
  LockKey,
  Eye,
  ImageSquare,
  ArrowsOutLineHorizontal,
  ArrowsLeftRight,
  ImagesSquare,
}

export function ToolsCatalog() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | "all">("all")

  const filteredTools = TOOLS_LIST.filter((tool) => {
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory
    const matchesSearch =
      tool.title.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      {/* Hero Section */}
      <section className="border-b border-border/70 bg-muted/20 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl space-y-3">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              All PDF & Image Tools
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Select a tool to compress, edit, convert, or organize your documents and pictures.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm w-full">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tools by name..."
                className="pl-9 h-10 text-xs bg-background"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                All Tools
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("pdf")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === "pdf"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                PDF Tools
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory("image")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === "image"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                Image Tools
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {filteredTools.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <p className="text-sm font-semibold text-foreground">No tools found matching &quot;{search}&quot;</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("")
                setSelectedCategory("all")
              }}
              className="mt-3 text-xs"
            >
              Reset search
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTools.map((tool) => {
              const Icon = ICON_MAP[tool.iconName] || FileArrowDown
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
        )}
      </section>
    </>
  )
}
