import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import { services } from "@/data/services";
import "./globals.css";

const SITE_URL = "https://yl-solution.fr";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Yoann Laubert - Concepteur d'applications & agents IA | Vannes",
  description:
    "Développeur freelance à Vannes. Conception d'applications sur mesure, agents IA et MCP : j'outille votre métier au plus près du terrain.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "développeur freelance",
    "concepteur d'applications",
    "application sur mesure",
    "React",
    "Next.js",
    "Java",
    "Spring Boot",
    "TypeScript",
    "Vannes",
    "MCP",
    "agents IA",
  ],
  openGraph: {
    title: "Yoann Laubert - Concepteur d'applications & agents IA | Vannes",
    description:
      "Développeur freelance à Vannes. Conception d'applications sur mesure, agents IA et MCP : j'outille votre métier au plus près du terrain.",
    url: "/",
    siteName: "YL-solution",
    type: "website",
    locale: "fr_FR",
    // og:image fourni automatiquement par src/app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: "Yoann Laubert - Concepteur d'applications & agents IA | Vannes",
    description:
      "Conception d'applications sur mesure, agents IA et MCP : j'outille votre métier au plus près du terrain.",
    // twitter:image fourni automatiquement par src/app/twitter-image.tsx
  },
};

// Tarification machine-readable des services (aligne sur content/services.json).
const servicePriceSpecs: Record<
  string,
  { price?: number; minPrice?: number; unitText?: string }
> = {
  "site-web": { minPrice: 500 },
  application: { minPrice: 1500 },
  api: { price: 250, unitText: "jour" },
  automatisation: { price: 250, unitText: "jour" },
  conseil: { price: 250, unitText: "jour" },
  maintenance: { minPrice: 20, unitText: "mois" },
};

// ProfessionalService plutot que Person : meilleur signal pour la recherche
// locale ("developpeur freelance Vannes") avec adresse, zone et tarifs.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "YL-solution",
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  email: "ylsolution.web@gmail.com",
  description:
    "Sites, applications et automatisations IA sur mesure pour PME, artisans et commerces. Connecteurs, scripts, agents IA : votre métier outillé au plus près du terrain.",
  priceRange: "€",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Vannes",
    addressRegion: "Bretagne",
    addressCountry: "FR",
  },
  areaServed: ["Vannes", "Morbihan", "Bretagne", "France"],
  founder: {
    "@type": "Person",
    name: "Yoann Laubert",
    jobTitle: "Concepteur d'applications et agents IA, développeur freelance",
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "Java",
      "Spring Boot",
      "Node.js",
      "PostgreSQL",
      "Agents IA",
      "MCP",
      "Automatisation",
    ],
  },
  sameAs: [
    "https://www.linkedin.com/in/yoann-laubert",
    "https://github.com/yoann-laubert",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Services",
    itemListElement: services.map((service) => {
      const spec = servicePriceSpecs[service.id];
      return {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.description,
        },
        ...(spec && {
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            priceCurrency: "EUR",
            ...(spec.price !== undefined && { price: spec.price }),
            ...(spec.minPrice !== undefined && { minPrice: spec.minPrice }),
            ...(spec.unitText && { unitText: spec.unitText }),
          },
        }),
      };
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased bg-bg-primary text-text-primary">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-accent focus:text-bg-primary focus:px-4 focus:py-2 focus:rounded-md focus:font-semibold"
        >
          Aller au contenu principal
        </a>
        <Providers>{children}</Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
