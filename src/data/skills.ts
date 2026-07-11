import skillsData from "../../content/skills.json"

export interface SkillData {
  id: string
  name: string
  category: string
}

// Source de vérité unique : content/skills.json (même fichier que celui servi
// par l'API via lib/content.ts). Ce module ne fait que le typer et le ré-exporter.
export const skills: SkillData[] = skillsData
