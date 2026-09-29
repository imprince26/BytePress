import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const headingFont = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const sansFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BytePress - Professional PDF & Image Tools",
    template: "%s | BytePress",
  },
  description:
    "Fast, private online tools to compress, merge, split, organize, convert, and protect your PDF documents and images.",
  keywords: [
    "PDF compressor",
    "merge PDF",
    "split PDF",
    "compress images",
    "convert image",
    "protect PDF",
    "organize PDF pages",
    "PDF tools online",
  ],
  authors: [{ name: "BytePress" }],
  metadataBase: new URL("https://bytepress.vercel.app"),
  openGraph: {
    title: "BytePress - Professional PDF & Image Tools",
    description:
      "Compress, merge, split, organize, convert, and protect your PDF documents and images directly in your browser.",
    type: "website",
    locale: "en_US",
    siteName: "BytePress",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn(
        "h-full scroll-smooth antialiased",
        sansFont.variable,
        headingFont.variable,
        monoFont.variable
      )}
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  );
}
