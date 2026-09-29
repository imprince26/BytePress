"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowClockwiseIcon,
  ArrowsLeftRightIcon,
  ArrowsOutLineHorizontalIcon,
  CaretDownIcon,
  CpuIcon,
  EyeIcon,
  FileArrowDownIcon,
  FilesIcon,
  HashStraightIcon,
  ImagesSquareIcon,
  LightningIcon,
  ListIcon,
  LockKeyIcon,
  ScissorsIcon,
  SparkleIcon,
  SquaresFourIcon,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface SiteHeaderProps {
  className?: string
}

// Direct top-level links (most frequently needed)
const DIRECT_LINKS = [
  {
    title: "Compress PDF",
    href: "/tools/pdf-compress",
    icon: FileArrowDownIcon,
  },
  {
    title: "Compress Image",
    href: "/tools/image-compress",
    icon: SparkleIcon,
  },
  {
    title: "Merge PDF",
    href: "/tools/pdf-merge",
    icon: FilesIcon,
  },
]

// Convert dropdown items
const CONVERT_TOOLS = [
  {
    title: "Convert Image",
    description: "Transform between JPG, PNG, and WEBP formats",
    href: "/tools/image-convert",
    icon: ArrowsLeftRightIcon,
  },
  {
    title: "Images to PDF",
    description: "Compile multiple photos into a single PDF book",
    href: "/tools/images-to-pdf",
    icon: ImagesSquareIcon,
  },
]

// All additional tools dropdown
const MORE_TOOLS = [
  {
    title: "PDF Split",
    description: "Extract specific page ranges into new files",
    href: "/tools/pdf-split",
    icon: ScissorsIcon,
  },
  {
    title: "Organize Pages",
    description: "Reorder, rotate, or remove pages visually",
    href: "/tools/pdf-organize",
    icon: SquaresFourIcon,
  },
  {
    title: "Rotate PDF",
    description: "Fix orientation of sideways or inverted pages",
    href: "/tools/pdf-rotate",
    icon: ArrowClockwiseIcon,
  },
  {
    title: "Protect PDF",
    description: "Encrypt and secure with password protection",
    href: "/tools/pdf-protect",
    icon: LockKeyIcon,
  },
  {
    title: "Page Numbers",
    description: "Stamp customized pagination headers/footers",
    href: "/tools/pdf-page-numbers",
    icon: HashStraightIcon,
  },
  {
    title: "PDF Viewer",
    description: "Inspect and read PDF documents in browser",
    href: "/tools/pdf-viewer",
    icon: EyeIcon,
  },
  {
    title: "Resize Image",
    description: "Scale pixel dimensions with aspect ratio lock",
    href: "/tools/image-resize",
    icon: ArrowsOutLineHorizontalIcon,
  },
]

