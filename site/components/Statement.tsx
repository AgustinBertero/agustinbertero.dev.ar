import { copy } from "@/content/copy";
import { profile } from "@/content/profile";
import type { Locale } from "@/content/profile";

export function Statement({ locale }: { locale: Locale }) {
  const c = copy[locale].statement;

  return (
    <div className="statement">
      <div className="statement__body">
        <p>{profile.summary[locale]}</p>
        <p>{profile.differential[locale]}</p>
        <p>
          {locale === "es"
            ? "Estudié abogacía antes que desarrollo. Cuando un cliente pide una integración, además de mirar la API miro qué datos viajan, quién los conserva y cuánto tiempo. Ese hábito viene del derecho y de la diplomatura en cibercrimen, y es la parte del trabajo que casi nunca se ve en un repositorio."
            : "I studied law before I studied development. When a client asks for an integration, besides reading the API I look at what data travels, who keeps it and for how long. That habit comes from law school and from the cybercrime postgraduate degree, and it is the part of the work a repository never shows."}
        </p>
      </div>

      <div className="credentials">
        <h3 className="mono">{c.credentialTitle}</h3>

        <div className="credential-group">
          <p className="mono">{c.education}</p>
          <ul>
            {profile.education.map((item) => (
              <li key={item.title[locale]}>
                <strong>{item.title[locale]}</strong>
                <span>
                  {item.org[locale]} · {item.period}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="credential-group">
          <p className="mono">{c.certifications}</p>
          <ul>
            {profile.certifications.map((item) => (
              <li key={item.title[locale]}>
                <strong>{item.title[locale]}</strong>
                <span>
                  {item.org} · {item.period}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="credential-group">
          <p className="mono">{c.languages}</p>
          <ul>
            {profile.languages.map((item) => (
              <li key={item.label[locale]}>
                <strong>
                  {item.label[locale]}: {item.level[locale]}
                </strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
