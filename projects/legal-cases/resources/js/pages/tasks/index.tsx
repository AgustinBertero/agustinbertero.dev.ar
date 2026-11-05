import PageHead from '@/components/page-head';
import LegalLayout from '@/layouts/legal-layout';
import { formatDate, taskStatusLabel } from '@/lib/legal';
import { Link, router, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';

type Task = { id: number; title: string; due_at: string | null; status: string; assigned_to: number | null; assignee: string | null; case_id: number | null; case_title: string | null; notes: string | null };
type Paginator = { data: Task[]; current_page: number; last_page: number; total: number };
type Option = { id: number; name: string };
type CaseOption = { id: number; title: string; client?: { name: string } };

export default function TasksIndex({ tasks, filters, users, cases }: { tasks: Paginator; filters: { status: string }; users: Option[]; cases: CaseOption[] }) {
    const [status, setStatus] = useState(filters.status);
    const form = useForm({ legal_case_id: '', title: '', due_at: '', status: 'pending', assigned_to: '', notes: '' });

    const search = (event: FormEvent) => {
        event.preventDefault();
        router.get('/tasks', { status }, { preserveState: true, preserveScroll: true });
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post('/tasks', { preserveScroll: true, onSuccess: () => form.reset('title', 'due_at', 'notes') });
    };

    return (
        <LegalLayout>
            <PageHead kicker="Trabajo interno" title="Tareas" lede="Lo que hay que hacer, con o sin expediente. Sin fechas inventadas: si no tiene fecha, se ve como pendiente." actions={<span className="mono">{tasks.total} registros</span>} />

            <div className="lg-grid">
                <section className="lg-card">
                    <div className="lg-card__head">
                        <h2 className="lg-card__title">Listado</h2>
                        <form className="lg-actions" onSubmit={search}>
                            <div className="lg-field"><label className="lg-label" htmlFor="task-status">Estado</label><select id="task-status" className="lg-select" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Todas</option><option value="pending">Pendientes</option><option value="done">Hechas</option></select></div>
                            <button className="lg-button lg-button--ghost lg-button--small" type="submit">Filtrar</button>
                        </form>
                    </div>
                    {tasks.data.length === 0 ? <p className="lg-empty">No hay tareas con ese filtro.</p> : (
                        <div className="lg-table-wrap">
                            <table className="lg-table">
                                <thead><tr><th>Tarea</th><th>Expediente</th><th>Fecha</th><th>Responsable</th><th>Estado</th><th /></tr></thead>
                                <tbody>
                                    {tasks.data.map((task) => (
                                        <tr key={task.id}>
                                            <td>{task.title}</td>
                                            <td>{task.case_id ? <Link href={`/cases/${task.case_id}`}>{task.case_title ?? '—'}</Link> : '—'}</td>
                                            <td className="lg-nowrap">{task.due_at ? formatDate(task.due_at) : 'Sin fecha'}</td>
                                            <td>{task.assignee ?? 'Sin asignar'}</td>
                                            <td><span className={`lg-chip ${task.status === 'done' ? 'lg-chip--closed' : 'lg-chip--pending'}`}>{taskStatusLabel[task.status] ?? task.status}</span></td>
                                            <td>{task.status === 'pending' ? <button className="lg-button lg-button--ghost lg-button--small" type="button" onClick={() => router.post(`/tasks/${task.id}/complete`, {}, { preserveScroll: true })}>Hecha</button> : null}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {tasks.last_page > 1 ? (
                        <nav className="lg-pagination" aria-label="Paginación">
                            <button className="lg-button lg-button--ghost lg-button--small" disabled={tasks.current_page === 1} onClick={() => router.get('/tasks', { status: filters.status, page: tasks.current_page - 1 })} type="button">Anterior</button>
                            <span className="is-current">{tasks.current_page} / {tasks.last_page}</span>
                            <button className="lg-button lg-button--ghost lg-button--small" disabled={tasks.current_page === tasks.last_page} onClick={() => router.get('/tasks', { status: filters.status, page: tasks.current_page + 1 })} type="button">Siguiente</button>
                        </nav>
                    ) : null}
                </section>

                <aside className="lg-stack">
                    <div className="lg-card">
                        <div className="lg-card__head"><h2 className="lg-card__title">Nueva tarea</h2></div>
                        <form className="lg-form lg-card__body" onSubmit={submit}>
                            <div className="lg-field"><label className="lg-label" htmlFor="task-case">Expediente (opcional)</label><select id="task-case" className="lg-select" value={form.data.legal_case_id} onChange={(e) => form.setData('legal_case_id', e.target.value)}><option value="">Sin expediente</option>{cases.map((item) => <option key={item.id} value={item.id}>{item.title}{item.client ? ` · ${item.client.name}` : ''}</option>)}</select></div>
                            <div className="lg-field"><label className="lg-label" htmlFor="task-title">Título</label><input id="task-title" className="lg-input" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} required />{form.errors.title ? <p className="lg-error">{form.errors.title}</p> : null}</div>
                            <div className="lg-form__row">
                                <div className="lg-field"><label className="lg-label" htmlFor="task-due">Fecha</label><input id="task-due" type="datetime-local" className="lg-input" value={form.data.due_at} onChange={(e) => form.setData('due_at', e.target.value)} /></div>
                                <div className="lg-field"><label className="lg-label" htmlFor="task-assignee">Responsable</label><select id="task-assignee" className="lg-select" value={form.data.assigned_to} onChange={(e) => form.setData('assigned_to', e.target.value)}><option value="">Sin asignar</option>{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></div>
                            </div>
                            <div className="lg-field"><label className="lg-label" htmlFor="task-notes">Notas</label><textarea id="task-notes" className="lg-textarea" value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} /></div>
                            <button className="lg-button" type="submit" disabled={form.processing}>{form.processing ? 'Guardando…' : 'Crear tarea'}</button>
                        </form>
                    </div>
                </aside>
            </div>
        </LegalLayout>
    );
}
