# App mobile (React Native) — affichage dans le portfolio

**Date :** 2026-06-13
**Statut :** Design approuvé, prêt pour le plan d'implémentation

## Contexte

Le portfolio (Next.js 16, React 19, Tailwind 4, `motion`) présente les projets sous
forme de cartes dépliables. Deux sources de données coexistent :

- **UI** → [`src/data/projects.ts`](../../../src/data/projects.ts) (tableau statique consommé par `ProjectsSection` / `ProjectCard`).
- **API / MCP** → fichiers markdown dans [`content/projects/`](../../../content/projects/), lus par [`src/lib/content.ts`](../../../src/lib/content.ts) et exposés via [`src/app/api/mcp/route.ts`](../../../src/app/api/mcp/route.ts).

L'utilisateur (positionnement **généraliste, cœur intégration IA**) possède une app
React Native existante, **LOAR — compagnon IA spécialisé en SMOP**, avec des
screenshots prêts (4 images, onboarding inclus). Stack : **Python / React Native /
MinIO / Presidio** (confidentialité). Objectif : la montrer dans le portfolio avec un
impact visuel fort, sans déséquilibrer le positionnement ni casser la cohérence ou
les Core Web Vitals soignés à l'Epic 4.

## Décision de design

L'app mobile devient une **carte projet « featured »** (et **non** une vitrine
dédiée — une section séparée enverrait un signal « dev mobile » qui brouillerait le
positionnement généraliste/IA). L'impact « waouh » vient de la **coque téléphone**
elle-même, pas d'un placement isolé.

- Style de coque : **plat / minimal** (cadre arrondi sobre, pas de coque réaliste).
- **4 screenshots** (onboarding inclus) présentés dans un **carrousel**.
- Sur une carte featured, le mockup téléphone est **visible directement** (sans
  déplier). Le reste (description longue, liens) reste dans la zone dépliable.
- La carte featured est placée **en premier** dans la grille et porte un badge
  **« Mobile · React Native »**.

## Composants

### `PhoneMockup` (nouveau)

`src/components/PhoneMockup.tsx`. Coque plate/minimale enveloppant un carrousel.

- **Props :** `screens: string[]` (chemins images), `appName: string` (pour les `alt`).
- **Rôle unique :** rendre une coque téléphone + carrousel des écrans.
- **Dépendances :** `next/image`, `motion` (déjà présent), aucune librairie externe.

### Carrousel (interne à `PhoneMockup` ou sous-composant)

- Flèches précédent / suivant + points indicateurs cliquables.
- Navigation clavier (flèches, focus visible).
- `aria-label` par écran ; chaque image a un `alt` significatif.
- Respecte `prefers-reduced-motion` via `useReducedMotion` (même pattern que
  [`ProjectCard.tsx`](../../../src/components/ProjectCard.tsx)) : transitions désactivées si réduit.
- Images via `next/image` (lazy-load), format `.webp`.

### `ProjectCard` (modifié)

- Si `project.screens` est présent : rend `<PhoneMockup>` (visible hors dépliage
  pour une carte featured).
- Si `project.platform` est défini : affiche le badge correspondant (« Mobile ·
  React Native »).

### `ProjectsSection` (modifié)

- Tri : les projets `featured` d'abord, puis l'ordre existant.
- Style légèrement mis en avant pour la carte featured (bordure / accent), sans
  créer de layout à part.

## Données

### `ProjectData` (étendu) — `src/data/projects.ts`

Ajout de 3 champs **optionnels** (n'impacte pas les projets existants) :

```ts
screens?: string[]      // ex. ["/images/projects/loar/screen-1.webp", ...] (4 écrans)
featured?: boolean      // ordre + style mis en avant
platform?: string       // ex. "mobile" → pilote le badge
```

Nouvelle entrée projet pour l'app mobile (premier élément, `featured: true`,
`platform: "mobile"`, `screens` renseigné).

### Markdown — `content/projects/<slug>.md`

Nouveau fichier markdown miroir pour l'API/MCP, avec les mêmes champs en
frontmatter (`screens`, `featured`, `platform`), afin qu'un agent IA interrogeant le
MCP voie aussi l'app mobile.

### Schémas — `src/lib/schemas.ts`

Étendre le schéma Zod des projets avec les 3 champs optionnels (`screens`,
`featured`, `platform`) pour que la validation du contenu markdown passe.

## Assets

Screenshots → `public/images/projects/loar/screen-1.webp` …
`screen-4.webp` (4 images, onboarding inclus ; convention `.webp` cohérente avec
les autres projets, optimisée pour les Core Web Vitals).

## Tests (Vitest + Testing Library)

- `PhoneMockup.test.tsx` : rend bien 4 écrans ; la navigation préc/suiv change
  l'écran actif ; chaque image a un `alt` ; les points indicateurs fonctionnent.
- Mise à jour des tests data / schéma existants pour couvrir les nouveaux champs.

## Hors périmètre (YAGNI)

- Pas de vitrine / section dédiée.
- Pas d'app Expo embarquée ni de réplique TSX interactive des écrans.
- Pas de librairie de carrousel externe.
- Pas de coque réaliste (notch / Dynamic Island) — choix « plat / minimal » retenu.

## Données fournies

- **Nom :** LOAR
- **Pitch :** compagnon IA spécialisé en SMOP.
- **techStack :** Python, React Native, MinIO, Presidio (confidentialité).
- **Screens :** 4 images (onboarding inclus) → `public/images/projects/loar/screen-1..4.webp`.

### Restant à fournir à l'implémentation

- Les 4 fichiers screenshots déposés dans `public/images/projects/loar/`.
- Une phrase de `longDescription` plus complète si souhaité (sinon dérivée du pitch).
- `githubUrl` / `liveUrl` éventuels.
- Confirmer si « SMOP » doit être explicité pour les visiteurs du portfolio.
