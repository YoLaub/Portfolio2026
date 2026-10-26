"use client"

import { AnimatedSection } from "@/components/AnimatedSection"

export function OkyrSection() {
  return (
    <section id="okyr" aria-label="Okyr" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <AnimatedSection>
          <div className="rounded-xl border border-border bg-bg-secondary p-7 sm:p-10 text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-accent mb-2">
              Automatisations, agents IA &amp; formation
            </p>
            <h2 className="text-2xl font-bold text-text-primary mb-3 text-balance">
              Pour automatiser vos processus, découvrez Okyr.
            </h2>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              Avec Okyr, nous concevons des automatisations et des agents IA destinés à prendre en charge
              des workflows complets. Besoin de former vos équipes à l’IA ou d’identifier des usages
              concrets ? Ce sujet est traité avec Okyr. YL Solution reste votre interlocuteur pour les
              sites, applications métier, intégrations techniques et leur fiabilité au quotidien.
            </p>
            <a
              href="https://okyr.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg bg-accent px-5 py-2.5 font-semibold text-bg-primary hover:opacity-90 transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Découvrir Okyr
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
