"use client"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"

const MODAL_TITLE_ID = "legal-notice-title"

interface LegalNoticeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LegalNoticeModal({ isOpen, onClose }: LegalNoticeModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerFocusRef = useRef<HTMLElement | null>(null)
  const prefersReduced = useReducedMotion()

  // Lock body scroll + memorise l'element ayant ouvert la modale pour lui rendre le focus
  useEffect(() => {
    if (!isOpen) return

    triggerFocusRef.current = document.activeElement as HTMLElement
    const scrollY = window.scrollY
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = "100%"

    return () => {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      window.scrollTo(0, scrollY)
      triggerFocusRef.current?.focus()
    }
  }, [isOpen])

  // Focus trap + Escape
  useEffect(() => {
    if (!isOpen) return

    const dialog = dialogRef.current
    if (!dialog) return

    const timeoutId = setTimeout(() => {
      dialog.querySelector<HTMLElement>('button[aria-label="Fermer"]')?.focus()
    }, 50)

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose()
        return
      }

      if (e.key !== "Tab") return

      const currentDialog = dialogRef.current
      if (!currentDialog) return

      const focusableEls = currentDialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (focusableEls.length === 0) return

      const firstEl = focusableEls[0]
      const lastEl = focusableEls[focusableEls.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault()
          lastEl.focus()
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault()
          firstEl.focus()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-bg-primary/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
            {...(prefersReduced
              ? {}
              : {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  transition: { duration: 0.2 },
                })}
          />

          {/* Panneau glassmorphisme */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={MODAL_TITLE_ID}
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-border/60 bg-bg-elevated/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
            {...(prefersReduced
              ? {}
              : {
                  initial: { opacity: 0, y: 12, scale: 0.98 },
                  animate: { opacity: 1, y: 0, scale: 1 },
                  exit: { opacity: 0, y: 8, scale: 0.98 },
                  transition: { duration: 0.25, ease: "easeOut" },
                })}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id={MODAL_TITLE_ID} className="text-xl font-bold text-text-primary">
                Mentions légales
              </h2>
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-secondary hover:bg-bg-secondary/60 hover:text-text-primary transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <line x1={18} y1={6} x2={6} y2={18} />
                  <line x1={6} y1={6} x2={18} y2={18} />
                </svg>
              </button>
            </div>

            <div className="mt-6 space-y-5 text-sm leading-relaxed text-text-secondary">
              <section>
                <h3 className="mb-1.5 font-semibold text-text-primary">Éditeur du site</h3>
                <p>
                  Yoann Laubert, entrepreneur individuel (micro-entreprise)
                  <br />
                  SIRET : [EN COURS]
                  <br />
                  Adresse :Vannes, Bretagne, France
                  <br />
                  Contact :{" "}
                  <a
                    href="mailto:ylsolution.web@gmail.com"
                    className="text-accent hover:underline"
                  >
                    ylsolution.web@gmail.com
                  </a>
                </p>
              </section>

              <section>
                <h3 className="mb-1.5 font-semibold text-text-primary">
                  Directeur de la publication
                </h3>
                <p>Yoann Laubert</p>
              </section>

              <section>
                <h3 className="mb-1.5 font-semibold text-text-primary">Hébergement</h3>
                <p>
                  Hetzner Online GmbH
                  <br />
                  Industriestraße 25, 91710 Fürth, Allemagne
                  <br />
                  Site hébergé sur un serveur privé exploité par l&apos;éditeur.
                </p>
              </section>

              <section>
                <h3 className="mb-1.5 font-semibold text-text-primary">
                  Propriété intellectuelle
                </h3>
                <p>
                  L&apos;ensemble des contenus de ce site (textes, visuels, code) est la
                  propriété de Yoann Laubert, sauf mention contraire, et ne peut être
                  reproduit sans autorisation préalable.
                </p>
              </section>

              <section>
                <h3 className="mb-1.5 font-semibold text-text-primary">Données personnelles</h3>
                <p>
                  Les informations transmises via le formulaire de contact ou de prise de
                  rendez-vous ne sont utilisées que pour répondre à votre demande et ne
                  sont ni cédées, ni revendues à des tiers. Conformément au RGPD, vous
                  disposez d&apos;un droit d&apos;accès, de rectification et de suppression de
                  vos données en écrivant à l&apos;adresse ci-dessus.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
