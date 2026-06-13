# App mobile LOAR — coque téléphone + carrousel — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Afficher l'app mobile React Native « LOAR » dans le portfolio sous forme de carte projet « featured » avec une coque téléphone plate/minimale et un carrousel de 4 screenshots.

**Architecture:** Un nouveau composant client `PhoneMockup` (coque plate + carrousel `motion`) est rendu par `ProjectCard` quand le projet porte un champ `screens`. `ProjectData` gagne 3 champs optionnels (`screens`, `featured`, `platform`) ; `ProjectsSection` trie les projets `featured` en premier et leur applique un style mis en avant + un badge. Un fichier markdown `content/projects/loar.md` reflète LOAR côté API/MCP (champs standard uniquement, aucun changement de schéma).

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, `motion`, `next/image`, Vitest + Testing Library.

---

## File Structure

- **Create** `src/components/PhoneMockup.tsx` — coque téléphone plate + carrousel d'écrans. Responsabilité unique : présenter N images dans un cadre téléphone navigable.
- **Create** `src/components/PhoneMockup.test.tsx` — tests du composant.
- **Modify** `src/data/projects.ts` — étendre `ProjectData` (3 champs optionnels) + ajouter l'entrée LOAR en tête.
- **Modify** `src/components/ProjectCard.tsx` — rendre `PhoneMockup` si `project.screens` ; afficher un badge si `project.platform`.
- **Modify** `src/components/ProjectsSection.tsx` — trier `featured` en premier.
- **Create** `content/projects/loar.md` — miroir API/MCP (champs standard).
- **Create** `src/components/__assets__` n/a — les images vont dans `public/images/projects/loar/` (fournies par l'utilisateur).

---

## Pré-requis (fourni par l'utilisateur)

Déposer les 4 screenshots dans `public/images/projects/loar/` :
`screen-1.webp`, `screen-2.webp`, `screen-3.webp`, `screen-4.webp`, plus une image de
couverture `cover.webp` (peut être une copie de `screen-1.webp`).

Si les fichiers ne sont pas encore là au moment de l'implémentation, le code et les
tests fonctionnent quand même (les tests ne chargent pas réellement les images en
JSDOM) ; seul le rendu navigateur affichera des images cassées tant que les fichiers
manquent.

---

### Task 1: Étendre `ProjectData` et ajouter l'entrée LOAR

**Files:**
- Modify: `src/data/projects.ts`
- Test: `src/data/projects.test.ts` (Create)

- [ ] **Step 1: Écrire le test qui échoue**

Create `src/data/projects.test.ts` :

```ts
import { describe, it, expect } from "vitest"
import { projects } from "@/data/projects"

describe("projects data - LOAR mobile entry", () => {
  it("inclut le projet LOAR en premier", () => {
    expect(projects[0]?.id).toBe("loar")
  })

  it("LOAR est marqué featured et platform mobile", () => {
    const loar = projects.find((p) => p.id === "loar")
    expect(loar?.featured).toBe(true)
    expect(loar?.platform).toBe("mobile")
  })

  it("LOAR expose 4 screenshots .webp", () => {
    const loar = projects.find((p) => p.id === "loar")
    expect(loar?.screens).toHaveLength(4)
    for (const src of loar!.screens!) {
      expect(src).toMatch(/\/images\/projects\/loar\/screen-\d\.webp$/)
    }
  })

  it("les projets existants n'ont pas de champ screens", () => {
    const restobook = projects.find((p) => p.id === "restobook")
    expect(restobook?.screens).toBeUndefined()
  })
})
```

- [ ] **Step 2: Lancer le test pour vérifier l'échec**

Run: `npx vitest run src/data/projects.test.ts`
Expected: FAIL — `projects[0].id` vaut `"restobook"` et `loar` introuvable.

- [ ] **Step 3: Étendre le type et ajouter LOAR**

Dans `src/data/projects.ts`, étendre l'interface :

```ts
export interface ProjectData {
  id: string
  title: string
  description: string
  longDescription: string
  techStack: string[]
  image: string
  liveUrl?: string
  githubUrl?: string
  screens?: string[]
  featured?: boolean
  platform?: string
}
```

Puis ajouter cet objet **en première position** du tableau `projects` (avant `restobook`) :

```ts
  {
    id: "loar",
    title: "LOAR",
    description:
      "Compagnon IA mobile spécialisé en SMOP, avec onboarding guidé et traitement confidentiel des données.",
    longDescription:
      "Application mobile React Native : compagnon IA spécialisé en SMOP. Onboarding guidé, backend Python, stockage objet MinIO et anonymisation des données personnelles via Presidio pour garantir la confidentialité.",
    techStack: ["Python", "React Native", "MinIO", "Presidio"],
    image: "/images/projects/loar/cover.webp",
    screens: [
      "/images/projects/loar/screen-1.webp",
      "/images/projects/loar/screen-2.webp",
      "/images/projects/loar/screen-3.webp",
      "/images/projects/loar/screen-4.webp",
    ],
    featured: true,
    platform: "mobile",
  },
```

- [ ] **Step 4: Lancer le test pour vérifier le succès**

Run: `npx vitest run src/data/projects.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/projects.ts src/data/projects.test.ts
git commit -m "feat(projects): ajoute l'entree LOAR + champs screens/featured/platform"
```

---

### Task 2: Composant `PhoneMockup` (coque + carrousel)

**Files:**
- Create: `src/components/PhoneMockup.tsx`
- Test: `src/components/PhoneMockup.test.tsx`

- [ ] **Step 1: Écrire le test qui échoue**

Create `src/components/PhoneMockup.test.tsx` :

```tsx
import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup, fireEvent } from "@testing-library/react"
import { PhoneMockup } from "@/components/PhoneMockup"

afterEach(() => {
  cleanup()
})

const screens = [
  "/images/projects/loar/screen-1.webp",
  "/images/projects/loar/screen-2.webp",
  "/images/projects/loar/screen-3.webp",
  "/images/projects/loar/screen-4.webp",
]

describe("PhoneMockup", () => {
  it("affiche le premier écran avec un alt incluant le nom de l'app", () => {
    render(<PhoneMockup screens={screens} appName="LOAR" />)
    const img = screen.getByRole("img")
    expect(img).toHaveAttribute("alt")
    expect(img.getAttribute("alt")).toContain("LOAR")
  })

  it("rend un point indicateur par écran", () => {
    render(<PhoneMockup screens={screens} appName="LOAR" />)
    expect(screen.getAllByRole("tab")).toHaveLength(4)
  })

  it("le bouton suivant change l'écran affiché", () => {
    render(<PhoneMockup screens={screens} appName="LOAR" />)
    const before = screen.getByRole("img").getAttribute("src")
    fireEvent.click(screen.getByRole("button", { name: /suivant/i }))
    const after = screen.getByRole("img").getAttribute("src")
    expect(after).not.toBe(before)
  })

  it("le bouton précédent depuis le premier écran boucle au dernier", () => {
    render(<PhoneMockup screens={screens} appName="LOAR" />)
    fireEvent.click(screen.getByRole("button", { name: /précédent/i }))
    const src = screen.getByRole("img").getAttribute("src") ?? ""
    expect(src).toContain("screen-4.webp")
  })

  it("cliquer un point indicateur va à l'écran correspondant", () => {
    render(<PhoneMockup screens={screens} appName="LOAR" />)
    fireEvent.click(screen.getAllByRole("tab")[2])
    const src = screen.getByRole("img").getAttribute("src") ?? ""
    expect(src).toContain("screen-3.webp")
  })
})
```

- [ ] **Step 2: Lancer le test pour vérifier l'échec**

Run: `npx vitest run src/components/PhoneMockup.test.tsx`
Expected: FAIL — module `PhoneMockup` introuvable.

- [ ] **Step 3: Implémenter le composant**

Create `src/components/PhoneMockup.tsx` :

```tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"

interface PhoneMockupProps {
  screens: string[]
  appName: string
}

export function PhoneMockup({ screens, appName }: PhoneMockupProps) {
  const prefersReduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const count = screens.length

  const go = (next: number) => setIndex(((next % count) + count) % count)

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Coque plate / minimale */}
      <div className="relative w-55 aspect-9/19 rounded-[1.75rem] border border-border bg-bg-primary overflow-hidden shadow-lg">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={index}
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.25 }}
            className="absolute inset-0"
          >
            <Image
              src={screens[index]}
              alt={`Capture d'écran ${index + 1} de l'application ${appName}`}
              fill
              sizes="220px"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Contrôles */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Écran précédent"
          onClick={() => go(index - 1)}
          className="p-2 rounded-full border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div role="tablist" aria-label={`Écrans de ${appName}`} className="flex gap-2">
          {screens.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={`Aller à l'écran ${i + 1}`}
              onClick={() => go(i)}
              className={`h-2.5 w-2.5 rounded-full transition-colors cursor-pointer ${
                i === index ? "bg-accent" : "bg-border hover:bg-text-secondary"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Écran suivant"
          onClick={() => go(index + 1)}
          className="p-2 rounded-full border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Lancer le test pour vérifier le succès**

Run: `npx vitest run src/components/PhoneMockup.test.tsx`
Expected: PASS (5 tests).

> Note : `next/image` avec `fill` rend un `<img>` dont le `src` contient le chemin
> `screen-N.webp` en JSDOM, ce que les tests vérifient via `getAttribute("src")`.

- [ ] **Step 5: Commit**

```bash
git add src/components/PhoneMockup.tsx src/components/PhoneMockup.test.tsx
git commit -m "feat(ui): composant PhoneMockup (coque plate + carrousel d'ecrans)"
```

---

### Task 3: Brancher `PhoneMockup` et le badge dans `ProjectCard`

**Files:**
- Modify: `src/components/ProjectCard.tsx`
- Test: `src/components/ProjectCard.test.tsx` (Create)

- [ ] **Step 1: Écrire le test qui échoue**

Create `src/components/ProjectCard.test.tsx` :

```tsx
import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { ProjectCard } from "@/components/ProjectCard"
import type { ProjectData } from "@/data/projects"

afterEach(() => {
  cleanup()
})

const mobileProject: ProjectData = {
  id: "loar",
  title: "LOAR",
  description: "Compagnon IA mobile.",
  longDescription: "Compagnon IA mobile spécialisé.",
  techStack: ["React Native"],
  image: "/images/projects/loar/cover.webp",
  screens: [
    "/images/projects/loar/screen-1.webp",
    "/images/projects/loar/screen-2.webp",
    "/images/projects/loar/screen-3.webp",
    "/images/projects/loar/screen-4.webp",
  ],
  featured: true,
  platform: "mobile",
}

const webProject: ProjectData = {
  id: "restobook",
  title: "RestoBook",
  description: "App web.",
  longDescription: "App web de réservation.",
  techStack: ["Next.js"],
  image: "/images/projects/restobook.webp",
}

describe("ProjectCard - mobile mockup", () => {
  it("affiche le PhoneMockup (image d'écran) pour un projet avec screens, même fermé", () => {
    render(<ProjectCard project={mobileProject} isOpen={false} onToggle={() => {}} />)
    const imgs = screen.getAllByRole("img")
    expect(imgs.some((i) => (i.getAttribute("src") ?? "").includes("screen-1.webp"))).toBe(true)
  })

  it("affiche un badge Mobile pour un projet platform mobile", () => {
    render(<ProjectCard project={mobileProject} isOpen={false} onToggle={() => {}} />)
    expect(screen.getByText(/mobile/i)).toBeInTheDocument()
  })

  it("n'affiche ni mockup ni badge pour un projet web", () => {
    render(<ProjectCard project={webProject} isOpen={false} onToggle={() => {}} />)
    expect(screen.queryByText(/mobile/i)).not.toBeInTheDocument()
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Lancer le test pour vérifier l'échec**

Run: `npx vitest run src/components/ProjectCard.test.tsx`
Expected: FAIL — aucun `img`/badge rendu.

- [ ] **Step 3: Modifier `ProjectCard`**

En haut de `src/components/ProjectCard.tsx`, ajouter l'import :

```tsx
import { PhoneMockup } from "@/components/PhoneMockup"
```

Dans le bloc `<div className="flex-1 min-w-0">`, juste après la balise `<h3>` du titre, insérer le badge :

```tsx
          {project.platform === "mobile" && (
            <span className="inline-block mb-2 bg-accent-soft text-accent font-mono text-xs px-2 py-1 rounded">
              Mobile · React Native
            </span>
          )}
```

Puis, à l'intérieur du `<article>` mais **avant** le `<button>` d'en-tête, insérer le mockup (visible même carte fermée) :

```tsx
      {project.screens && project.screens.length > 0 && (
        <div className="px-6 pt-6 flex justify-center">
          <PhoneMockup screens={project.screens} appName={project.title} />
        </div>
      )}
```

- [ ] **Step 4: Lancer les tests pour vérifier le succès**

Run: `npx vitest run src/components/ProjectCard.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ProjectCard.tsx src/components/ProjectCard.test.tsx
git commit -m "feat(ui): ProjectCard rend PhoneMockup + badge pour les projets mobile"
```

---

### Task 4: Tri `featured` dans `ProjectsSection`

**Files:**
- Modify: `src/components/ProjectsSection.tsx`
- Test: `src/components/ProjectsSection.test.tsx` (Create)

- [ ] **Step 1: Écrire le test qui échoue**

Create `src/components/ProjectsSection.test.tsx` :

```tsx
import { describe, it, expect, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { ProjectsSection } from "@/components/ProjectsSection"

afterEach(() => {
  cleanup()
})

describe("ProjectsSection - ordre featured", () => {
  it("affiche le titre de LOAR avant celui de RestoBook dans le DOM", () => {
    render(<ProjectsSection />)
    const headings = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)
    const loar = headings.findIndex((t) => t?.includes("LOAR"))
    const resto = headings.findIndex((t) => t?.includes("RestoBook"))
    expect(loar).toBeGreaterThanOrEqual(0)
    expect(resto).toBeGreaterThanOrEqual(0)
    expect(loar).toBeLessThan(resto)
  })
})
```

> Note : LOAR est déjà en première position dans `src/data/projects.ts` (Task 1).
> Ce test verrouille le comportement et protège contre un réordonnancement futur du
> tableau, le tri `featured` devenant la source de vérité de l'ordre.

- [ ] **Step 2: Lancer le test pour vérifier l'état initial**

Run: `npx vitest run src/components/ProjectsSection.test.tsx`
Expected: PASS déjà possible (LOAR est premier dans le tableau). On ajoute quand
même le tri explicite à l'étape 3 pour que l'ordre ne dépende plus de la position
dans le tableau source.

- [ ] **Step 3: Ajouter le tri explicite**

Dans `src/components/ProjectsSection.tsx`, remplacer la ligne :

```tsx
  const [openId, setOpenId] = useState<string | null>(null)
```

par (ajout du tableau trié, `projects` reste importé tel quel) :

```tsx
  const [openId, setOpenId] = useState<string | null>(null)

  const orderedProjects = [...projects].sort(
    (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false)
  )
```

Puis remplacer `projects.map(` par `orderedProjects.map(` dans le JSX.

- [ ] **Step 4: Lancer le test pour vérifier le succès**

Run: `npx vitest run src/components/ProjectsSection.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/ProjectsSection.tsx src/components/ProjectsSection.test.tsx
git commit -m "feat(ui): trie les projets featured en premier"
```

---

### Task 5: Miroir API/MCP — `content/projects/loar.md`

**Files:**
- Create: `content/projects/loar.md`
- Test: `src/lib/content.test.ts` (Modify — ajouter un cas)

- [ ] **Step 1: Écrire le test qui échoue**

Dans `src/lib/content.test.ts`, ajouter ce bloc `describe` (les helpers
`getProjects` et `getProjectById` sont **déjà importés** en haut du fichier — ne pas
ré-importer) :

```ts
describe("content - projet LOAR", () => {
  it("getProjects inclut LOAR", () => {
    const ids = getProjects().map((p) => p.id)
    expect(ids).toContain("loar")
  })

  it("getProjectById('loar') renvoie le contenu avec la stack confidentialité", () => {
    const loar = getProjectById("loar")
    expect(loar).not.toBeNull()
    expect(loar?.techStack).toContain("Presidio")
    expect(loar?.content.length).toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Lancer le test pour vérifier l'échec**

Run: `npx vitest run src/lib/content.test.ts`
Expected: FAIL — `loar` absent (fichier markdown inexistant).

- [ ] **Step 3: Créer le fichier markdown**

Create `content/projects/loar.md` :

```markdown
---
id: loar
title: LOAR
techStack:
  - Python
  - React Native
  - MinIO
  - Presidio
image: /images/projects/loar/cover.webp
---

Application mobile React Native : compagnon IA spécialisé en SMOP. Onboarding guidé, backend Python, stockage objet MinIO et anonymisation des données personnelles via Presidio pour garantir la confidentialité.
```

> Note : `parseProjectMeta` dans `src/lib/content.ts` ne lit que les champs standard
> (`id`, `title`, `techStack`, `image`, `liveUrl`, `githubUrl`). Les champs
> `screens` / `featured` / `platform` sont purement UI et n'ont pas besoin d'être
> exposés à l'API — aucun changement de `content.ts` n'est requis.

- [ ] **Step 4: Lancer le test pour vérifier le succès**

Run: `npx vitest run src/lib/content.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add content/projects/loar.md src/lib/content.test.ts
git commit -m "feat(content): expose LOAR via l'API/MCP (markdown miroir)"
```

---

### Task 6: Vérification finale

- [ ] **Step 1: Suite de tests complète**

Run: `npm test`
Expected: tous les tests passent (aucune régression sur les suites existantes).

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: aucune erreur.

- [ ] **Step 3: Build de production**

Run: `npm run build`
Expected: build réussi (vérifie que `next/image` + les nouveaux composants
compilent et que les Core Web Vitals ne sont pas cassés).

- [ ] **Step 4: Vérification visuelle manuelle**

Run: `npm run dev`, ouvrir la section « Mes Projets ».
Expected: la carte LOAR apparaît **en premier**, avec la coque téléphone visible, le
carrousel navigable (flèches + points), le badge « Mobile · React Native ». Déposer
au préalable les 4 screenshots dans `public/images/projects/loar/` pour voir les
vraies images.

---

## Self-Review (effectué)

- **Couverture du spec :** carte featured (Task 1+4), coque plate + carrousel 4 écrans (Task 2), badge + mockup dans la carte (Task 3), données UI + markdown miroir (Task 1+5), accessibilité `prefers-reduced-motion`/`alt`/clavier (Task 2), tests (chaque task). ✔
- **Écart assumé vs spec :** le spec mentionnait des « schémas Zod des projets » — ils n'existent pas (`schemas.ts` ne couvre que le contact, le markdown est parsé manuellement). Le plan retire ce point : aucun changement Zod, et les champs UI ne sont pas exposés à l'API. ✔
- **Placeholders :** aucun — tout le code est fourni. Les 4 images sont un pré-requis utilisateur explicite, pas un placeholder de code. ✔
- **Cohérence des types :** `PhoneMockupProps { screens, appName }` utilisé de façon identique en Task 2 et Task 3 ; `ProjectData.screens/featured/platform` cohérents entre Task 1, 3, 4. ✔
