import HelpdeskLayout from '@/layouts/helpdesk-layout';
import { categoryLabel, formatDate, priorityLabel, priorityTone, statusLabel, triageLabel, triageTone } from '@/lib/helpdesk';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';

type TicketRow = {
    id: number;
    subject: string;
    requester_name: string;
    requester_email: string;
    status: string;
    priority: string;
    category: string | null;
    triage_status: string;
    messages_count: number;
    created_at: string | null;
    updated_at: string | null;
};

type Paginator = {
    data: TicketRow[];
    current_page: number;
    last_page: number;
    total: number;
};

type Filters = { q: string; status: string; priority: string; triage: string };

type Props = {
    tickets: Paginator;
    filters: Filters;
    stats: { open: number; urgent: number; triaged: number; resolved: number };
};

type Shared = { basePath?: string };

export default function TicketsIndex({ tickets, filters, stats }: Props) {
    const { basePath = '' } = usePage<Shared>().props;
    const home = `${basePath}/`;
    const [query, setQuery] = useState(filters);
    const form = useForm({
        subject: '',
        requester_name: '',
        requester_email: '',
        message: '',
    });

    const applyFilters = (event?: FormEvent) => {
        event?.preventDefault();
        router.get(home, { ...query, page: 1 }, { preserveState: true, preserveScroll: true });
    };

    const clearFilters = () => {
        const empty = { q: '', status: '', priority: '', triage: '' };
        setQuery(empty);
        router.get(home, empty, { preserveState: true, preserveScroll: true });
    };

    const submitTicket = (event: FormEvent) => {
        event.preventDefault();
        form.post(`${basePath}/tickets`);
    };

    const goToPage = (page: number) => {
        router.get(home, { ...filters, page }, { preserveState: true, preserveScroll: true });
    };

    return (
        <HelpdeskLayout
            title={
                <>
                    Soporte que <em>prioriza</em> solo.
                </>
            }
            lede="Los tickets entran, se clasifican y se resumen antes de que alguien los abra. La cola y el triage por IA trabajan en segundo plano; la persona decide el próximo paso."
            meta={
                <>
                    <div>{stats.open} abiertos</div>
                    <div>{stats.urgent} de alta prioridad</div>
                    <div>{stats.triaged} triageados por IA</div>
                </>
            }
        >
            <div className="hd-stats" aria-label="Resumen de la mesa">
                <div className="hd-stat">
                    <span className="hd-stat__label">Abiertos</span>
                    <strong className="hd-stat__value">{stats.open}</strong>
                </div>
                <div className="hd-stat">
                    <span className="hd-stat__label">Alta prioridad</span>
                    <strong className="hd-stat__value hd-stat__value--stamp">{stats.urgent}</strong>
                </div>
                <div className="hd-stat">
                    <span className="hd-stat__label">Triage IA</span>
                    <strong className="hd-stat__value">{stats.triaged}</strong>
                </div>
                <div className="hd-stat">
                    <span className="hd-stat__label">Resueltos</span>
                    <strong className="hd-stat__value">{stats.resolved}</strong>
                </div>
            </div>

            <div className="hd-board">
                <section aria-labelledby="tickets-title">
                    <div className="hd-toolbar">
                        <div className="hd-field hd-field--grow">
                            <label className="hd-label" htmlFor="q">
                                Buscar
                            </label>
                            <input
                                id="q"
                                className="hd-input"
                                value={query.q}
                                onChange={(event) => setQuery({ ...query, q: event.target.value })}
                                placeholder="Asunto, persona o email"
                            />
                        </div>
                        <div className="hd-field">
                            <label className="hd-label" htmlFor="status">
                                Estado
                            </label>
                            <select
                                id="status"
                                className="hd-select"
                                value={query.status}
                                onChange={(event) => setQuery({ ...query, status: event.target.value })}
                            >
                                <option value="">Todos</option>
                                <option value="open">Abierto</option>
                                <option value="pending">Pendiente</option>
                                <option value="resolved">Resuelto</option>
                            </select>
                        </div>
                        <div className="hd-field">
                            <label className="hd-label" htmlFor="priority">
                                Prioridad
                            </label>
                            <select
                                id="priority"
                                className="hd-select"
                                value={query.priority}
                                onChange={(event) => setQuery({ ...query, priority: event.target.value })}
                            >
                                <option value="">Todas</option>
                                <option value="urgent">Urgente</option>
                                <option value="high">Alta</option>
                                <option value="normal">Normal</option>
                                <option value="low">Baja</option>
                            </select>
                        </div>
                        <div className="hd-field">
                            <label className="hd-label" htmlFor="triage">
                                Triage
                            </label>
                            <select
                                id="triage"
                                className="hd-select"
                                value={query.triage}
                                onChange={(event) => setQuery({ ...query, triage: event.target.value })}
                            >
                                <option value="">Todos</option>
                                <option value="done">Listo</option>
                                <option value="pending">En cola</option>
                                <option value="running">Procesando</option>
                                <option value="failed">Falló</option>
                            </select>
                        </div>
                        <button className="hd-button hd-button--small" onClick={applyFilters} type="button">
                            Filtrar
                        </button>
                        <button className="hd-button hd-button--ghost hd-button--small" onClick={clearFilters} type="button">
                            Limpiar
                        </button>
                    </div>

                    <div className="hd-list" aria-live="polite">
                        <h2 id="tickets-title" className="hd-sr-only">
                            Tickets
                        </h2>
                        {tickets.data.length === 0 ? (
                            <p className="hd-empty">No hay tickets con esos filtros.</p>
                        ) : (
                            tickets.data.map((ticket) => (
                                <Link
                                    className="hd-row"
                                    href={`${basePath}/tickets/${ticket.id}`}
                                    key={ticket.id}
                                >
                                    <div>
                                        <p className="hd-row__subject">{ticket.subject}</p>
                                        <div className="hd-row__meta">
                                            <span>#{ticket.id}</span>
                                            <span>{ticket.requester_name}</span>
                                            <span>{ticket.messages_count} mensajes</span>
                                            <span>{formatDate(ticket.created_at)}</span>
                                        </div>
                                    </div>
                                    <div className="hd-row__right">
                                        <span className="hd-row__id">{statusLabel[ticket.status] ?? ticket.status}</span>
                                        <div className="hd-tags">
                                            <span className={`hd-tag ${priorityTone(ticket.priority)}`}>
                                                {priorityLabel[ticket.priority] ?? ticket.priority}
                                            </span>
                                            {ticket.category ? (
                                                <span className="hd-tag">{categoryLabel[ticket.category] ?? ticket.category}</span>
                                            ) : null}
                                            <span className={`hd-tag ${triageTone(ticket.triage_status)}`}>
                                                {triageLabel[ticket.triage_status] ?? ticket.triage_status}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    {tickets.last_page > 1 ? (
                        <nav className="hd-pagination" aria-label="Paginación">
                            <button
                                className="hd-button hd-button--ghost hd-button--small"
                                type="button"
                                disabled={tickets.current_page === 1}
                                onClick={() => goToPage(tickets.current_page - 1)}
                            >
                                Anterior
                            </button>
                            <span className="is-current" aria-current="page">
                                {tickets.current_page} / {tickets.last_page}
                            </span>
                            <button
                                className="hd-button hd-button--ghost hd-button--small"
                                type="button"
                                disabled={tickets.current_page === tickets.last_page}
                                onClick={() => goToPage(tickets.current_page + 1)}
                            >
                                Siguiente
                            </button>
                        </nav>
                    ) : null}
                </section>

                <aside aria-labelledby="new-ticket-title">
                    <div className="hd-panel">
                        <div className="hd-panel__head">
                            <h2 className="hd-panel__title" id="new-ticket-title">
                                Nueva consulta
                            </h2>
                            <span className="hd-panel__note">Demo</span>
                        </div>
                        <form className="hd-form hd-panel__body" onSubmit={submitTicket}>
                            <div className="hd-field">
                                <label className="hd-label" htmlFor="subject">
                                    Asunto
                                </label>
                                <input
                                    id="subject"
                                    className="hd-input"
                                    value={form.data.subject}
                                    onChange={(event) => form.setData('subject', event.target.value)}
                                    placeholder="No puedo acceder a mi cuenta"
                                    required
                                />
                                {form.errors.subject ? <p className="hd-error">{form.errors.subject}</p> : null}
                            </div>
                            <div className="hd-form__row">
                                <div className="hd-field">
                                    <label className="hd-label" htmlFor="requester_name">
                                        Nombre
                                    </label>
                                    <input
                                        id="requester_name"
                                        className="hd-input"
                                        value={form.data.requester_name}
                                        onChange={(event) => form.setData('requester_name', event.target.value)}
                                        placeholder="Ana"
                                        required
                                    />
                                    {form.errors.requester_name ? <p className="hd-error">{form.errors.requester_name}</p> : null}
                                </div>
                                <div className="hd-field">
                                    <label className="hd-label" htmlFor="requester_email">
                                        Email
                                    </label>
                                    <input
                                        id="requester_email"
                                        type="email"
                                        className="hd-input"
                                        value={form.data.requester_email}
                                        onChange={(event) => form.setData('requester_email', event.target.value)}
                                        placeholder="ana@example.com"
                                        required
                                    />
                                    {form.errors.requester_email ? <p className="hd-error">{form.errors.requester_email}</p> : null}
                                </div>
                            </div>
                            <div className="hd-field">
                                <label className="hd-label" htmlFor="message">
                                    Mensaje
                                </label>
                                <textarea
                                    id="message"
                                    className="hd-textarea"
                                    value={form.data.message}
                                    onChange={(event) => form.setData('message', event.target.value)}
                                    placeholder="Contá qué pasa, desde cuándo y qué esperabas que ocurra."
                                    required
                                />
                                {form.errors.message ? <p className="hd-error">{form.errors.message}</p> : null}
                            </div>
                            <p className="hd-form__hint">
                                Datos de ejemplo. El ticket entra en la cola y el triage corre en segundo plano.
                            </p>
                            <button className="hd-button" type="submit" disabled={form.processing}>
                                {form.processing ? 'Creando…' : 'Crear ticket'}
                            </button>
                        </form>
                    </div>
                </aside>
            </div>
        </HelpdeskLayout>
    );
}
