import { Link, router, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { roleLabel } from '@/lib/legal';

type User = { id: number; name: string; email: string; role: string };
type Shared = {
    auth?: { user?: User | null };
    flash?: { status?: string | null };
    nav?: { overdue?: number; tasks?: number };
};

const nav = [
    { href: '/', num: '01', label: 'Tablero', key: 'dashboard' },
    { href: '/clients', num: '02', label: 'Clientes', key: 'clients' },
    { href: '/cases', num: '03', label: 'Expedientes', key: 'cases' },
    { href: '/deadlines', num: '04', label: 'Vencimientos', key: 'deadlines' },
    { href: '/tasks', num: '05', label: 'Tareas', key: 'tasks' },
    { href: '/users', num: '06', label: 'Usuarios', key: 'users', owner: true },
    { href: '/audit', num: '07', label: 'Auditoría', key: 'audit', owner: true },
];

export default function LegalLayout({ children }: { children: ReactNode }) {
    const { auth, flash, nav: counters = {} } = usePage<Shared>().props;
    const user = auth?.user;
    const current = usePage().url.split('?')[0];
    const isActive = (href: string) => (href === '/' ? current === '/' : current.startsWith(href));

    return (
        <div className="lg-shell">
            <aside className="lg-side">
                <Link className="lg-brand" href="/">
                    Estudio<span> / Expedientes</span>
                    <small>Mesa de trabajo</small>
                </Link>

                <nav className="lg-nav" aria-label="Secciones">
                    {nav
                        .filter((item) => !item.owner || user?.role === 'owner')
                        .map((item) => (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={`lg-nav__item ${isActive(item.href) ? 'is-active' : ''}`}
                                aria-current={isActive(item.href) ? 'page' : undefined}
                            >
                                <span className="lg-nav__num">{item.num}</span>
                                <span className="lg-nav__label">{item.label}</span>
                                {item.key === 'deadlines' && counters.overdue ? (
                                    <span className="lg-nav__badge" aria-label={`${counters.overdue} vencidos`}>
                                        {counters.overdue}
                                    </span>
                                ) : null}
                                {item.key === 'tasks' && counters.tasks ? (
                                    <span className="lg-nav__badge" aria-label={`${counters.tasks} tareas pendientes`}>
                                        {counters.tasks}
                                    </span>
                                ) : null}
                            </Link>
                        ))}
                </nav>

                <div className="lg-user">
                    <strong>{user?.name}</strong>
                    <span>{user?.email}</span>
                    <span className="lg-user__role">{roleLabel[user?.role ?? ''] ?? user?.role}</span>
                    <div className="lg-user__actions">
                        <button
                            type="button"
                            className="lg-link mono"
                            onClick={() => router.post('/logout')}
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </aside>

            <div className="lg-main">
                <div className="lg-page">
                    <div className="lg-topbar">
                        <span className="mono">Mesa de expedientes · datos privados</span>
                        <span className="mono">
                            {new Intl.DateTimeFormat('es-AR', {
                                weekday: 'long',
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                            }).format(new Date())}
                        </span>
                    </div>

                    {flash?.status ? (
                        <p className="lg-flash" role="status">
                            {flash.status}
                        </p>
                    ) : null}

                    {children}
                </div>
            </div>
        </div>
    );
}
