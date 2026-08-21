import formationData from "../../content/formation.json"

export interface FormationData {
  id: string
  title: string
  description: string
  icon: string
}

// Source de vérité unique : content/formation.json (même fichier que celui
// servi par l'API via lib/content.ts). Ce module ne fait que le typer et le
// ré-exporter, comme data/services.ts.
export const formations: FormationData[] = formationData
