# Index d'Architecture — Portfolio2026
> Généré le 2026-07-05 — Scanner v2

## Stack
- Type : Single-app
- Framework : Next.js 16.1.7 (App Router), React 19.2.3
- Langage : TypeScript
- Styling : Tailwind CSS 4
- Animation : motion (Framer Motion successor)
- Contenu : Markdown + gray-matter (content/projects/*.md) + JSON (content/*.json)
- Validation : Zod 4
- Email : @getbrevo/brevo (Brevo/Sendinblue transactional email)
- Booking widget : react-calendly
- Tests : Vitest 4 + Testing Library + jsdom (24 test files)
- Sitemap : next-sitemap (postbuild hook)
- Thème : next-themes
- Package manager : pnpm

## Env Vars
| Var | Fichier source | Statut .env.example |
|---|---|---|
| BREVO_API_KEY | src/lib/brevo.ts | ✅ déclarée |
| NEXT_PUBLIC_CALENDLY_URL | (composant Calendly, client-side) | ⚠️ non déclarée dans .env.example |

## Routes

### Pages (App Router)
| Route | Fichier |
|---|---|
| `/` | src/app/page.tsx |

Single-page portfolio (sections composées dans page.tsx : Hero, Projects, Services, Skills, Contact, MCP).

### API Routes
| Méthode | Route | Fichier | Rôle |
|---|---|---|---|
| GET | /api/ai | src/app/api/ai/route.ts | Génère un mirroir Markdown du profil/projets/services/skills, pensé pour consommation par agents IA |
| POST | /api/contact | src/app/api/contact/route.ts | Traite le formulaire de contact, valide via Zod, envoie l'email via Brevo |
| GET | /api/docs | src/app/api/docs/route.ts | Documentation de l'API (270 lignes, probablement OpenAPI/HTML) |
| GET | /api/mcp | src/app/api/mcp/route.ts | Expose profile/projects/services/skills en JSON pour un serveur MCP |
| GET | /api/portfolio/profile | src/app/api/portfolio/profile/route.ts | Retourne le profil (via getProfile()) |
| GET | /api/portfolio/projects | src/app/api/portfolio/projects/route.ts | Liste des projets (via getProjects()) |
| GET | /api/portfolio/projects/:id | src/app/api/portfolio/projects/[id]/route.ts | Détail d'un projet (via getProjectById()) |
| GET | /api/portfolio/services | src/app/api/portfolio/services/route.ts | Liste des services |
| GET | /api/portfolio/skills | src/app/api/portfolio/skills/route.ts | Liste des compétences |

Toutes les routes GET portfolio/* sont read-only, pas d'auth (site public), cache HTTP `s-maxage=3600`.

## Modules

### 📦 Module: Content (couche données)
- Fichier : src/lib/content.ts
- Types exportés : `Profile`, `ProjectMeta`, `ProjectContent extends ProjectMeta`, `ServiceData`, `SkillData`
- Fonctions : `getProfile()`, `getServices()`, `getSkills()`, `getProjects()`, `getProjectById(id)`
- Source des données : content/profile.json, content/services.json, content/skills.json, content/projects/*.md (frontmatter via gray-matter)
- Tests : src/lib/content.test.ts (9 tests)

### 📦 Module: Contact / Email
- Route : POST /api/contact → src/app/api/contact/route.ts
- Validation : src/lib/schemas.ts → `contactSchema` (Zod), type `ContactFormData`
- Envoi email : src/lib/brevo.ts → `sendContactEmail(data)`, `ConfigurationError` (levée si BREVO_API_KEY absente)
- Composant : src/components/ContactSection.tsx
- Tests : brevo.test.ts (5), schemas.test.ts (12), ContactSection.test.tsx (28)

### 📦 Module: Projects (data statique + affichage)
- Data : src/data/projects.ts → `ProjectData[]` (interface + tableau, 69 lignes)
- Composants : ProjectCard.tsx, ProjectsSection.tsx, PhoneMockup.tsx (mockup téléphone pour projets mobiles, ex. LOAR)
- Tests : projects.test.ts (4), ProjectCard.test.tsx (4), ProjectsSection.test.tsx (1), PhoneMockup.test.tsx (6)

### 📦 Module: Services / Skills (data statique)
- src/data/services.ts → `ServiceData[]`
- src/data/skills.ts → `SkillData[]`
- Composants : ServiceCard.tsx, ServicesSection.tsx, SkillBadge.tsx, SkillsSection.tsx
- API `groupSkillsByCategory` (dans route.ts /api/ai) regroupe les skills par catégorie

### 📦 Module: ChatAgent (assistant IA embarqué)
- Fichier : src/components/ChatAgent.tsx
- Types locaux : `ProjectMeta`, `ProjectContent`, `SkillData`, `ServiceData`, `ChatAction`, `ChatMessage`
- Tests : ChatAgent.test.tsx (12)
- Consomme vraisemblablement /api/mcp ou /api/ai pour contexte

### 📦 Module: MCP (Model Context Protocol)
- Route : GET /api/mcp → JSON structuré (profile inline + projects/services/skills importés depuis src/data)
- Composant : MCPSection.tsx (présente la fonctionnalité MCP sur le site)
- Tests : MCPSection.test.tsx (10), mcp/route.test.ts

### Props des Composants Exportés
| Composant | Props obligatoires | Props optionnelles |
|---|---|---|
| PhoneMockup | `screens`, `appName` | — |
| ProjectCard | `project`, `isOpen`, `onToggle` | — |

### Règles Métier Identifiées
Aucune règle d'autorisation/accès détectée (site public, pas d'auth, pas de rôles). Seule logique métier notable :
- `ConfigurationError` levée dans brevo.ts si `BREVO_API_KEY` absente → bloque l'envoi d'email de contact.

## Transversal

### Hooks
- src/hooks/useScrollSpy.ts → `useScrollSpy(sectionIds)` — détection de section active au scroll (nav sticky)

### Layout / Providers
- src/components/Providers.tsx — providers globaux (probablement next-themes)
- src/components/NavBar.tsx, Footer.tsx — layout transversal
- src/components/ThemeToggle.tsx — bascule dark/light (next-themes)
- src/components/AnimatedSection.tsx — wrapper d'animation générique (motion), utilisé par les sections

### Call Sites (fonctions à fort impact)
- `getProfile/getProjects/getServices/getSkills` (src/lib/content.ts) → consommées par /api/ai/route.ts, /api/portfolio/*/route.ts, potentiellement page.tsx
- `sendContactEmail` (src/lib/brevo.ts) → appelée uniquement par /api/contact/route.ts

## Métriques
- Routes : 1 page + 9 API routes = 10
- Modules métier : 6 (Content, Contact/Email, Projects, Services/Skills, ChatAgent, MCP)
- Fichiers test : 24 (colocated `*.test.ts(x)`, Vitest)
- Fichiers source (src/) : ~35 hors tests
- Fichier le plus long : src/app/api/docs/route.ts (270 lignes)

## Points d'attention
- `NEXT_PUBLIC_CALENDLY_URL` utilisée dans le code mais absente de `.env.example` — à documenter.
- Pas de base de données / ORM : tout le contenu est statique (JSON + Markdown), donc pas de couche persistence à indexer.
- Aucune authentification : toutes les routes API sont publiques en lecture (sauf POST /api/contact qui écrit un email, pas de state).
- `src/app/api/docs/route.ts` (270 lignes) est le fichier le plus dense — probablement une doc HTML/Markdown embarquée en dur, candidat à externaliser si elle grossit encore.
