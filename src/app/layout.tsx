import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yoannlaubert.dev"),
  title: "Yoann Laubert — Développeur Full-Stack React & Java | Vannes",
  description:
    "Portfolio de Yoann Laubert, développeur full-stack React/Next.js & Java basé à Vannes. Du concept au produit. Vite, bien, et en clair.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "développeur full-stack",
    "React",
    "Next.js",
    "Java",
    "Spring Boot",
    "TypeScript",
    "Vannes",
    "freelance",
    "portfolio",
  ],
  openGraph: {
    title: "Yoann Laubert — Développeur Full-Stack React & Java | Vannes",
    description:
      "Portfolio de Yoann Laubert, développeur full-stack React/Next.js & Java basé à Vannes. Du concept au produit. Vite, bien, et en clair.",
    url: "/",
    siteName: "Yoann Laubert — Portfolio",
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: "/images/hero.webp",
        width: 1200,
        height: 630,
        alt: "Yoann Laubert — Développeur Full-Stack React & Java",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yoann Laubert — Développeur Full-Stack React & Java | Vannes",
    description: "Du concept au produit. Vite, bien, et en clair.",
    images: ["/images/hero.webp"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Yoann Laubert",
  jobTitle: "Développeur Full-Stack React & Java",
  url: "https://yoannlaubert.dev",
  description: "Du concept au produit. Vite, bien, et en clair.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Vannes",
    addressRegion: "Bretagne",
    addressCountry: "FR",
  },
  sameAs: [
    "https://www.linkedin.com/in/yoann-laubert",
    "https://github.com/yoann-laubert",
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "Java",
    "Spring Boot",
    "Tailwind CSS",
    "Node.js",
    "PostgreSQL",
    "REST API",
    "Docker",
  ],
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
