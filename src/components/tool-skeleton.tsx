import { CircleNotch } from "@phosphor-icons/react"

interface ToolProcessingStateProps {
  title?: string
  description?: string
}

export function ToolProcessingState({
  title = "Processing file...",
  description = "This will only take a moment.",
}: ToolProcessingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-border bg-muted/20 text-center animate-in fade-in duration-200">
      <CircleNotch className="size-8 text-primary animate-spin mb-3" />
      <p className="text-xs font-semibold text-foreground">{title}</p>
      <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
    </div>
  )
}
