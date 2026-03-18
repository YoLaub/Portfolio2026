import Image from "next/image"

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
          <span className="inline-block bg-accent-soft text-accent font-mono text-sm px-3 py-1 rounded-full">
            Disponible · Vannes
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight">
            Yoann Laubert
          </h1>

          <p className="text-xl sm:text-2xl text-text-secondary font-medium">
            Développeur Full-Stack React &amp; Java
          </p>

          <p className="text-lg text-text-secondary max-w-lg">
            Du concept au produit. Vite, bien, et en clair.
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

        {/* Colonne droite — Photo */}
        <div className="max-w-[200px] md:max-w-none md:w-2/5 lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-[200px] aspect-square sm:max-w-[250px] md:max-w-[300px] lg:max-w-[400px]">
            <Image
              src="/images/hero.webp"
              alt="Yoann Laubert, développeur full-stack React Java basé à Vannes"
              width={400}
              height={400}
              priority
              className="rounded-2xl object-cover w-full h-full"
              sizes="(max-width: 768px) 200px, (max-width: 1024px) 300px, 400px"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
