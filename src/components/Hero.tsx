import { HeroOrbit } from "./HeroOrbit"

// Contenu simple, pas encore relie a une source dynamique (cf handoff : "a
// rendre dynamique si possible"). A mettre a jour a la main / brancher plus
// tard sur l'agenda reel. Si aucun creneau : ne pas afficher "0 creneau",
// retirer la pill (mettre AVAILABILITY a null).
const AVAILABILITY: string | null = "2 créneaux libres en septembre"

// Chiffres de preuve du hero "Nuit" — a valider avant mise en ligne
// (cf docs/bugs&correction/design_handoff_hero_nuit/README.md).
const PROOF_STATS = [
  { value: "-70%", label: "de tâches manuelles" },
  { value: "Vos outils", label: "synchronisés entre eux" },
  { value: "1 seul flux", label: "CRM · mails · docs · API" },
]

const MARQUEE_ITEMS = [
  "SITES WEB",
  "APPLICATIONS MÉTIER",
  "AUTOMATISATIONS",
  "FORMATION IA",
  "INTÉGRATIONS API",
]

function MarqueeGroup() {
  return (
    <div className="flex shrink-0 items-center gap-10 pr-10 font-mono text-[15px] tracking-[.04em] whitespace-nowrap text-white/42">
      {MARQUEE_ITEMS.map((item) => (
        <span key={item} className="flex items-center gap-10">
          {item}
          <span className="text-[#E87C0A]" aria-hidden="true">
            ◆
          </span>
        </span>
      ))}
    </div>
  )
}

export function Hero() {
  return (
    <section id="hero" aria-label="Accueil" className="px-4 pt-6 sm:pt-8 lg:pt-10">
      <div className="mx-auto max-w-[1440px]">
        <div
          className="relative overflow-hidden rounded-[28px] bg-[#100f0e] text-white"
          style={{ fontFamily: "var(--font-manrope, ui-sans-serif, system-ui, sans-serif)" }}
        >
          {/* Decors : halo + grille technique, purement visuels */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-45 -right-30 h-[760px] w-[760px] rounded-full opacity-70 blur-[10px] motion-safe:animate-[hero-pulse-glow_9s_ease-in-out_infinite] motion-reduce:animate-none"
            style={{
              background:
                "radial-gradient(circle, rgba(232,124,10,.42), rgba(232,124,10,0) 62%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)",
              backgroundSize: "88px 88px",
            }}
          />

          <div className="relative grid grid-cols-1 gap-12 px-6 py-14 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16 lg:px-11 lg:py-[84px]">
            {/* Colonne texte */}
            <div className="flex flex-col items-start gap-7 motion-safe:animate-[hero-rise-in_.7s_cubic-bezier(.2,.8,.2,1)_both] motion-reduce:animate-none">
              {AVAILABILITY && (
                <div
                  className="inline-flex items-center gap-2.5 self-start rounded-full px-3.5 py-2 font-mono text-[13px] text-white/72"
                  style={{ border: "1px solid rgba(255,255,255,.16)" }}
                >
                  <span
                    className="h-[7px] w-[7px] rounded-full bg-[#6ee08a]"
                    style={{ boxShadow: "0 0 10px #6ee08a" }}
                  />
                  {AVAILABILITY}
                </div>
              )}

              <h1 className="m-0 text-[clamp(44px,11vw,104px)] leading-[0.92] font-extrabold tracking-[-.045em] text-balance">
                Programmer
                <br />
                pour{" "}
                <span className="relative inline-block text-[#E87C0A]">
                  gagner
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-1.5 -z-10 h-2.5 rounded"
                    style={{ background: "rgba(232,124,10,.28)" }}
                  />
                </span>
                <br />
                du temps.
              </h1>

              <p className="max-w-[520px] text-[17px] leading-[1.6] text-white/66 sm:text-[20px]">
                Développeur freelance. Sites, applications, automatisations et
                formation à l&apos;IA — des outils numériques sur mesure, pensés
                pour votre métier.
              </p>

              <div className="flex w-full flex-wrap items-center gap-3.5 sm:w-auto">
                <a
                  href="#contact"
                  className="group relative inline-flex flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-[14px] bg-[#E87C0A] px-6 py-4 text-[17px] font-bold text-[#100f0e] transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#ff9526] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E87C0A] sm:flex-none sm:px-[30px] sm:py-5"
                >
                  Prendre RDV
                  <span className="font-mono text-[18px]" aria-hidden="true">
                    →
                  </span>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 w-[60px] motion-safe:animate-[hero-sweep_4.5s_ease-in-out_infinite] motion-reduce:hidden"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent)",
                    }}
                  />
                </a>
                <a
                  href="#projets"
                  className="inline-flex flex-1 items-center justify-center gap-2.5 rounded-[14px] border border-white/20 px-6 py-4 text-[17px] font-semibold text-white transition-colors duration-200 hover:border-white/50 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:flex-none sm:px-7 sm:py-5"
                >
                  Voir mes projets
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-1.5 sm:gap-x-[34px]">
                {PROOF_STATS.map((stat, i) => (
                  <div key={stat.value} className="flex items-center gap-8 sm:gap-[34px]">
                    {i > 0 && (
                      <span className="hidden h-[38px] w-px bg-white/14 sm:block" aria-hidden="true" />
                    )}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[30px] leading-none font-extrabold text-white">
                        {stat.value}
                      </span>
                      <span className="font-mono text-[12px] leading-none text-white/55">
                        {stat.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne graphique */}
            <HeroOrbit />
          </div>

          {/* Bandeau defilant */}
          <div className="relative mt-8 overflow-hidden border-t border-white/8 py-[18px] sm:mt-14">
            <div className="flex w-max motion-safe:animate-[hero-marquee_26s_linear_infinite] motion-reduce:animate-none">
              <MarqueeGroup />
              <MarqueeGroup />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
