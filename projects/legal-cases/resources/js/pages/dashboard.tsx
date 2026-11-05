import PageHead from '@/components/page-head';
import LegalLayout from '@/layouts/legal-layout';
import { deadlineTone, formatDate, formatDateTime, isOverdue, statusTone } from '@/lib/legal';
import { Link } from '@inertiajs/react';

type Deadline = {
    id: number;
    title: string;
    due_at: string | null;
    status: string;
    case_id: number;
    case_title: string | null;
    client: string | null;
    assignee: string | null;
};

type Task = { id: number; title: string; due_at: string | null; case_id: number | null; case_title: string | null };
type Case = { id: number; title: string; client: string | null; status: string; updated_at: string | null };
type Activity = { id: number; action: string; user: string; created_at: string | null };

type Props = {
    stats: { open_cases: number; clients: number; overdue: number; upcoming: number };
    overdue: Deadline[];
    upcoming: Deadline[];
    tasks: Task[];
    recentCases: Case[];
    activity: Activity[];
};

const actions: Record<string, string> = {
    'auth.login': 'Ingreso',
    'auth.logout': 'Salida',
    'client.created': 'Cliente creado',
    'client.updated': 'Cliente actualizado',
    'client.deleted': 'Cliente eliminado',
    'case.created': 'Expediente creado',
    'case.updated': 'Expediente actualizado',
    'case.deleted': 'Expediente eliminado',
    'deadline.created': 'Vencimiento creado',
    'deadline.updated': 'Vencimiento actualizado',
    'deadline.deleted': 'Vencimiento eliminado',
    'task.created': 'Tarea creada',
    'task.updated': 'Tarea actualizada',
    'task.deleted': 'Tarea eliminada',
    'document.uploaded': 'Documento subido',
    'document.downloaded': 'Documento descargado',
    'document.deleted': 'Documento eliminado',
    'note.created': 'Nota agregada',
    'user.created': 'Usuario creado',
    'user.updated': 'Usuario actualizado',
};

