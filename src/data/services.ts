import servicesData from "../../content/services.json"

export interface ServiceData {
  id: string
  title: string
  description: string
  icon: string
  /** Indication tarifaire affichee sur la carte (forfait "A partir de ..." ou TJM). */
  price?: string
}

// Source de vérité unique : content/services.json (même fichier que celui servi
// par l'API via lib/content.ts). Ce module ne fait que le typer et le ré-exporter.
export const services: ServiceData[] = servicesData
