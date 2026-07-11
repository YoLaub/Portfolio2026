import type { ProjectMeta } from "@/lib/content"

// Source de vérité unique : content/projects/*.md, lus via lib/content.ts
// (getProjects / getProjectById). Ce module ne conserve que le type partagé
// par les composants d'affichage (import de type uniquement, aucun accès fs
// côté client).
export type ProjectData = ProjectMeta
