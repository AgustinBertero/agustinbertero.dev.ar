import { profile } from "@/content/profile";
import type { Locale } from "@/content/profile";

export function Record({ locale }: { locale: Locale }) {
  return (
    <>
      {profile.experience.map((job) => (
        <article key={job.company + job.period[locale]} className="entry">
          <p className="entry__date mono">{job.period[locale]}</p>
          <div>
            <h3 className="entry__role">{job.role[locale]}</h3>
            <p className="entry__org">
              {job.company} · {job.place[locale]} · {job.mode[locale]}
            </p>
            <ul>
              {job.bullets[locale].map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </>
  );
}
