import { Landing } from "@/components/Landing";
import { profile } from "@/content/profile";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Full Stack Developer",
  url: "https://agustinbertero.dev.ar/",
  email: `mailto:${profile.email}`,
  sameAs: [profile.linkedin, profile.github],
  address: { "@type": "PostalAddress", addressCountry: "AR" },
  knowsAbout: [
    "PHP",
    "Laravel",
    "React",
    "TypeScript",
    "Linux",
    "Docker",
    "Cloudflare",
    "AWS",
  ],
  knowsLanguage: ["es", "it", "en"],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Landing locale="es" />
    </>
  );
}
