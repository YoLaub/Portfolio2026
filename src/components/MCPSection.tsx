import { AnimatedSection } from "@/components/AnimatedSection"

export function MCPSection() {
  return (
    <section
      id="mcp"
      aria-label="API & IA"
      className="py-20 bg-gradient-to-b from-accent-soft/50 to-transparent"
    >
      <div className="max-w-4xl mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-text-primary text-center mb-6">
            API & IA
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
            Ce portfolio expose une API REST publique, des routes AI-friendly et
            un connecteur MCP (Model Context Protocol). Explorez les données
            structurées de mon profil — projets, compétences, services —
            directement depuis votre terminal ou vos agents IA.
          </p>
        </AnimatedSection>

        {/* Bloc 1 : API REST */}
        <AnimatedSection delay={0.1}>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              API REST
            </h3>
            <div className="rounded-xl bg-bg-primary border border-border p-6 overflow-x-auto">
              <div className="mb-1">
                <span className="text-text-secondary font-mono text-xs uppercase tracking-wider">
                  Requête
                </span>
              </div>
              <pre className="font-mono text-sm">
                <code className="text-accent">
                  {`$ curl https://yoannlaubert.dev/api/portfolio/projects`}
                </code>
              </pre>

              <div className="mt-6 mb-1">
                <span className="text-text-secondary font-mono text-xs uppercase tracking-wider">
                  Réponse
                </span>
              </div>
              <pre className="font-mono text-sm">
                <code className="text-text-secondary">
                  {`[
  {
    "id": "restobook",
    "title": "RestoBook",
    "techStack": ["React", "Node.js", "MongoDB"],
    "image": "/images/projects/restobook.webp"
  },
  ...
]`}
                </code>
              </pre>
            </div>
          </div>
        </AnimatedSection>

        {/* Bloc 2 : Routes AI-Friendly */}
        <AnimatedSection delay={0.2}>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              AI-Friendly
            </h3>
            <div className="rounded-xl bg-bg-primary border border-border p-6 overflow-x-auto">
              <div className="mb-1">
                <span className="text-text-secondary font-mono text-xs uppercase tracking-wider">
                  Requête
                </span>
              </div>
              <pre className="font-mono text-sm">
                <code className="text-accent">
                  {`$ curl https://yoannlaubert.dev/ai.md`}
                </code>
              </pre>

              <div className="mt-6 mb-1">
                <span className="text-text-secondary font-mono text-xs uppercase tracking-wider">
                  Réponse
                </span>
              </div>
              <pre className="font-mono text-sm">
                <code className="text-text-secondary">
                  {`# Yoann Laubert
## Développeur Full-Stack React & Java
Vannes, Bretagne
...`}
                </code>
              </pre>
            </div>
          </div>
        </AnimatedSection>

        {/* Bloc 3 : Connecteur MCP (existant, conservé) */}
        <AnimatedSection delay={0.3}>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              Connecteur MCP
            </h3>
            <div className="rounded-xl bg-bg-primary border border-border p-6 overflow-x-auto">
              <div className="mb-1">
                <span className="text-text-secondary font-mono text-xs uppercase tracking-wider">
                  Requête
                </span>
              </div>
              <pre className="font-mono text-sm">
                <code className="text-accent">
                  {`$ curl https://yoannlaubert.dev/api/mcp`}
                </code>
              </pre>

              <div className="mt-6 mb-1">
                <span className="text-text-secondary font-mono text-xs uppercase tracking-wider">
                  Réponse
                </span>
              </div>
              <pre className="font-mono text-sm">
                <code className="text-text-secondary">
                  {`{
  "name": "Yoann Laubert",
  "title": "Développeur Full-Stack React & Java",
  "location": "Vannes, Bretagne",
  "projects": [...],
  "services": [...],
  "skills": [...]
}`}
                </code>
              </pre>
            </div>
          </div>
        </AnimatedSection>

        {/* Lien documentation OpenAPI */}
        <AnimatedSection delay={0.4}>
          <div className="text-center">
            <a
              href="/api/docs"
              className="inline-flex items-center gap-2 text-accent font-semibold hover:text-accent-hover transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Voir la documentation OpenAPI →
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
