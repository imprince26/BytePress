import Link from "next/link"

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200/70 bg-white/55 px-6 py-5 text-sm text-slate-600 backdrop-blur lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-center">
        <p className="text-center">
          © {year}{" "}
          <Link
            href="https://github.com/imprince26"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-slate-800 transition-colors hover:text-slate-950"
          >
            Prince Patel
          </Link>
          . All rights reserved.
        </p>
      </div>
    </footer>
  )
}
