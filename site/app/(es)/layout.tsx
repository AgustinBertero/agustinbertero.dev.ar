import type { Metadata } from "next";
import { Motion } from "@/components/Motion";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio.bertium.net"),
  title: {
    default: "Agustin Bertero — Full Stack Developer (Laravel + React)",
    template: "%s · Agustin Bertero",
  },
  description:
    "Full Stack Developer especializado en PHP/Laravel, React y TypeScript, con experiencia real en infraestructura Linux y cloud. Disponible para trabajo remoto en Argentina, España y Europa.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/",
    languages: { es: "/", en: "/en/", "x-default": "/" },
  },
  openGraph: {
    type: "profile",
    siteName: "Agustin Bertero",
    locale: "es_AR",
    alternateLocale: ["en_US"],
    url: "/",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Agustin Bertero, Full Stack Developer — portfolio en formato expediente",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Motion />
        {children}
      </body>
    </html>
  );
}
