import HelpdeskLayout from '@/layouts/helpdesk-layout';
import { categoryLabel, formatDate, priorityLabel, priorityTone, statusLabel, triageLabel, triageTone } from '@/lib/helpdesk';
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type Message = { id: number; author: string; body: string; created_at: string | null };
type Citation = { id: number; title: string; excerpt: string };
type Ticket = {
    id: number;
    subject: string;
    requester_name: string;
    requester_email: string;
    channel: string;
    status: string;
    priority: string;
    category: string | null;
    summary: string | null;
    suggested_reply: string | null;
    citations: Citation[];
    triage_status: string;
    triage_error: string | null;
    ai_model: string | null;
    triaged_at: string | null;
    created_at: string | null;
    messages: Message[];
};

type Shared = { basePath?: string };

export default function TicketShow({ ticket }: { ticket: Ticket }) {
    const { basePath = '' } = usePage<Shared>().props;
    const [copied, setCopied] = useState(false);
    const [working, setWorking] = useState(false);
    const running = ticket.triage_status === 'pending' || ticket.triage_status === 'running';

    useEffect(() => {
        if (!running) return;
        const timer = window.setInterval(() => {
            router.reload({ only: ['ticket'] });
        }, 3500);

        return () => window.clearInterval(timer);
    }, [running]);

    const runTriage = () => {
        setWorking(true);
        router.post(
            `${basePath}/tickets/${ticket.id}/triage`,
            {},
            {
                preserveScroll: true,
                onFinish: () => setWorking(false),
            },
        );
    };

    const copyReply = async () => {
        if (!ticket.suggested_reply) return;
        await navigator.clipboard.writeText(ticket.suggested_reply);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
    };

    return (
        <HelpdeskLayout
            title={ticket.subject}
            eyebrow={`Ticket #${ticket.id} · ${ticket.requester_name}`}
            meta={
                <>
                    <div>
                        <Link className="hd-link" href={`${basePath}/`}>
                            ← Volver a la mesa
                        </Link>
                    </div>
                    <div>{formatDate(ticket.created_at)}</div>
                    <div>{statusLabel[ticket.status] ?? ticket.status}</div>
                </>
            }
        >
            <div className="hd-ticket">
                <header className="hd-ticket__head">
                    <div>
                        <div className="hd-tags" style={{ justifyContent: 'flex-start' }}>
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
                        <h2 className="hd-ticket__title">{ticket.subject}</h2>
                    </div>
                    <div className="hd-ticket__meta mono">
                        <div>{ticket.requester_name}</div>
                        <div>{ticket.requester_email}</div>
                        <div>Canal: {ticket.channel}</div>
                    </div>
                </header>

                <div className="hd-ticket__body">
                    <section aria-labelledby="thread-title">
                        <h2 id="thread-title" className="hd-sr-only">
                            Conversación
                        </h2>
                        <div className="hd-thread">
                            {ticket.messages.map((message) => (
                                <article
                                    className={`hd-message ${message.author === 'agent' ? 'hd-message--agent' : ''}`}
                                    key={message.id}
                                >
                                    <div className="hd-message__head">
                                        <span>{message.author === 'agent' ? 'Agente' : 'Cliente'}</span>
                                        <span>{formatDate(message.created_at)}</span>
                                    </div>
                                    <p className="hd-message__body">{message.body}</p>
                                </article>
                            ))}
                        </div>
                    </section>

                    <aside aria-labelledby="ai-title">
                        <div className="hd-ai">
                            <div className="hd-ai__head">
                                <h2 className="hd-ai__title" id="ai-title">
                                    Triage por IA
                                </h2>
                                <span className="hd-panel__note">{ticket.ai_model ?? 'Pendiente'}</span>
                            </div>

                            {ticket.triage_status === 'failed' ? (
                                <div className="hd-ai__block">
                                    <span className="hd-ai__label">Error</span>
                                    <p className="hd-ai__error">
                                        No se pudo completar el triage. {ticket.triage_error ?? 'Revisá la configuración del proveedor.'}
                                    </p>
                                </div>
                            ) : null}

                            {ticket.triage_status === 'pending' || ticket.triage_status === 'running' ? (
                                <div className="hd-ai__block">
                                    <span className="hd-ai__label">Estado</span>
                                    <p className="hd-ai__text">
                                        {ticket.triage_status === 'running'
                                            ? 'El modelo está leyendo el hilo y la base de conocimiento.'
                                            : 'El ticket espera un worker de la cola.'}
                                    </p>
                                </div>
                            ) : null}

                            {ticket.summary ? (
                                <div className="hd-ai__block">
                                    <span className="hd-ai__label">Resumen</span>
                                    <p className="hd-ai__text">{ticket.summary}</p>
                                </div>
                            ) : null}

                            {ticket.suggested_reply ? (
                                <div className="hd-ai__block">
                                    <span className="hd-ai__label">Respuesta sugerida</span>
                                    <p className="hd-ai__reply">{ticket.suggested_reply}</p>
                                </div>
                            ) : null}

                            {ticket.citations.length > 0 ? (
                                <div className="hd-ai__block">
                                    <span className="hd-ai__label">Base de conocimiento</span>
                                    <ul className="hd-ai__citations">
                                        {ticket.citations.map((citation) => (
                                            <li key={citation.id}>
                                                <strong>{citation.title}</strong>
                                                <div>{citation.excerpt}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : null}

                            <div className="hd-ai__actions">
                                <button className="hd-button hd-button--small" type="button" onClick={runTriage} disabled={working || ticket.triage_status === 'running'}>
                                    {working || ticket.triage_status === 'running' ? 'Encolando…' : 'Volver a triagear'}
                                </button>
                                {ticket.suggested_reply ? (
                                    <button className="hd-button hd-button--ghost hd-button--small" type="button" onClick={copyReply}>
                                        {copied ? 'Copiado' : 'Copiar respuesta'}
                                    </button>
                                ) : null}
                            </div>
                            {ticket.triaged_at ? (
                                <p className="hd-ai__block mono" style={{ color: 'var(--color-ink-soft)' }}>
                                    Último triage: {formatDate(ticket.triaged_at)}
                                </p>
                            ) : null}
                        </div>
                    </aside>
                </div>
            </div>
        </HelpdeskLayout>
    );
}
