"use client"

import { useEffect, useId, useRef } from "react"
import { createPortal } from "react-dom"
import type { StepService } from "@/data/services"
import { StepIllustration } from "@/components/services/StepIllustration"
import styles from "@/components/services/services.module.css"

export const padStep = (i: number) => String(i + 1).padStart(2, "0")

// Buttons hidden by a media query (✕ on mobile, "← Les 7 étapes" on desktop)
// must not receive focus.
function isFocusable(el: HTMLElement) {
  return !el.hidden && getComputedStyle(el).display !== "none"
}

interface ConceptModalProps {
  steps: StepService[]
  index: number
  onNavigate: (index: number) => void
  onClose: () => void
}

export function ConceptModal({ steps, index, onNavigate, onClose }: ConceptModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  const n = steps.length
  const step = steps[index]
  const prev = steps[index - 1]
  const next = steps[index + 1]
  const stepLabel = `ÉTAPE ${padStep(index)} / ${padStep(n - 1)}`

  // Lock page scroll while open, focus the visible close control.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const target = [closeRef.current, backRef.current].find(
      (el): el is HTMLButtonElement => !!el && isFocusable(el)
    )
    target?.focus()
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  // Each step starts at the top (full-screen dialog on mobile).
  useEffect(() => {
    if (dialogRef.current) dialogRef.current.scrollTop = 0
  }, [index])

  useEffect(() => {
    const go = (delta: number) => onNavigate((index + delta + n) % n)

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") return onClose()
      if (e.key === "ArrowRight") return go(1)
      if (e.key === "ArrowLeft") return go(-1)
      if (e.key !== "Tab" || !dialogRef.current) return

      const items = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>("button, a[href]")
      ).filter(isFocusable)
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [index, n, onNavigate, onClose])

  return createPortal(
    <div className={`${styles.theme} ${styles.modal}`}>
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        tabIndex={-1}
        aria-label="Fermer l'explication"
      />
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.dialogArt}>
          <span className={styles.dialogStep}>{stepLabel}</span>
          <div className={styles.dialogIllus}>
            {/* key: remounting replays the line-drawing animation */}
            <StepIllustration
              key={step.id}
              id={step.id}
              className={styles.traitAnim}
              strokeWidth={2.2}
            />
          </div>
          <span className={styles.dialogImage}>{step.image}</span>
        </div>

        <div className={styles.dialogContent}>
          <div className={styles.dialogBar}>
            <span className={styles.dialogEyebrow}>COMPRENDRE EN 1 MINUTE</span>
            <button
              ref={backRef}
              type="button"
              className={`${styles.btn} ${styles.btnGhost} ${styles.back}`}
              onClick={onClose}
            >
              ← Les {n} étapes
            </button>
            <span className={styles.dialogMstep}>{stepLabel}</span>
            <button
              ref={closeRef}
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>

          <h3 id={titleId} className={styles.dialogTitle}>
            {step.title}
          </h3>
          <p className={styles.dialogPhrase}>{step.phrase}</p>
          <p className={styles.dialogStory}>{step.story}</p>

          <div className={styles.uses}>
            <span className={styles.label}>ÇA SERT À QUOI ?</span>
            <ul>
              {step.uses.map((use) => (
                <li key={use}>{use}</li>
              ))}
            </ul>
          </div>

          <div className={styles.role}>
            <div className={styles.roleHead}>
              <span className={styles.label}>ET MOI, LÀ-DEDANS ?</span>
              <span className={styles.chip}>{step.who}</span>
            </div>
            <span className={styles.roleText}>{step.role}</span>
            <span className={styles.rolePrice}>{step.price}</span>
          </div>

          <div className={styles.dialogNav}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnGhost}`}
              hidden={!prev}
              onClick={() => onNavigate(index - 1)}
            >
              {prev ? `← ${prev.title}` : ""}
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary} ${styles.next}`}
              onClick={() => onNavigate((index + 1) % n)}
            >
              {next ? `Suivant : ${next.title} →` : "Revenir au début →"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
