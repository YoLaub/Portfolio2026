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
    title: "Des outils numériques sur mesure",
    body: "D'un simple site vitrine à des outils qui font communiquer vos logiciels entre eux (caisse, stock, catalogue produits), pour vous faire gagner du temps au quotidien.",
  },
  {
    id: "skills-secteur",
    tag: "Connaissance métier",
    title: "Je m'immerge dans votre métier avant de coder",
    body: "Réglementation, habitudes de travail, documents types, image de marque : je prends le temps de comprendre votre quotidien pour livrer un outil qui correspond vraiment à vos besoins.",
  },
  {
    id: "terrain",
    tag: "Terrain & ateliers",
    title: "Un développeur à votre écoute, sur le terrain",
    body: "On échange directement, sans intermédiaire. On identifie ensemble ce qui vous fait perdre du temps, un premier aperçu concret sort en 48h, puis on affine ensemble jusqu'au produit final.",
  },
]
