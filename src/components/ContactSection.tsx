"use client"

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import { AnimatedSection } from "@/components/AnimatedSection"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { contactSchema } from "@/lib/schemas"

const CalendlyWidget = dynamic(
  () => import("react-calendly").then((mod) => ({ default: mod.InlineWidget })),
  { ssr: false, loading: () => <div className="h-[580px]" /> }
)

const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

type ToastState = { type: "success" | "error"; message: string } | null

export function ContactSection() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const themeReady = mounted && resolvedTheme !== undefined
  const prefersReducedMotion = useReducedMotion()

  const [formData, setFormData] = useState({ name: "", email: "", message: "", website: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [toast, setToast] = useState<ToastState>(null)

  const submittingRef = useRef(false)
  const dismissToast = useCallback(() => setToast(null), [])

  useEffect(() => {
    if (!toast) return
    if (toast.type === "success") {
      const timer = setTimeout(dismissToast, 5000)
      return () => clearTimeout(timer)
    }
  }, [toast, dismissToast])

  useEffect(() => {
    if (!toast) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismissToast()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [toast, dismissToast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submittingRef.current) return
    setToast(null)

    const result = contactSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setStatus("loading")
    submittingRef.current = true

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      })

      if (response.ok) {
        setToast({ type: "success", message: "Message envoyé avec succès !" })
        setFormData({ name: "", email: "", message: "", website: "" })
      } else if (response.status === 400) {
        let data: Record<string, unknown> | undefined
        try {
          data = await response.json()
        } catch {
          // Non-JSON 400 response
        }
        if (data?.details) {
          const fieldErrors: Record<string, string> = {}
          for (const issue of data.details as Array<{ path?: string[]; message: string }>) {
            const field = issue.path?.[0] as string
            if (field && !fieldErrors[field]) {
              fieldErrors[field] = issue.message
            }
          }
          setErrors(fieldErrors)
        }
        setToast({ type: "error", message: "Erreur de validation. Vérifiez les champs." })
      } else {
        setToast({ type: "error", message: "Une erreur est survenue. Veuillez réessayer." })
      }
    } catch {
      setToast({ type: "error", message: "Impossible de contacter le serveur. Veuillez réessayer." })
    } finally {
      submittingRef.current = false
      setStatus("idle")
    }
  }

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

            <div className="w-full max-w-[500px] mt-2 p-4 lg:p-6">
              <AnimatePresence>
                {toast && (
                  <motion.div
                    role="alert"
                    aria-live="polite"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                    className={`mb-4 rounded-lg border p-4 text-sm ${
                      toast.type === "success"
                        ? "bg-success/10 border-success/30 text-success"
                        : "bg-error/10 border-error/30 text-error"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{toast.message}</span>
                      <button
                        type="button"
                        onClick={dismissToast}
                        className="shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
                        aria-label="Fermer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form
                aria-label="Formulaire de contact"
                onSubmit={handleSubmit}
                noValidate
                className="space-y-4"
              >
                <input
                  name="website"
                  type="hidden"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div>
                  <label htmlFor="contact-name" className="block text-text-primary text-sm font-medium mb-1">
                    Nom
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="Votre nom"
                    value={formData.name}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={`w-full px-4 py-3 rounded-lg bg-bg-primary text-text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary border ${
                      errors.name
                        ? "border-error ring-1 ring-error/30"
                        : "border-border focus-visible:border-accent"
                    }`}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-error text-sm mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-text-primary text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="Votre email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`w-full px-4 py-3 rounded-lg bg-bg-primary text-text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary border ${
                      errors.email
                        ? "border-error ring-1 ring-error/30"
                        : "border-border focus-visible:border-accent"
                    }`}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-error text-sm mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-text-primary text-sm font-medium mb-1">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Votre message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className={`w-full px-4 py-3 rounded-lg bg-bg-primary text-text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary border resize-none ${
                      errors.message
                        ? "border-error ring-1 ring-error/30"
                        : "border-border focus-visible:border-accent"
                    }`}
                  />
                  {errors.message && (
                    <p id="message-error" className="text-error text-sm mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  aria-busy={status === "loading"}
                  className="w-full bg-accent text-bg-primary font-semibold rounded-lg px-6 py-3 hover:bg-accent-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                >
                  {status === "loading" ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    "Envoyer"
                  )}
                </button>
              </form>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
