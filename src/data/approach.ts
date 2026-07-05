export interface ApproachItem {
  id: string
  tag: string
  title: string
  body: string
}

export const approach: ApproachItem[] = [
  {
    id: "outillage",
    tag: "Service à la demande",
    title: "Outils digitaux",
    body: "D'une simple page web à vos propres connecteurs (MCP) qui exposent vos données (caisse, stock, base produits) à vos agents.",
  },
  {
    id: "skills-secteur",
    tag: "Connaissance métier",
    title: "Identifier les compétences et routines d'un secteur",
    body: "Réglementation, tâches répétitives, livrables types, charte graphique. Je capture la connaissance de votre secteur.",
  },
  {
    id: "terrain",
    tag: "Terrain & ateliers",
    title: "Un développeur sur le terrain",
    body: "Le mur entre le développeur et le client est rompu. On discute, on identifie les frictions et les besoins, un prototype sort en 48h, le produit suit.",
  },
]
