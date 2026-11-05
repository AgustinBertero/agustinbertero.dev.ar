import type { ReactNode } from 'react';

export default function PageHead({
    kicker,
    title,
    lede,
    actions,
}: {
    kicker: string;
    title: string;
    lede?: ReactNode;
    actions?: ReactNode;
}) {
    return (
        <header className="lg-page-head">
            <div>
                <p className="lg-kicker">{kicker}</p>
                <h1 className="lg-title">{title}</h1>
                {lede ? <p className="lg-lede">{lede}</p> : null}
            </div>
            {actions ? <div className="lg-actions">{actions}</div> : null}
        </header>
    );
}
