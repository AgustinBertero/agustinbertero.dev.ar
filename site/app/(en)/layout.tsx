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
    "Full Stack Developer focused on PHP/Laravel, React and TypeScript, with hands-on experience in Linux and cloud infrastructure. Open to remote roles in Argentina, Spain and Europe.",
  authors: [{ name: "Agustin Bertero", url: "https://portfolio.bertium.net/" }],
  creator: "Agustin Bertero",
  robots: { index: true, follow: true, "max-image-preview": "large" },
  alternates: {
    canonical: "/en/",
    languages: { es: "/", en: "/en/", "x-default": "/" },
  },
  openGraph: {
    type: "profile",
    siteName: "Agustin Bertero",
    locale: "en_US",
    alternateLocale: ["es_AR"],
    url: "/en/",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Agustin Bertero, Full Stack Developer — case-file portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
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
