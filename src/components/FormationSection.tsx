"use client"

import { formations } from "@/data/formations"
import { AnimatedSection } from "@/components/AnimatedSection"
import { getServiceIcon } from "@/components/ServiceIcon"

export function FormationSection() {
  return (
    <section id="formation" aria-label="Formation" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-text-primary text-center mb-3">
            Formation
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-xl mx-auto">
            Une formation basique et pratique aux outils IA, pour que vous en gardiez la
            main au quotidien — que vous restiez sur du cloud ou que vous passiez en local.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {formations.map((module, index) => (
            <AnimatedSection key={module.id} delay={index * 0.08} className="h-full">
              <article className="h-full flex flex-col bg-bg-secondary border border-border rounded-xl p-6 hover:border-accent transition-colors duration-200">
                <div className="text-accent mb-4">{getServiceIcon(module.icon)}</div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {module.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">{module.description}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={formations.length * 0.08} className="mt-8 text-center">
          <p className="text-text-secondary text-sm">
            Modules à la carte, adaptés à votre équipe et à vos outils —{" "}
            <span className="text-accent font-semibold">350 € / demi-journée</span>.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
