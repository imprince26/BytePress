export const maxPdfUploadBytes = 50 * 1024 * 1024

export function validatePdfFiles(files: File[]) {
  if (!files.length) {
    return "Choose at least one PDF file."
  }

  const invalidFile = files.find(
    (file) => file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")
  )

  if (invalidFile) {
    return "Please choose PDF files only."
  }

  const oversizedFile = files.find((file) => file.size > maxPdfUploadBytes)

  if (oversizedFile) {
    return "Each PDF must be 50 MB or smaller."
  }

  return null
}

export function parsePageRanges(input: string, pageCount: number) {
  const normalized = input.trim()

  if (!normalized) {
    return Array.from({ length: pageCount }, (_, index) => index)
  }

  const pages = new Set<number>()
  const chunks = normalized.split(",").map((chunk) => chunk.trim()).filter(Boolean)

  for (const chunk of chunks) {
    const [startValue, endValue] = chunk.split("-").map((value) => Number(value.trim()))

    if (!Number.isInteger(startValue) || startValue < 1 || startValue > pageCount) {
      throw new Error("Page range is not valid.")
    }

    if (endValue === undefined || Number.isNaN(endValue)) {
      pages.add(startValue - 1)
      continue
    }

    if (!Number.isInteger(endValue) || endValue < startValue || endValue > pageCount) {
      throw new Error("Page range is not valid.")
    }

    for (let page = startValue; page <= endValue; page += 1) {
      pages.add(page - 1)
    }
  }

  return [...pages].sort((a, b) => a - b)
}
