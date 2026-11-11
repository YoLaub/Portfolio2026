import { serviceIllustrations } from "@/components/services/illustrations"

export function StepIllustration({
  id,
  className,
  strokeWidth = 2.6,
}: {
  id: string
  className?: string
  strokeWidth?: number
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 140"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      // Static, authored markup from illustrations.ts (no user input).
      dangerouslySetInnerHTML={{ __html: serviceIllustrations[id] ?? "" }}
    />
  )
}
