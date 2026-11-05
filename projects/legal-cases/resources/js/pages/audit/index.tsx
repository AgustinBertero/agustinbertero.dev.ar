import PageHead from '@/components/page-head';
import LegalLayout from '@/layouts/legal-layout';
import { formatDateTime } from '@/lib/legal';
import { router } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';

type Log = { id: number; action: string; user: string; auditable_type: string | null; auditable_id: number | null; meta: Record<string, unknown> | null; ip: string | null; created_at: string | null };
type Paginator = { data: Log[]; current_page: number; last_page: number; total: number };

export default function AuditIndex({ logs, filters }: { logs: Paginator; filters: { action: string } }) {
    const [action, setAction] = useState(filters.action);

    const search = (event: FormEvent) => {
        event.preventDefault();
        router.get('/audit', { action }, { preserveState: true, preserveScroll: true });
    };

    return (
        <LegalLayout>
            <PageHead kicker="Control" title="Auditoría" lede="Quién entró, qué vio y qué cambió. Es la trazabilidad del estudio, no un log técnico." actions={<span className="mono">{logs.total} eventos</span>} />

            <section className="lg-card">
                <div className="lg-card__head">
                    <h2 className="lg-card__title">Eventos</h2>
                    <form className="lg-actions" onSubmit={search}>
                        <div className="lg-field"><label className="lg-label" htmlFor="action">Acción</label><input id="action" className="lg-input" value={action} onChange={(e) => setAction(e.target.value)} placeholder="client., document., auth." /></div>
                        <button className="lg-button lg-button--ghost lg-button--small" type="submit">Filtrar</button>
                    </form>
                </div>
                {logs.data.length === 0 ? <p className="lg-empty">Sin eventos.</p> : (
                    <div className="lg-table-wrap">
                        <table className="lg-table">
                            <thead><tr><th>Acción</th><th>Usuario</th><th>Objeto</th><th>Detalle</th><th>IP</th><th>Fecha</th></tr></thead>
                            <tbody>
                                {logs.data.map((log) => (
                                    <tr key={log.id}>
                                        <td className="mono">{log.action}</td>
                                        <td>{log.user}</td>
                                        <td>{log.auditable_type ? `${log.auditable_type.split('\\').pop()} #${log.auditable_id}` : '—'}</td>
                                        <td className="lg-hint">{log.meta ? JSON.stringify(log.meta) : '—'}</td>
                                        <td>{log.ip ?? '—'}</td>
                                        <td className="lg-nowrap">{formatDateTime(log.created_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {logs.last_page > 1 ? (
                    <nav className="lg-pagination" aria-label="Paginación">
                        <button className="lg-button lg-button--ghost lg-button--small" disabled={logs.current_page === 1} onClick={() => router.get('/audit', { action: filters.action, page: logs.current_page - 1 })} type="button">Anterior</button>
                        <span className="is-current">{logs.current_page} / {logs.last_page}</span>
                        <button className="lg-button lg-button--ghost lg-button--small" disabled={logs.current_page === logs.last_page} onClick={() => router.get('/audit', { action: filters.action, page: logs.current_page + 1 })} type="button">Siguiente</button>
                    </nav>
                ) : null}
            </section>
        </LegalLayout>
    );
}
