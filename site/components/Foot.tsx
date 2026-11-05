import Link from "next/link";
import { copy } from "@/content/copy";
import { profile } from "@/content/profile";
import type { Locale } from "@/content/profile";

export function Foot({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const year = new Date().getFullYear();

  return (
    <footer className="foot shell mono">
      <span>{c.foot.cookies}</span>
      <span>
        © {year} {profile.name} · {c.foot.revision}
      </span>
      <span style={{ display: "flex", gap: "1rem" }}>
        <Link href={c.langSwitch.href} className="link link--toggle" aria-label={c.langSwitch.aria}>
          {c.langSwitch.label}
        </Link>
        <a href="#top" className="link">
          {c.foot.top}
        </a>
      </span>
    </footer>
  );
}
