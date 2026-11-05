import { Landing } from "@/components/Landing";
import { profile } from "@/content/profile";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: "https://portfolio.bertium.net/en/",
  inLanguage: "en",
  mainEntity: {
    "@type": "Person",
    name: profile.name,
    jobTitle: "Full Stack Developer",
    description: profile.summary.en,
    url: "https://portfolio.bertium.net/en/",
    email: profile.email,
    sameAs: [profile.linkedin, profile.github],
    address: { "@type": "PostalAddress", addressCountry: "AR" },
    nationality: [
      { "@type": "Country", name: "Argentina" },
      { "@type": "Country", name: "Italy" },
    ],
    knowsAbout: [
      "PHP",
      "Laravel",
      "React",
      "TypeScript",
      "Next.js",
      "Linux",
      "Docker",
      "Cloudflare",
      "AWS",
      "MySQL",
      "PostgreSQL",
    ],
    knowsLanguage: ["Spanish", "Italian", "English"],
    alumniOf: [
      { "@type": "EducationalOrganization", name: "FPD Rioja" },
      {
        "@type": "EducationalOrganization",
        name: "Universidad Católica de Santiago del Estero",
      },
      { "@type": "EducationalOrganization", name: "Universidad Champagnat" },
    ],
  },
};

export default function EnHomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Landing locale="en" />
    </>
  );
}
