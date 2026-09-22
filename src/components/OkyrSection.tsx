"use client"

import { AnimatedSection } from "@/components/AnimatedSection"

export function OkyrSection() {
  return (
    <section id="okyr" aria-label="Okyr" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <AnimatedSection>
          <div className="rounded-xl border border-border bg-bg-secondary p-7 sm:p-10 text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-accent mb-2">
              Automatisation &amp; agents IA
            </p>
            <h2 className="text-2xl font-bold text-text-primary mb-3 text-balance">
              Ce n&apos;est plus mon métier ici, c&apos;est celui d&apos;Okyr
            </h2>
            <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
              Avec un associé, j&apos;ai fondé Okyr pour concentrer tout ce qui touche à
              l&apos;automatisation et aux agents IA. Pour un projet dans ce domaine,
              c&apos;est là-bas que ça se passe.
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
