import { HeroHalo } from "./HeroHalo"

export function Hero() {
  return (
    <section
      id="hero"
      aria-label="Accueil"
      className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 pb-20"
    >
      <div className="mx-auto max-w-6xl w-full flex flex-col md:flex-row items-center gap-10 lg:gap-16">
        {/* Colonne gauche — Texte */}
        <div className="flex-1 md:w-3/5 lg:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-6">

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight">
            Yoann Laubert
          </h1>

          <p className="text-xl sm:text-2xl text-text-secondary font-medium">
            Développeur freelance — je code ce qui vous fait gagner du temps
          </p>

          <p className="text-lg text-text-secondary max-w-lg">
            Sites, applications, automatisations : je construis des outils numériques sur mesure, pensés pour votre métier.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <a
              href="https://calendly.com/yoann-laubert"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-bg-primary font-semibold rounded-lg px-6 py-3 text-center hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
            >
              Prendre RDV
              <span className="sr-only"> (nouvelle fenêtre)</span>
            </a>
            <a
              href="#projets"
              className="border border-accent text-accent font-semibold rounded-lg px-6 py-3 text-center hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
            >
              Voir mes projets
            </a>
          </div>
        </div>

        {/* Colonne droite — Halo SVG */}
        <div className="max-w-[220px] md:max-w-none md:w-2/5 lg:w-1/2 flex justify-center">
          <HeroHalo />
        </div>
      </div>
    </section>
  )
}
