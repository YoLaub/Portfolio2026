"use client"

import { Fragment, useRef, useState } from "react"
import type { CSSProperties } from "react"
import { serviceSteps, serviceExtras } from "@/data/services"
import { StepIllustration } from "@/components/services/StepIllustration"
import { ConceptModal, padStep } from "@/components/services/ConceptModal"
import styles from "@/components/services/services.module.css"

// "Le numérique, marche par marche" (docs/bugs&correction/index (1).html):
// 7 steps drawn as a staircase on desktop, a vertical path below 1100px.
// Each step opens a concept modal explaining it in plain words.
export function ServicesSection() {
  const [current, setCurrent] = useState<number | null>(null)
  const triggers = useRef<(HTMLButtonElement | null)[]>([])
  const openedFrom = useRef<number | null>(null)
  const n = serviceSteps.length

  const open = (i: number) => {
    openedFrom.current = i
    setCurrent(i)
  }

  const close = () => {
    setCurrent(null)
    if (openedFrom.current !== null) triggers.current[openedFrom.current]?.focus()
  }

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className={`${styles.theme} ${styles.section}`}
    >
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <header className={styles.head}>
          <div>
            <div className={styles.kicker}>Mes services · comprendre avant de choisir</div>
            <h2 className={styles.title} id="services-title">
              Le numérique,
              <br />
              <span>marche par marche.</span>
            </h2>
          </div>
          <p className={styles.lead}>
            Chaque projet commence par une analyse du besoin offerte. Cliquez sur une marche :
            je vous explique le concept simplement, et où j&apos;interviens.
          </p>
        </header>

        <div className={styles.legend}>
          <span>
            <i aria-hidden="true" />
            Je m&apos;en occupe directement
          </span>
          <span>
            <i className={styles.legendOkyr} aria-hidden="true" />
            Avec Okyr, mon partenaire automatisation &amp; IA
          </span>
        </div>

        <ol className={styles.steps} aria-label={`Les ${n} étapes`}>
          {serviceSteps.map((step, i) => {
            const meta = `${padStep(i)}${
              step.okyr ? ` · ${step.tag}` : i === 0 ? " · COMMENCEZ ICI" : ""
            }`
            return (
              <li key={step.id} style={{ "--lift": n - 1 - i } as CSSProperties}>
                {i === 0 && <span className={styles.startHere}>COMMENCEZ ICI ↓</span>}
                <button
                  ref={(el) => {
                    triggers.current[i] = el
                  }}
                  type="button"
                  className={`${styles.step} ${step.okyr ? styles.isOkyr : ""}`}
                  data-okyr={String(step.okyr)}
                  aria-haspopup="dialog"
                  onClick={() => open(i)}
                >
                  <span className={styles.stepTop}>
                    <span className={styles.stepN}>{padStep(i)}</span>
                    <span className={styles.stepWho}>{step.tag}</span>
                  </span>
                  <span className={styles.stepIllus}>
                    <StepIllustration id={step.id} />
                  </span>
                  <span className={styles.stepBody} data-meta={meta}>
                    <span className={styles.stepTitle}>{step.title}</span>
                    <span className={styles.stepShort}>{step.short}</span>
                    <span className={styles.stepFoot}>
                      <span className={styles.stepPrice}>{step.priceShort}</span>
                      <span className={styles.stepCta}>Voir →</span>
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <div className={styles.extras}>
          <div className={styles.extrasList}>
            {serviceExtras.map((extra, i) => (
              <Fragment key={extra.id}>
                {i > 0 && <span className={styles.extrasSep} aria-hidden="true" />}
                <div>
                  <strong>{extra.title}</strong>
                  <small>
                    {extra.short} · {extra.priceShort}
                  </small>
                </div>
              </Fragment>
            ))}
          </div>
          <a className={`${styles.btn} ${styles.btnPrimary}`} href="#contact">
            Parler de votre besoin <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      {current !== null && (
        <ConceptModal
          steps={serviceSteps}
          index={current}
          onNavigate={setCurrent}
          onClose={close}
        />
      )}
    </section>
  )
}
