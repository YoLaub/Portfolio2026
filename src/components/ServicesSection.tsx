"use client"

import { services } from "@/data/services"
import { ServiceCard } from "@/components/ServiceCard"
import { AnimatedSection } from "@/components/AnimatedSection"
import { RoiSimulator } from "@/components/RoiSimulator"

export function ServicesSection() {
  return (
    <section id="services" aria-label="Services" className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-text-primary text-center mb-3">
            Mes Services
          </h2>
          <p className="text-text-secondary text-center mb-12">
            Chaque projet démarre par une{" "}
            <span className="text-accent font-semibold">analyse gratuite du besoin</span>,
            avant tout devis.
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const isOrphan = index === services.length - 1 && services.length % 3 === 1
            return (
              <AnimatedSection
                key={service.id}
                delay={index * 0.08}
                className={`h-full ${isOrphan ? "lg:col-start-2" : ""}`}
              >
                <ServiceCard service={service} />
              </AnimatedSection>
            )
          })}
        </div>

        <AnimatedSection delay={services.length * 0.08} className="mt-12">
          <div className="rounded-xl border border-border bg-bg-secondary p-7 sm:p-10">
            <p className="font-mono text-xs uppercase tracking-wider text-accent mb-2">
              Simulateur
            </p>
            <h3 className="text-2xl font-bold text-text-primary mb-2 text-balance">
              Un agent, combien ça rapporte ?
            </h3>
            <p className="text-text-secondary mb-8">
              Trois curseurs, une estimation chiffrée en temps réel du temps et de l&apos;argent
              qu&apos;une automatisation peut vous faire gagner.
            </p>
            <RoiSimulator />
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
