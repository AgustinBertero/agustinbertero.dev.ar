import { profile } from "@/content/profile";
import type { Locale } from "@/content/profile";

export function Findings({ locale }: { locale: Locale }) {
  return (
    <dl className="findings">
      {profile.stack.map((group) => (
        <div className="findings__row" key={group.label[locale]}>
          <dt className="mono">{group.label[locale]}</dt>
          <dd>{group.items}</dd>
        </div>
      ))}
    </dl>
  );
}