export default function Dashboard({ stats, overdue, upcoming, tasks, recentCases, activity }: Props) {
    return (
        <LegalLayout>
            <PageHead
                kicker="Tablero"
                title="Hoy en la mesa"
                lede="Vencimientos, expedientes y tareas que necesitan una decisión. El orden es el de la agenda, no el del azar."
                actions={
                    <>
                        <Link className="lg-button" href="/cases">
                            Ver expedientes
                        </Link>
                        <Link className="lg-button lg-button--ghost" href="/deadlines">
                            Ver vencimientos
                        </Link>
                    </>
                }
            />

            <div className="lg-stats" aria-label="Resumen">
                <div className="lg-stat">
                    <span className="lg-stat__label">Expedientes abiertos</span>
                    <strong className="lg-stat__value">{stats.open_cases}</strong>
                </div>
                <div className="lg-stat">
                    <span className="lg-stat__label">Clientes</span>
                    <strong className="lg-stat__value">{stats.clients}</strong>
                </div>
                <div className="lg-stat">
                    <span className="lg-stat__label">Vencimientos vencidos</span>
                    <strong className="lg-stat__value lg-stat__value--alert">{stats.overdue}</strong>
                </div>
                <div className="lg-stat">
                    <span className="lg-stat__label">Próximos 14 días</span>
                    <strong className="lg-stat__value">{stats.upcoming}</strong>
                </div>
            </div>

            <div className="lg-grid">
                <div className="lg-stack">
                    <section className="lg-card" aria-labelledby="overdue-title">
                        <div className="lg-card__head">
                            <h2 className="lg-card__title" id="overdue-title">
                                Vencidos
                            </h2>
                            <span className="lg-card__note">Requieren atención</span>
                        </div>
                        {overdue.length === 0 ? (
                            <p className="lg-empty">No hay vencimientos vencidos.</p>
                        ) : (
                            <div className="lg-table-wrap">
                                <table className="lg-table">
                                    <thead>
                                        <tr>
                                            <th>Vencimiento</th>
                                            <th>Expediente</th>
                                            <th>Fecha</th>
                                            <th>Responsable</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {overdue.map((deadline) => (
                                            <tr key={deadline.id}>
                                                <td>
                                                    <Link href={`/cases/${deadline.case_id}`}>{deadline.title}</Link>
                                                </td>
                                                <td>{deadline.case_title ?? '—'}</td>
                                                <td className="lg-nowrap">
                                                    <span className={`lg-chip ${deadlineTone(deadline.status, deadline.due_at)}`}>
                                                        {formatDateTime(deadline.due_at)}
                                                    </span>
                                                </td>
                                                <td>{deadline.assignee ?? 'Sin asignar'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    <section className="lg-card" aria-labelledby="upcoming-title">
                        <div className="lg-card__head">
                            <h2 className="lg-card__title" id="upcoming-title">
                                Próximos vencimientos
                            </h2>
                            <span className="lg-card__note">30 días</span>
                        </div>
                        {upcoming.length === 0 ? (
                            <p className="lg-empty">No hay vencimientos en los próximos 30 días.</p>
                        ) : (
                            <div className="lg-table-wrap">
                                <table className="lg-table">
                                    <thead>
                                        <tr>
                                            <th>Vencimiento</th>
                                            <th>Expediente</th>
                                            <th>Fecha</th>
                                            <th>Responsable</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {upcoming.map((deadline) => (
                                            <tr key={deadline.id}>
                                                <td>
                                                    <Link href={`/cases/${deadline.case_id}`}>{deadline.title}</Link>
                                                </td>
                                                <td>{deadline.case_title ?? '—'}</td>
                                                <td className="lg-nowrap">{formatDateTime(deadline.due_at)}</td>
                                                <td>{deadline.assignee ?? 'Sin asignar'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>

                <div className="lg-stack">
                    <section className="lg-card" aria-labelledby="tasks-title">
                        <div className="lg-card__head">
                            <h2 className="lg-card__title" id="tasks-title">
                                Tareas pendientes
                            </h2>
                            <Link className="lg-link mono" href="/tasks">
                                Ver todas
                            </Link>
                        </div>
                        <div className="lg-card__body">
                            {tasks.length === 0 ? (
                                <p className="lg-empty">Sin tareas pendientes.</p>
                            ) : (
                                <div className="lg-stack">
                                    {tasks.map((task) => (
                                        <div className="lg-note" key={task.id}>
                                            <div className="lg-note__head">
                                                <span>{task.due_at ? formatDate(task.due_at) : 'Sin fecha'}</span>
                                                {task.case_id ? <span>{task.case_title}</span> : null}
                                            </div>
                                            <p className="lg-note__body">{task.title}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="lg-card" aria-labelledby="recent-title">
                        <div className="lg-card__head">
                            <h2 className="lg-card__title" id="recent-title">
                                Expedientes recientes
                            </h2>
                        </div>
                        <div className="lg-card__body">
                            {recentCases.length === 0 ? (
                                <p className="lg-empty">Todavía no hay expedientes.</p>
                            ) : (
                                <div className="lg-stack">
                                    {recentCases.map((item) => (
                                        <div key={item.id}>
                                            <Link className="lg-link" href={`/cases/${item.id}`}>
                                                {item.title}
                                            </Link>
                                            <div className="lg-hint">
                                                {item.client ?? 'Sin cliente'} ·{' '}
                                                <span className={`lg-chip ${statusTone(item.status)}`}>{item.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    <section className="lg-card" aria-labelledby="activity-title">
                        <div className="lg-card__head">
                            <h2 className="lg-card__title" id="activity-title">
                                Actividad
                            </h2>
                        </div>
                        <div className="lg-card__body">
                            <div className="lg-stack">
                                {activity.map((item) => (
                                    <div key={item.id} className="lg-hint">
                                        <strong>{actions[item.action] ?? item.action}</strong> · {item.user} ·{' '}
                                        {formatDateTime(item.created_at)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </LegalLayout>
    );
}
