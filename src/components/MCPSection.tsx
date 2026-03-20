import { AnimatedSection } from "@/components/AnimatedSection"

export function MCPSection() {
  return (
    <section
      id="mcp"
      aria-label="Connecteur MCP"
      className="py-20 bg-gradient-to-b from-accent-soft/50 to-transparent"
    >
      <div className="max-w-4xl mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-text-primary text-center mb-6">
            Connecteur MCP
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
            Ce portfolio expose un connecteur MCP (Model Context Protocol) — une
            API qui permet aux agents IA d&apos;accéder aux données structurées
            de mon profil : projets, compétences, services. Une preuve concrète
            d&apos;intégration IA, directement exploitable.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
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
        </AnimatedSection>
      </div>
    </section>
  )
}
