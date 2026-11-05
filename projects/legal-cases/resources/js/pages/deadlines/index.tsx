import PageHead from '@/components/page-head';
import LegalLayout from '@/layouts/legal-layout';
import { deadlineStatusLabel, deadlineTone, deadlineTypeLabel, formatDateTime } from '@/lib/legal';
import { Link, router, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';

type Deadline = {
    id: number;
    title: string;
    type: string;
    due_at: string | null;
    status: string;
    assigned_to: number | null;
    assignee: string | null;
    case_id: number;
    case_title: string | null;
    client: string | null;
    notes: string | null;
};
type Paginator = { data: Deadline[]; current_page: number; last_page: number; total: number };
type Option = { id: number; name: string };
type CaseOption = { id: number; client_id: number; title: string; client?: { name: string } };

export default function DeadlinesIndex({
    deadlines,
    filters,
    users,
    cases,
}: {
    deadlines: Paginator;
    filters: { status: string; assigned_to: string };
    users: Option[];
    cases: CaseOption[];
}) {
    const [query, setQuery] = useState(filters);
    const form = useForm({
        legal_case_id: '',
        title: '',
        type: 'procedural',
        due_at: '',
        status: 'pending',
        assigned_to: '',
        notes: '',
    });

    const search = (event: FormEvent) => {
        event.preventDefault();
        router.get('/deadlines', query, { preserveState: true, preserveScroll: true });
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post('/deadlines', {
            preserveScroll: true,
            onSuccess: () => form.reset('title', 'due_at', 'notes'),
        });
    };

    return (
        <LegalLayout>
            <PageHead
                kicker="Agenda"
                title="Vencimientos"
                lede="Fechas que no se negocian: audiencias, presentaciones y plazos. Lo vencido aparece primero."
                actions={<span className="mono">{deadlines.total} registros</span>}
            />

            <div className="lg-grid">
                <section className="lg-card" aria-labelledby="deadlines-title">
                    <div className="lg-card__head">
                        <h2 className="lg-card__title" id="deadlines-title">Agenda</h2>
                        <form className="lg-actions" onSubmit={search}>
                            <div className="lg-field">
                                <label className="lg-label" htmlFor="status">Estado</label>
                                <select id="status" className="lg-select" value={query.status} onChange={(e) => setQuery({ ...query, status: e.target.value })}>
                                    <option value="">Todos</option>
                                    <option value="pending">Pendientes</option>
                                    <option value="done">Cumplidos</option>
                                    <option value="missed">Vencidos</option>
                                </select>
                            </div>
                            <div className="lg-field">
                                <label className="lg-label" htmlFor="assigned_to">Responsable</label>
                                <select id="assigned_to" className="lg-select" value={query.assigned_to} onChange={(e) => setQuery({ ...query, assigned_to: e.target.value })}>
                                    <option value="">Todos</option>
                                    {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
                                </select>
                            </div>
                            <button className="lg-button lg-button--ghost lg-button--small" type="submit">Filtrar</button>
                        </form>
                    </div>

                    {deadlines.data.length === 0 ? (
                        <p className="lg-empty">No hay vencimientos con esos filtros.</p>
                    ) : (
                        <div className="lg-table-wrap">
                            <table className="lg-table">
                                <thead>
                                    <tr><th>Vencimiento</th><th>Expediente</th><th>Fecha</th><th>Tipo</th><th>Responsable</th><th>Estado</th><th /></tr>
                                </thead>
                                <tbody>
                                    {deadlines.data.map((deadline) => (
                                        <tr key={deadline.id}>
                                            <td>{deadline.title}</td>
                                            <td><Link href={`/cases/${deadline.case_id}`}>{deadline.case_title ?? '—'}</Link><div className="lg-hint">{deadline.client ?? ''}</div></td>
                                            <td className="lg-nowrap">{formatDateTime(deadline.due_at)}</td>
                                            <td>{deadlineTypeLabel[deadline.type] ?? deadline.type}</td>
                                            <td>{deadline.assignee ?? 'Sin asignar'}</td>
                                            <td><span className={`lg-chip ${deadlineTone(deadline.status, deadline.due_at)}`}>{deadlineStatusLabel[deadline.status] ?? deadline.status}</span></td>
                                            <td>
                                                {deadline.status === 'pending' ? (
                                                    <button className="lg-button lg-button--ghost lg-button--small" type="button" onClick={() => router.post(`/deadlines/${deadline.id}/complete`, {}, { preserveScroll: true })}>Cumplir</button>
                                                ) : null}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {deadlines.last_page > 1 ? (
                        <nav className="lg-pagination" aria-label="Paginación">
                            <button className="lg-button lg-button--ghost lg-button--small" disabled={deadlines.current_page === 1} onClick={() => router.get('/deadlines', { ...filters, page: deadlines.current_page - 1 })} type="button">Anterior</button>
                            <span className="is-current">{deadlines.current_page} / {deadlines.last_page}</span>
                            <button className="lg-button lg-button--ghost lg-button--small" disabled={deadlines.current_page === deadlines.last_page} onClick={() => router.get('/deadlines', { ...filters, page: deadlines.current_page + 1 })} type="button">Siguiente</button>
                        </nav>
                    ) : null}
                </section>

                <aside className="lg-stack">
                    <div className="lg-card">
                        <div className="lg-card__head"><h2 className="lg-card__title">Nuevo vencimiento</h2></div>
                        <form className="lg-form lg-card__body" onSubmit={submit}>
                            <div className="lg-field">
                                <label className="lg-label" htmlFor="case">Expediente</label>
                                <select id="case" className="lg-select" value={form.data.legal_case_id} onChange={(e) => form.setData('legal_case_id', e.target.value)} required>
                                    <option value="">Elegir expediente</option>
                                    {cases.map((item) => <option key={item.id} value={item.id}>{item.title}{item.client ? ` · ${item.client.name}` : ''}</option>)}
                                </select>
                                {form.errors.legal_case_id ? <p className="lg-error">{form.errors.legal_case_id}</p> : null}
                            </div>
                            <div className="lg-field">
                                <label className="lg-label" htmlFor="title">Título</label>
                                <input id="title" className="lg-input" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} required />
                                {form.errors.title ? <p className="lg-error">{form.errors.title}</p> : null}
                            </div>
                            <div className="lg-form__row">
                                <div className="lg-field"><label className="lg-label" htmlFor="due_at">Fecha y hora</label><input id="due_at" type="datetime-local" className="lg-input" value={form.data.due_at} onChange={(e) => form.setData('due_at', e.target.value)} required /></div>
                                <div className="lg-field"><label className="lg-label" htmlFor="type">Tipo</label><select id="type" className="lg-select" value={form.data.type} onChange={(e) => form.setData('type', e.target.value)}>{Object.entries(deadlineTypeLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
                            </div>
                            <div className="lg-field"><label className="lg-label" htmlFor="assigned_to">Responsable</label><select id="assigned_to" className="lg-select" value={form.data.assigned_to} onChange={(e) => form.setData('assigned_to', e.target.value)}><option value="">Sin asignar</option>{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></div>
                            <div className="lg-field"><label className="lg-label" htmlFor="notes">Notas</label><textarea id="notes" className="lg-textarea" value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} /></div>
                            <button className="lg-button" type="submit" disabled={form.processing}>{form.processing ? 'Guardando…' : 'Agregar vencimiento'}</button>
                        </form>
                    </div>
                </aside>
            </div>
        </LegalLayout>
    );
}
