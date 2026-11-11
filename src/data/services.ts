import servicesData from "../../content/services.json"

interface ServiceBase {
  id: string
  title: string
  /** Plain description, used by the API, the MCP resource and the chat agent. */
  description: string
  icon: string
  /** Full price line, shown in the concept modal ("Création de site · dès 500 €"). */
  price?: string
  /** Optional technical deep dive, shown on demand (chat agent). */
  detail?: string
  /** One-liner shown on the staircase card or the extras row. */
  short: string
  /** Compact price hint shown on the card ("Dès 500 €", "Avec Okyr"). */
  priceShort: string
}

/** One step of the "marche par marche" staircase, with its concept-modal content. */
export interface StepService extends ServiceBase {
  placement: "step"
  /** Delivered with Okyr, the automation & AI partner (dashed card). */
  okyr: boolean
  tag: string
  image: string
  phrase: string
  story: string
  uses: string[]
  who: string
  role: string
  price: string
}

/** Side offer shown below the staircase (consulting, maintenance). */
export interface ExtraService extends ServiceBase {
  placement: "extra"
}

export type ServiceData = StepService | ExtraService

// Single source of truth: content/services.json (same file served by the API
// through lib/content.ts). This module only types and re-exports it.
export const services = servicesData as ServiceData[]

export const serviceSteps = services.filter(
  (s): s is StepService => s.placement === "step"
)

export const serviceExtras = services.filter(
  (s): s is ExtraService => s.placement === "extra"
)
