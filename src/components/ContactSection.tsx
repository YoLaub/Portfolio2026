"use client"

import { useSyncExternalStore } from "react"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import { AnimatedSection } from "@/components/AnimatedSection"

const CalendlyWidget = dynamic(
  () => import("react-calendly").then((mod) => ({ default: mod.InlineWidget })),
  { ssr: false, loading: () => <div className="h-[580px]" /> }
)

const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

export function ContactSection() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const themeReady = mounted && resolvedTheme !== undefined

  return (
    <section id="contact" aria-label="Contact" className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-text-primary text-center mb-4">
            Prenons contact
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
            Réservez un appel, téléchargez mon CV ou envoyez-moi un message.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="w-full max-w-[600px] mx-auto">
            {themeReady && calendlyUrl && (
              <CalendlyWidget
                url={calendlyUrl}
                styles={{ height: "580px" }}
                pageSettings={{
                  backgroundColor: isDark ? "0a0a0a" : "ffffff",
                  textColor: isDark ? "f5f5f5" : "171717",
                  primaryColor: isDark ? "f59e0b" : "d97706",
                  hideEventTypeDetails: false,
                  hideLandingPageDetails: false,
                }}
              />
            )}
            {themeReady && !calendlyUrl && (
              <p className="text-text-secondary text-center py-8">
                Calendly non configuré.
              </p>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="flex flex-col items-center gap-4 mt-10">
            <div className="flex items-center gap-4 text-text-secondary text-sm">
              <span className="h-px w-12 bg-border" />
              ou
              <span className="h-px w-12 bg-border" />
            </div>

            <a
              href="/cv.pdf"
              download
              className="inline-flex items-center gap-2 px-6 py-3 border border-accent/50 text-accent rounded-lg hover:bg-accent/10 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Télécharger mon CV
            </a>

            <div className="flex items-center gap-4 text-text-secondary text-sm mt-4">
              <span className="h-px w-12 bg-border" />
              ou
              <span className="h-px w-12 bg-border" />
            </div>

            <div className="w-full max-w-md mt-2 rounded-lg border border-border p-6 text-center">
              <p className="text-text-primary font-medium mb-4">
                Envoyez-moi un message
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Votre nom"
                  disabled
                  className="w-full px-4 py-2 rounded-md bg-bg-primary border border-border text-text-secondary opacity-50 cursor-not-allowed"
                />
                <input
                  type="email"
                  placeholder="Votre email"
                  disabled
                  className="w-full px-4 py-2 rounded-md bg-bg-primary border border-border text-text-secondary opacity-50 cursor-not-allowed"
                />
                <textarea
                  placeholder="Votre message"
                  disabled
                  rows={3}
                  className="w-full px-4 py-2 rounded-md bg-bg-primary border border-border text-text-secondary opacity-50 cursor-not-allowed resize-none"
                />
              </div>
              <button
                disabled
                className="mt-4 px-6 py-2 rounded-lg bg-accent/30 text-text-secondary cursor-not-allowed"
              >
                Bientôt disponible
              </button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
