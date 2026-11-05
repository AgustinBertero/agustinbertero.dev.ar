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
    "Full Stack Developer focused on PHP/Laravel, React and TypeScript, with hands-on experience in Linux and cloud infrastructure.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "/en/",
    languages: { es: "/", en: "/en/" },
  },
  openGraph: {
    type: "profile",
    siteName: "Agustin Bertero",
    locale: "en_US",
    alternateLocale: ["es_AR"],
    url: "/en/",
  },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Motion />
        {children}
      </body>
    </html>
  );
}
