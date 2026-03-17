import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/Providers";
import "@/globals.css";

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
  title: "Yoann Laubert — Développeur Full-Stack React & Java | Vannes",
  description:
    "Portfolio de Yoann Laubert, développeur full-stack React/Next.js & Java basé à Vannes. Du concept au produit. Vite, bien, et en clair.",
  openGraph: {
    title: "Yoann Laubert — Développeur Full-Stack React & Java",
    description:
      "Portfolio de Yoann Laubert, développeur full-stack React/Next.js & Java basé à Vannes. Du concept au produit. Vite, bien, et en clair.",
    type: "website",
    locale: "fr_FR",
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
