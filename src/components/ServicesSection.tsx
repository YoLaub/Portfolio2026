"use client"

import { services } from "@/data/services"
import { ServiceCard } from "@/components/ServiceCard"
import { AnimatedSection } from "@/components/AnimatedSection"

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
          {services.map((service, index) => (
            <AnimatedSection key={service.id} delay={index * 0.08} className="h-full">
              <ServiceCard service={service} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