export function SiteHeader({ className }: SiteHeaderProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [activeDropdown, setActiveDropdown] = React.useState<"convert" | "more" | null>(null)
  const [mobileConvertOpen, setMobileConvertOpen] = React.useState(true)
  const [mobileMoreOpen, setMobileMoreOpen] = React.useState(false)
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)

  // Hover handlers with debounce timer for smooth desktop feel
  function handleMouseEnter(menu: "convert" | "more") {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setActiveDropdown(menu)
  }

  function handleMouseLeave() {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  // Close menus on page navigation
  React.useEffect(() => {
    setMobileOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border/70 bg-background/90 backdrop-blur-md transition-colors",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 font-heading text-lg font-bold tracking-tight text-foreground transition-opacity hover:opacity-90 sm:text-xl"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs transition-transform group-hover:scale-105">
            <CpuIcon className="size-4.5" weight="bold" />
          </span>
          <span>BytePress</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 lg:gap-2 md:flex">
          {/* Direct Tools */}
          {DIRECT_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
              >
                {link.title}
              </Link>
            )
          })}

          {/* Convert Dropdown (Opens on hover) */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("convert")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={cn(
                "group flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                activeDropdown === "convert"
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
              aria-expanded={activeDropdown === "convert"}
            >
              <span>Convert</span>
              <CaretDownIcon
                className={cn(
                  "size-3 text-muted-foreground transition-transform duration-200",
                  activeDropdown === "convert" && "rotate-180 text-foreground"
                )}
              />
            </button>

            {/* Dropdown Menu Panel */}
            {activeDropdown === "convert" && (
              <div
                className="absolute left-0 top-full pt-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150"
                onMouseEnter={() => handleMouseEnter("convert")}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-72 rounded-xl border border-border/80 bg-popover/98 p-2 shadow-xl backdrop-blur-md">
                  <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Conversion Suite
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {CONVERT_TOOLS.map((tool) => {
                      const Icon = tool.icon
                      const isActive = pathname === tool.href
                      return (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          className={cn(
                            "flex items-start gap-3 rounded-lg p-2 transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted/70 text-foreground"
                          )}
                        >
                          <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary shrink-0 mt-0.5">
                            <Icon className="size-4" weight="duotone" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold leading-none">{tool.title}</p>
                            <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                              {tool.description}
                            </p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* More Tools Dropdown (Opens on hover) */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter("more")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              className={cn(
                "group flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
                activeDropdown === "more"
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
              aria-expanded={activeDropdown === "more"}
            >
              <span>More Tools</span>
              <CaretDownIcon
                className={cn(
                  "size-3 text-muted-foreground transition-transform duration-200",
                  activeDropdown === "more" && "rotate-180 text-foreground"
                )}
              />
            </button>

            {/* Dropdown Menu Panel (Multi-Column) */}
            {activeDropdown === "more" && (
              <div
                className="absolute right-0 lg:left-0 top-full pt-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150"
                onMouseEnter={() => handleMouseEnter("more")}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-80 sm:w-96 rounded-xl border border-border/80 bg-popover/98 p-3 shadow-xl backdrop-blur-md">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2 px-1 mb-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                      Document & Image Utilities
                    </span>
                    <Link
                      href="/tools"
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      All Tools &rarr;
                    </Link>
                  </div>
                  <div className="grid gap-1 sm:grid-cols-2">
                    {MORE_TOOLS.map((tool) => {
                      const Icon = tool.icon
                      const isActive = pathname === tool.href
                      return (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          className={cn(
                            "flex items-start gap-2.5 rounded-lg p-2 transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted/70 text-foreground"
                          )}
                        >
                          <span className="flex size-6 items-center justify-center rounded-md bg-muted text-foreground/80 shrink-0 mt-0.5">
                            <Icon className="size-3.5" weight="duotone" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold leading-tight">{tool.title}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                              {tool.description}
                            </p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right Action & Mobile Toggle */}
        <div className="flex items-center gap-2">
          {/* Desktop "All Tools" action */}
          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex h-9 px-4 text-xs font-semibold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-xs"
          >
            <Link href="/tools">
              <LightningIcon className="size-3.5" weight="fill" />
              <span>All Tools</span>
            </Link>
          </Button>

          {/* Mobile Sidebar Sheet */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-lg border-border text-foreground hover:bg-accent"
                  aria-label="Open Navigation Menu"
                >
                  <ListIcon className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-sm p-0 flex flex-col justify-between">
                <div>
                  {/* Sheet Header */}
                  <SheetHeader className="p-4 border-b border-border">
                    <SheetTitle className="flex items-center gap-2 text-base font-bold">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-2xs">
                        <CpuIcon className="size-4" weight="bold" />
                      </span>
                      <span>BytePress</span>
                    </SheetTitle>
                    <SheetDescription className="text-xs text-muted-foreground">
                      Fast, private browser document tools
                    </SheetDescription>
                  </SheetHeader>

                  {/* Scrollable Tool Links */}
                  <div className="p-4 space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto">
                    {/* Quick Access Tools */}
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-2">
                        Popular Tools
                      </p>
                      <div className="space-y-1">
                        {DIRECT_LINKS.map((link) => {
                          const Icon = link.icon
                          const isActive = pathname === link.href
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                                isActive
                                  ? "bg-primary text-primary-foreground font-semibold"
                                  : "text-foreground hover:bg-muted"
                              )}
                            >
                              <Icon className="size-4 shrink-0" weight="duotone" />
                              <span>{link.title}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>

                    {/* Collapsible Convert Suite */}
                    <div className="rounded-xl border border-border/80 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setMobileConvertOpen(!mobileConvertOpen)}
                        className="flex w-full items-center justify-between p-3 text-xs font-bold text-foreground bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <ArrowsLeftRightIcon className="size-4 text-primary" weight="bold" />
                          <span>Convert Tools</span>
                        </span>
                        <CaretDownIcon
                          className={cn(
                            "size-3.5 text-muted-foreground transition-transform",
                            mobileConvertOpen && "rotate-180 text-foreground"
                          )}
                        />
                      </button>
                      {mobileConvertOpen && (
                        <div className="p-2 space-y-1 border-t border-border/60 bg-card">
                          {CONVERT_TOOLS.map((tool) => {
                            const Icon = tool.icon
                            const isActive = pathname === tool.href
                            return (
                              <Link
                                key={tool.href}
                                href={tool.href}
                                className={cn(
                                  "flex items-start gap-2.5 rounded-lg p-2 text-xs transition-colors",
                                  isActive
                                    ? "bg-primary/10 text-primary font-semibold"
                                    : "text-foreground hover:bg-muted"
                                )}
                              >
                                <Icon className="size-4 shrink-0 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="font-semibold">{tool.title}</p>
                                  <p className="text-[10px] text-muted-foreground">{tool.description}</p>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {/* Collapsible More Tools */}
                    <div className="rounded-xl border border-border/80 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
                        className="flex w-full items-center justify-between p-3 text-xs font-bold text-foreground bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <SquaresFourIcon className="size-4 text-primary" weight="bold" />
                          <span>PDF & More Tools</span>
                        </span>
                        <CaretDownIcon
                          className={cn(
                            "size-3.5 text-muted-foreground transition-transform",
                            mobileMoreOpen && "rotate-180 text-foreground"
                          )}
                        />
                      </button>
                      {mobileMoreOpen && (
                        <div className="p-2 space-y-1 border-t border-border/60 bg-card">
                          {MORE_TOOLS.map((tool) => {
                            const Icon = tool.icon
                            const isActive = pathname === tool.href
                            return (
                              <Link
                                key={tool.href}
                                href={tool.href}
                                className={cn(
                                  "flex items-start gap-2.5 rounded-lg p-2 text-xs transition-colors",
                                  isActive
                                    ? "bg-primary/10 text-primary font-semibold"
                                    : "text-foreground hover:bg-muted"
                                )}
                              >
                                <Icon className="size-4 shrink-0 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="font-semibold">{tool.title}</p>
                                  <p className="text-[10px] text-muted-foreground">{tool.description}</p>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile Drawer Bottom Action */}
                <div className="p-4 border-t border-border bg-muted/20 space-y-2">
                  <Button
                    asChild
                    className="w-full h-10 text-xs font-semibold gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Link href="/tools">
                      <LightningIcon className="size-4" weight="fill" />
                      <span>Explore All Tools</span>
                    </Link>
                  </Button>
                  <div className="flex justify-center gap-4 pt-1 text-[11px] text-muted-foreground">
                    <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
                    <span>•</span>
                    <Link href="/terms" className="hover:underline">Terms of Service</Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
