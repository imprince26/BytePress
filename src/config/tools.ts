export type ToolCategory = "pdf" | "image" | "security"

export interface ToolItem {
  id: string
  title: string
  shortTitle: string
  description: string
  href: string
  category: ToolCategory
  categoryLabel: string
  iconName: string
  badge?: string
  isNew?: boolean
  processingType: "client" | "server"
}

export const TOOLS_LIST: ToolItem[] = [
  // PDF Suite
  {
    id: "pdf-compress",
    title: "PDF Compressor",
    shortTitle: "Compress",
    description: "Reduce PDF document size with multi-tier optimization while maintaining crisp quality.",
    href: "/tools/pdf-compress#tool-workspace",
    category: "pdf",
    categoryLabel: "PDF Suite",
    iconName: "FileArrowDown",
    badge: "Most Popular",
    isNew: true,
    processingType: "client",
  },
  {
    id: "pdf-merge",
    title: "PDF Merge",
    shortTitle: "Merge",
    description: "Combine multiple PDF documents into a single organized, unified PDF file.",
    href: "/tools/pdf-merge#tool-workspace",
    category: "pdf",
    categoryLabel: "PDF Suite",
    iconName: "Files",
    badge: "Essential",
    processingType: "client",
  },
  {
    id: "pdf-split",
    title: "PDF Split",
    shortTitle: "Split",
    description: "Extract specific page ranges or individual pages into independent PDF files.",
    href: "/tools/pdf-split#tool-workspace",
    category: "pdf",
    categoryLabel: "PDF Suite",
    iconName: "Scissors",
    processingType: "client",
  },
  {
    id: "pdf-organize",
    title: "Organize & Delete Pages",
    shortTitle: "Organize",
    description: "Visually reorder pages, rotate individual sheets, and delete unwanted pages.",
    href: "/tools/pdf-organize#tool-workspace",
    category: "pdf",
    categoryLabel: "PDF Suite",
    iconName: "SquaresFour",
    isNew: true,
    processingType: "client",
  },
  {
    id: "pdf-rotate",
    title: "PDF Rotate",
    shortTitle: "Rotate",
    description: "Fix orientation of sideways or upside-down PDF pages with 90°, 180°, or 270° rotation.",
    href: "/tools/pdf-rotate#tool-workspace",
    category: "pdf",
    categoryLabel: "PDF Suite",
    iconName: "ArrowClockwise",
    processingType: "client",
  },
  {
    id: "pdf-page-numbers",
    title: "Add Page Numbers",
    shortTitle: "Page Numbers",
    description: "Stamp customized page numbers with precise positioning, font sizes, and styles.",
    href: "/tools/pdf-page-numbers#tool-workspace",
    category: "pdf",
    categoryLabel: "PDF Suite",
    iconName: "HashStraight",
    isNew: true,
    processingType: "client",
  },
  {
    id: "pdf-protect",
    title: "Protect PDF",
    shortTitle: "Protect",
    description: "Secure confidential PDF documents with permissions locking and security verification.",
    href: "/tools/pdf-protect#tool-workspace",
    category: "security",
    categoryLabel: "Security",
    iconName: "LockKey",
    isNew: true,
    processingType: "client",
  },
  {
    id: "pdf-viewer",
    title: "PDF Viewer",
    shortTitle: "Viewer",
    description: "Inspect, zoom, rotate, and read any PDF document directly in your browser without download.",
    href: "/tools/pdf-viewer#tool-workspace",
    category: "pdf",
    categoryLabel: "PDF Suite",
    iconName: "Eye",
    isNew: true,
    processingType: "client",
  },

  // Image Suite
  {
    id: "image-compress",
    title: "Image Compressor",
    shortTitle: "Compress",
    description: "Compress JPG, PNG, WEBP, and AVIF images by quality percentage or exact target KB size.",
    href: "/tools/image-compress#tool-workspace",
    category: "image",
    categoryLabel: "Image Suite",
    iconName: "ImageSquare",
    badge: "High Savings",
    processingType: "client",
  },
  {
    id: "image-resize",
    title: "Image Resizer",
    shortTitle: "Resize",
    description: "Scale image dimensions precisely with aspect ratio locking and predefined presets.",
    href: "/tools/image-resize#tool-workspace",
    category: "image",
    categoryLabel: "Image Suite",
    iconName: "ArrowsOutLineHorizontal",
    processingType: "client",
  },
  {
    id: "image-convert",
    title: "Image Converter",
    shortTitle: "Convert",
    description: "Instantly convert image files between JPG, PNG, WEBP, and AVIF formats.",
    href: "/tools/image-convert#tool-workspace",
    category: "image",
    categoryLabel: "Image Suite",
    iconName: "ArrowsLeftRight",
    processingType: "client",
  },
  {
    id: "images-to-pdf",
    title: "Images to PDF",
    shortTitle: "Images to PDF",
    description: "Convert a collection of photos and graphic files into a clean, uniform PDF book.",
    href: "/tools/images-to-pdf#tool-workspace",
    category: "pdf",
    categoryLabel: "PDF Suite",
    iconName: "ImagesSquare",
    processingType: "client",
  },
]
