import PageHead from '@/components/page-head';
import LegalLayout from '@/layouts/legal-layout';
import { caseStatusLabel, formatDateTime, matterLabel, statusTone } from '@/lib/legal';
import { Link, router, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';

type CaseRow = {
    id: number;
    title: string;
    case_number: string | null;
    client: string | null;
    client_id: number;
    matter: string;
    status: string;
    court: string | null;
    next_deadline: string | null;
};
type Paginator = { data: CaseRow[]; current_page: number; last_page: number; total: number };
type Option = { id: number; name: string };

export default function CasesIndex({
    cases,
    filters,
    clients,
}: {
    cases: Paginator;
    filters: { q: string; status: string; matter: string; client_id?: string };
    clients: Option[];
}) {
    const [query, setQuery] = useState(filters);
    const form = useForm({
        client_id: filters.client_id ?? '',
        title: '',
        case_number: '',
        court: '',
        jurisdiction: '',
        matter: 'civil',
        status: 'open',
        parties: '',
        description: '',
        started_at: '',
    });

    const search = (event: FormEvent) => {
        event.preventDefault();
        router.get('/cases', query, { preserveState: true, preserveScroll: true });
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post('/cases', {
            preserveScroll: true,
            onSuccess: () => form.reset('title', 'case_number', 'court', 'jurisdiction', 'parties', 'description'),
        });
    };

    return (
        <LegalLayout>
            <PageHead
                kicker="Expedientes"
                title="Casos en curso"
                lede="Cada expediente con su cliente, tribunal, estado y próximo vencimiento. La carátula es la puerta de entrada al resto."
                actions={<span className="mono">{cases.total} expedientes</span>}
            />

            <div className="lg-grid">
                <section className="lg-card" aria-labelledby="cases-title">
                    <div className="lg-card__head">
                        <h2 className="lg-card__title" id="cases-title">Listado</h2>
                        <form className="lg-actions" onSubmit={search}>
                            <div className="lg-field">
                                <label className="lg-label" htmlFor="case-q">Buscar</label>
                                <input id="case-q" className="lg-input" value={query.q} onChange={(e) => setQuery({ ...query, q: e.target.value })} placeholder="Carátula, número, cliente" />
                            </div>
                            <div className="lg-field">
                                <label className="lg-label" htmlFor="case-status">Estado</label>
                                <select id="case-status" className="lg-select" value={query.status} onChange={(e) => setQuery({ ...query, status: e.target.value })}>
                                    <option value="">Todos</option>
                                    <option value="open">Abierto</option>
                                    <option value="paused">Pausado</option>
                                    <option value="closed">Cerrado</option>
                                    <option value="archived">Archivado</option>
                                </select>
                            </div>
                            <div className="lg-field">
                                <label className="lg-label" htmlFor="case-matter">Materia</label>
                                <select id="case-matter" className="lg-select" value={query.matter} onChange={(e) => setQuery({ ...query, matter: e.target.value })}>
                                    <option value="">Todas</option>
                                    {Object.entries(matterLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                </select>
                            </div>
                            <button className="lg-button lg-button--ghost lg-button--small" type="submit">Filtrar</button>
                        </form>
                    </div>

                    {cases.data.length === 0 ? (
                        <p className="lg-empty">No hay expedientes con esos filtros.</p>
                    ) : (
                        <div className="lg-table-wrap">
                            <table className="lg-table">
                                <thead>
                                    <tr>
                                        <th>Carátula</th>
                                        <th>Cliente</th>
                                        <th>Número</th>
                                        <th>Materia</th>
                                        <th>Estado</th>
                                        <th>Próximo vencimiento</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cases.data.map((item) => (
                                        <tr key={item.id}>
                                            <td><Link href={`/cases/${item.id}`}>{item.title}</Link></td>
                                            <td>{item.client ?? '—'}</td>
                                            <td>{item.case_number ?? '—'}</td>
                                            <td>{matterLabel[item.matter] ?? item.matter}</td>
                                            <td><span className={`lg-chip ${statusTone(item.status)}`}>{caseStatusLabel[item.status] ?? item.status}</span></td>
                                            <td className="lg-nowrap">{item.next_deadline ? formatDateTime(item.next_deadline) : '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {cases.last_page > 1 ? (
                        <nav className="lg-pagination" aria-label="Paginación">
                            <button className="lg-button lg-button--ghost lg-button--small" disabled={cases.current_page === 1} onClick={() => router.get('/cases', { ...filters, page: cases.current_page - 1 })} type="button">Anterior</button>
                            <span className="is-current">{cases.current_page} / {cases.last_page}</span>
                            <button className="lg-button lg-button--ghost lg-button--small" disabled={cases.current_page === cases.last_page} onClick={() => router.get('/cases', { ...filters, page: cases.current_page + 1 })} type="button">Siguiente</button>
                        </nav>
                    ) : null}
                </section>

                <aside className="lg-stack" aria-labelledby="new-case-title">
                    <div className="lg-card">
                        <div className="lg-card__head">
                            <h2 className="lg-card__title" id="new-case-title">Nuevo expediente</h2>
                        </div>
                        <form className="lg-form lg-card__body" onSubmit={submit}>
                            <div className="lg-field">
                                <label className="lg-label" htmlFor="client_id">Cliente</label>
                                <select id="client_id" className="lg-select" value={form.data.client_id} onChange={(e) => form.setData('client_id', e.target.value)} required>
                                    <option value="">Elegir cliente</option>
                                    {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
                                </select>
                                {form.errors.client_id ? <p className="lg-error">{form.errors.client_id}</p> : null}
                            </div>
                            <div className="lg-field">
                                <label className="lg-label" htmlFor="title">Carátula</label>
                                <input id="title" className="lg-input" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} required />
                                {form.errors.title ? <p className="lg-error">{form.errors.title}</p> : null}
                            </div>
                            <div className="lg-form__row">
                                <div className="lg-field">
                                    <label className="lg-label" htmlFor="case_number">Número</label>
                                    <input id="case_number" className="lg-input" value={form.data.case_number} onChange={(e) => form.setData('case_number', e.target.value)} />
                                </div>
                                <div className="lg-field">
                                    <label className="lg-label" htmlFor="started_at">Inicio</label>
                                    <input id="started_at" type="date" className="lg-input" value={form.data.started_at} onChange={(e) => form.setData('started_at', e.target.value)} />
                                </div>
                            </div>
                            <div className="lg-form__row">
                                <div className="lg-field">
                                    <label className="lg-label" htmlFor="matter">Materia</label>
                                    <select id="matter" className="lg-select" value={form.data.matter} onChange={(e) => form.setData('matter', e.target.value)}>
                                        {Object.entries(matterLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                    </select>
                                </div>
                                <div className="lg-field">
                                    <label className="lg-label" htmlFor="status">Estado</label>
                                    <select id="status" className="lg-select" value={form.data.status} onChange={(e) => form.setData('status', e.target.value)}>
                                        <option value="open">Abierto</option>
                                        <option value="paused">Pausado</option>
                                        <option value="closed">Cerrado</option>
                                        <option value="archived">Archivado</option>
                                    </select>
                                </div>
                            </div>
                            <div className="lg-field">
                                <label className="lg-label" htmlFor="court">Tribunal</label>
                                <input id="court" className="lg-input" value={form.data.court} onChange={(e) => form.setData('court', e.target.value)} />
                            </div>
                            <div className="lg-field">
                                <label className="lg-label" htmlFor="parties">Partes</label>
                                <textarea id="parties" className="lg-textarea" value={form.data.parties} onChange={(e) => form.setData('parties', e.target.value)} placeholder="Actor / demandado, o partes del expediente" />
                            </div>
                            <div className="lg-field">
                                <label className="lg-label" htmlFor="description">Descripción</label>
                                <textarea id="description" className="lg-textarea" value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} />
                            </div>
                            <button className="lg-button" type="submit" disabled={form.processing}>{form.processing ? 'Guardando…' : 'Crear expediente'}</button>
                        </form>
                    </div>
                </aside>
            </div>
        </LegalLayout>
    );
}
