import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

type SharedProps = {
    name?: string;
    basePath?: string;
    flash?: { status?: string | null };
};

export default function HelpdeskLayout({
    children,
    eyebrow = 'Mesa de ayuda',
    title,
    lede,
    meta,
}: {
    children: ReactNode;
    eyebrow?: string;
    title: ReactNode;
    lede?: string;
    meta?: ReactNode;
}) {
    const { basePath = '', flash } = usePage<SharedProps>().props;
    const home = `${basePath}/`;

    return (
        <div className="hd-shell">
            <div className="hd-topbar">
                <div className="hd-topbar__left">
                    <Link className="hd-brand" href={home}>
                        Helpdesk<span> / Soporte</span>
                    </Link>
                    <span className="hd-badge">Demo pública</span>
                </div>
                <div className="hd-topbar__right">
                    <span className="mono">Datos sintéticos · reset nocturno</span>
                    <a className="hd-link mono" href="/">
                        Volver al portfolio
                    </a>
                </div>
            </div>

            <main id="main">
            <header className="hd-header">
                <div>
                    <p className="hd-kicker">{eyebrow}</p>
                    <h1 className="hd-title">{title}</h1>
                    {lede ? <p className="hd-lede">{lede}</p> : null}
                </div>
                {meta ? <div className="hd-header__meta mono">{meta}</div> : null}
            </header>

            {flash?.status ? (
                <p className="hd-flash" role="status">
                    {flash.status}
                </p>
            ) : null}

            {children}
            </main>

            <footer className="hd-foot mono">
                <span>Demo sintética: no introduzcas datos reales. Se reinicia cada noche.</span>
                <span>Laravel · React · TypeScript · PostgreSQL · DeepSeek</span>
            </footer>
        </div>
    );
}
