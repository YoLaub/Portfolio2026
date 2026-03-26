"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"
import { useScrollSpy } from "@/hooks/useScrollSpy"
import { ThemeToggle } from "@/components/ThemeToggle"

const NAV_LINKS = [
  { label: "Projets", href: "#projets" },
  { label: "Services", href: "#services" },
  { label: "Compétences", href: "#competences" },
] as const

const SECTION_IDS = NAV_LINKS.map((link) => link.href.slice(1))

const CALENDLY_URL = "https://calendly.com/yoann-laubert"

const MOBILE_MENU_ID = "mobile-nav-menu"

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const hasBeenOpenedRef = useRef(false)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const savedScrollYRef = useRef(0)
  const prefersReduced = useReducedMotion()

  const sectionIds = useMemo(() => SECTION_IDS, [])
  const activeSection = useScrollSpy(sectionIds)

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
  }, [])

  // Lock body scroll when menu is open (iOS Safari compatible)
  useEffect(() => {
    if (isMenuOpen) {
      hasBeenOpenedRef.current = true
      savedScrollYRef.current = window.scrollY
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.top = `-${savedScrollYRef.current}px`
      document.body.style.width = "100%"
    } else {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      window.scrollTo(0, savedScrollYRef.current)
    }
    return () => {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
    }
  }, [isMenuOpen])

  // Focus trap + Escape handler
  useEffect(() => {
    if (!isMenuOpen) return

    const overlay = overlayRef.current
    if (!overlay) return

    // Small delay to let AnimatePresence render
    const timeoutId = setTimeout(() => {
      const focusableEls = overlay.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      focusableEls[0]?.focus()
    }, 50)

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsMenuOpen(false)
        hamburgerRef.current?.focus()
        return
      }

      if (e.key !== "Tab") return

      const currentOverlay = overlayRef.current
      if (!currentOverlay) return

      const focusableEls = currentOverlay.querySelectorAll<HTMLElement>(
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
  }, [isMenuOpen])

  // Return focus to hamburger only after a real close (not initial mount)
  useEffect(() => {
    if (!isMenuOpen && hasBeenOpenedRef.current) {
      hamburgerRef.current?.focus()
    }
  }, [isMenuOpen])

  function handleNavClick() {
    if (isMenuOpen) {
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-bg-elevated/80 backdrop-blur-md border-b border-border">
      <nav
        aria-label="Navigation principale"
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
      >
        {/* Logo */}
        <a
          href="#"
          className="text-lg font-bold text-text-primary hover:text-accent transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Y.L
        </a>

        {/* Desktop navigation links */}
        <ul className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={handleNavClick}
                className={`text-sm transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  activeSection === link.href.slice(1)
                    ? "text-accent font-semibold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop right section */}
        <div className="hidden md:flex items-center gap-3">
          {/* Badge API */}
          <a
            href="#mcp"
            className="font-mono text-sm text-accent bg-accent-soft rounded px-2 py-1 hover:bg-accent/20 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            API
          </a>

          <ThemeToggle />

          {/* CTA Calendly */}
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-accent text-bg-primary font-semibold rounded-lg px-4 py-2 text-sm hover:bg-accent-hover transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Prendre RDV
          </a>
        </div>

        {/* Mobile hamburger button */}
        <button
          ref={hamburgerRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls={MOBILE_MENU_ID}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          className="md:hidden w-11 h-11 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
            aria-hidden="true"
          >
            {isMenuOpen ? (
              <>
                <line x1={18} y1={6} x2={6} y2={18} />
                <line x1={6} y1={6} x2={18} y2={18} />
              </>
            ) : (
              <>
                <line x1={3} y1={6} x2={21} y2={6} />
                <line x1={3} y1={12} x2={21} y2={12} />
                <line x1={3} y1={18} x2={21} y2={18} />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={overlayRef}
            id={MOBILE_MENU_ID}
            key="mobile-menu"
            role="dialog"
            aria-label="Menu de navigation"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-bg-primary flex flex-col md:hidden"
            {...(prefersReduced
              ? {}
              : {
                  initial: { x: "100%" },
                  animate: { x: 0 },
                  exit: { x: "100%" },
                  transition: { duration: 0.3, ease: "easeInOut" },
                })}
          >
            {/* Close button */}
            <div className="flex justify-end px-4 py-3">
              <button
                onClick={closeMenu}
                aria-label="Fermer le menu"
                className="w-11 h-11 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  <line x1={18} y1={6} x2={6} y2={18} />
                  <line x1={6} y1={6} x2={18} y2={18} />
                </svg>
              </button>
            </div>

            {/* Mobile nav links */}
            <ul className="flex flex-1 flex-col items-center justify-center gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={closeMenu}
                    className={`text-2xl transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      activeSection === link.href.slice(1)
                        ? "text-accent font-semibold"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}

              {/* API badge in mobile */}
              <li>
                <a
                  href="#mcp"
                  onClick={closeMenu}
                  className="font-mono text-lg text-accent bg-accent-soft rounded px-3 py-1.5 hover:bg-accent/20 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  API
                </a>
              </li>
            </ul>

            {/* Mobile bottom actions */}
            <div className="flex flex-col items-center gap-4 px-4 pb-8">
              <ThemeToggle />
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-accent text-bg-primary font-semibold rounded-lg px-6 py-3 text-base hover:bg-accent-hover transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Prendre RDV
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
