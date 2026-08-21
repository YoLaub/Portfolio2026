"use client"

import { approach } from "@/data/approach"
import { AnimatedSection } from "@/components/AnimatedSection"

export function ApproachSection() {
  return (
    <section id="approche" aria-label="Approche" className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-text-primary text-center mb-12">
            Mon Approche
          </h2>
        </AnimatedSection>

        <div className="divide-y divide-border">
          {approach.map((item, index) => (
            <AnimatedSection key={item.id} delay={index * 0.08}>
              <div className="grid grid-cols-1 md:grid-cols-[9rem_1fr] gap-x-8 gap-y-3 py-8 first:pt-0 last:pb-0">
                <span className="font-mono text-xs uppercase tracking-wider text-accent">
                  {item.tag}
                </span>
                <div className=" py-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-3 text-balance">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed max-w-2xl">
                    {item.body}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
