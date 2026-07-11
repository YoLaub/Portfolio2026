import approachData from "../../content/approach.json"

export interface ApproachItem {
  id: string
  tag: string
  title: string
  body: string
}

// Source de vérité unique : content/approach.json (même fichier que celui exposé
// par lib/content.ts). Ce module ne fait que le typer et le ré-exporter.
export const approach: ApproachItem[] = approachData
