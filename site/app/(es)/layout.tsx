import type { Metadata } from "next";
import { Motion } from "@/components/Motion";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://agustinbertero.dev.ar"),
  title: {
    default: "Agustin Bertero — Full Stack Developer",
    template: "%s · Agustin Bertero",
  },
  description:
    "Full Stack Developer especializado en PHP/Laravel, React y TypeScript, con experiencia real en infraestructura Linux y cloud.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/",
    languages: { es: "/", en: "/en/" },
  },
  openGraph: {
    type: "profile",
    siteName: "Agustin Bertero",
    locale: "es_AR",
    alternateLocale: ["en_US"],
    url: "/",
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
