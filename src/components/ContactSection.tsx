"use client"

import { AnimatedSection } from "@/components/AnimatedSection"
import { BookingSection } from "@/components/BookingSection"

export function ContactSection() {
  return (
    <section id="contact" aria-label="Contact" className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-text-primary text-center mb-4">
            Prenons contact
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
            Réservez directement un créneau en visio : c&apos;est
            l&apos;analyse gratuite du besoin, sans engagement.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <BookingSection />
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="flex flex-col items-center gap-4 mt-10">
            <div className="flex items-center gap-4 text-text-secondary text-sm">
              <span className="h-px w-12 bg-border" />
              ou
              <span className="h-px w-12 bg-border" />
            </div>

            <p className="text-text-secondary text-center">
              Une question, un message ?{" "}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("open-chat"))}
                className="text-accent font-semibold hover:text-accent-hover transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Écrivez-moi via l&apos;assistant
              </button>
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
