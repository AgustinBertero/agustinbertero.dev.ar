import { copy } from "@/content/copy";
import { profile } from "@/content/profile";
import type { Locale } from "@/content/profile";

export function Notice({ locale }: { locale: Locale }) {
  const c = copy[locale].notice;

  const links = [
    { label: "LinkedIn", value: "in/agustinbertero", href: profile.linkedin },
    {
      label: locale === "es" ? "CV (PDF)" : "CV (PDF)",
      value: locale === "es" ? "Sin teléfono" : "No phone number",
      href: locale === "es" ? "/cv/agustin-bertero-cv.pdf" : "/cv/agustin-bertero-cv-en.pdf",
    },
  ];

  return (
    <div className="notice">
      <div>
        <div
          dangerouslySetInnerHTML={{
            __html: `<!--email_off--><a class="notice__mail" href="mailto:${profile.email}">${profile.email}</a><!--/email_off-->`,
          }}
        />
        <p style={{ marginTop: "1.5rem", maxWidth: "34rem", lineHeight: 1.55 }}>
          {c.lead}
        </p>
        <p
          className="mono"
          style={{ marginTop: "1.5rem", color: "var(--color-ink-soft)" }}
        >
          {profile.availability[locale]}
        </p>
      </div>

      <div className="notice__links">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            {...(link.href.startsWith("http")
              ? { target: "_blank", rel: "noreferrer noopener" }
              : {})}
          >
            <span>{link.label}</span>
            <span className="mono">{link.value}</span>
          </a>
        ))}
        <p className="mono" style={{ paddingTop: "1rem", color: "var(--color-ink-soft)" }}>
          {c.note}
        </p>
      </div>
    </div>
  );
}
