# Mémoire Projet — Portfolio2026

## En bref
Site portfolio personnel (Yoann Laubert, dev Full-Stack React & Java) en Next.js 16 / React 19 / TypeScript, single-page. Contenu statique (JSON + Markdown), pas de base de données. Expose une API REST publique (`/api/portfolio/*`) et deux endpoints pensés pour la consommation par des agents IA : `/api/ai` (Markdown) et `/api/mcp` (JSON, Model Context Protocol). ~35 fichiers source, 24 fichiers de tests (Vitest).

## Structure
```
src/
  app/
    page.tsx, layout.tsx        # page unique, sections composées
    api/
      ai/route.ts               # mirroir markdown du profil pour IA
      contact/route.ts          # POST formulaire contact -> Brevo
      docs/route.ts             # doc API (270 lignes)
      mcp/route.ts              # JSON pour serveur MCP
      portfolio/{profile,projects,projects/[id],services,skills}/route.ts
  components/                   # sections UI (Hero, Projects, Services, Skills, Contact, MCP, ChatAgent, NavBar, Footer...)
  data/                         # projects.ts, services.ts, skills.ts (arrays statiques typés)
  lib/                          # content.ts (lecture content/), brevo.ts (email), schemas.ts (zod)
  hooks/useScrollSpy.ts
content/                        # profile.json, services.json, skills.json, projects/*.md (frontmatter)
```

## Conventions détectées
- Composants et leur test colocalisés (`Foo.tsx` + `Foo.test.tsx`).
- Données "métier" dupliquées entre `content/*.json`+`*.md` (lues par `src/lib/content.ts`) et `src/data/*.ts` (arrays TS statiques) — deux sources à ne pas confondre selon la route consommée.
- Validation d'entrée via Zod (`src/lib/schemas.ts`), pas de couche ORM/DB.
- Pas d'authentification ni de rôles — toutes les routes API sont publiques.

## Risques identifiés
- `NEXT_PUBLIC_CALENDLY_URL` référencée dans le code mais absente de `.env.example`.
- Double source de vérité pour projects/services/skills (`content/` JSON/MD vs `src/data/*.ts`) — vérifier laquelle est la source active avant de modifier des données affichées.
- `src/app/api/docs/route.ts` est le fichier le plus long (270 lignes), à surveiller s'il continue de grossir.
