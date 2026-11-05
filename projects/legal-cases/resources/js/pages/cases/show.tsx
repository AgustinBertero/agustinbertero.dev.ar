import PageHead from '@/components/page-head';
import LegalLayout from '@/layouts/legal-layout';
import {
    caseStatusLabel,
    deadlineStatusLabel,
    deadlineTone,
    deadlineTypeLabel,
    formatBytes,
    formatDate,
    formatDateTime,
    matterLabel,
    statusTone,
    taskStatusLabel,
} from '@/lib/legal';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';

type DeadlineRow = { id: number; title: string; type: string; due_at: string | null; status: string; assignee: string | null; notes: string | null };
type DocumentRow = { id: number; original_name: string; mime: string; size: number; sha256: string; uploaded_by: string | null; created_at: string | null };
type TaskRow = { id: number; title: string; due_at: string | null; status: string; assignee: string | null };
type NoteRow = { id: number; body: string; user: string | null; created_at: string | null };
type Case = {
    id: number;
    title: string;
    case_number: string | null;
    court: string | null;
    jurisdiction: string | null;
    matter: string;
    status: string;
    parties: string | null;
    description: string | null;
    started_at: string | null;
    closed_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    client: { id: number; name: string; tax_id: string | null; email: string | null; phone: string | null };
};

export default function CaseShow({
    case: legalCase,
    deadlines,
    documents,
    tasks,
    notes,
    users,
    clients,
}: {
    case: Case;
    deadlines: DeadlineRow[];
    documents: DocumentRow[];
    tasks: TaskRow[];
    notes: NoteRow[];
    users: { id: number; name: string }[];
    clients: { id: number; name: string }[];
}) {
    const { auth } = usePage<{ auth?: { user?: { role: string } } }>().props;
    const canDelete = auth?.user?.role !== 'assistant';
    const isOwner = auth?.user?.role === 'owner';

    const deadlineForm = useForm({
        legal_case_id: String(legalCase.id),
        title: '',
        type: 'procedural',
        due_at: '',
        status: 'pending',
        assigned_to: '',
        notes: '',
    });
    const taskForm = useForm({
        legal_case_id: String(legalCase.id),
        title: '',
        due_at: '',
        status: 'pending',
        assigned_to: '',
        notes: '',
    });
    const noteForm = useForm({ body: '' });
    const documentForm = useForm<{ file: File | null }>({ file: null });
    const editForm = useForm({
        client_id: String(legalCase.client.id),
        title: legalCase.title,
        case_number: legalCase.case_number ?? '',
        court: legalCase.court ?? '',
        jurisdiction: legalCase.jurisdiction ?? '',
        matter: legalCase.matter,
        status: legalCase.status,
        parties: legalCase.parties ?? '',
        description: legalCase.description ?? '',
        started_at: legalCase.started_at ?? '',
        closed_at: legalCase.closed_at ?? '',
    });

    const addDeadline = (event: FormEvent) => {
        event.preventDefault();
        deadlineForm.post('/deadlines', {
            preserveScroll: true,
            onSuccess: () => deadlineForm.reset('title', 'due_at', 'notes'),
        });
    };

    const addTask = (event: FormEvent) => {
        event.preventDefault();
        taskForm.post('/tasks', {
            preserveScroll: true,
            onSuccess: () => taskForm.reset('title', 'due_at', 'notes'),
        });
    };

    const addNote = (event: FormEvent) => {
        event.preventDefault();
        noteForm.post(`/cases/${legalCase.id}/notes`, {
            preserveScroll: true,
            onSuccess: () => noteForm.reset(),
        });
    };

    const upload = (event: FormEvent) => {
        event.preventDefault();
        documentForm.post(`/cases/${legalCase.id}/documents`, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => documentForm.reset(),
        });
    };

    const saveCase = (event: FormEvent) => {
        event.preventDefault();
        editForm.put(`/cases/${legalCase.id}`, { preserveScroll: true });
    };

    return (
        <LegalLayout>
            <PageHead
                kicker={`Expediente #${legalCase.id} · ${matterLabel[legalCase.matter] ?? legalCase.matter}`}
                title={legalCase.title}
                lede={
                    <>
                        <Link className="lg-link" href={`/clients/${legalCase.client.id}`}>
                            {legalCase.client.name}
                        </Link>
                        {legalCase.case_number ? ` · ${legalCase.case_number}` : ''}
                        {legalCase.court ? ` · ${legalCase.court}` : ''}
                    </>
                }
                actions={
                    <>
                        <Link className="lg-button lg-button--ghost" href="/cases">Volver</Link>
                        <span className={`lg-chip ${statusTone(legalCase.status)}`}>
                            {caseStatusLabel[legalCase.status] ?? legalCase.status}
                        </span>
                    </>
                }
            />

            <div className="lg-case-body">
                <div className="lg-case-main">
                    <section className="lg-card" aria-labelledby="summary-title">
                        <div className="lg-card__head">
                            <h2 className="lg-card__title" id="summary-title">Resumen</h2>
                            <span className="lg-card__note">Actualizado {formatDateTime(legalCase.updated_at)}</span>
                        </div>
                        <div className="lg-card__body">
                            <table className="lg-facts">
                                <tbody>
                                    <tr><th>Partes</th><td>{legalCase.parties ?? '—'}</td></tr>
                                    <tr><th>Descripción</th><td>{legalCase.description ?? '—'}</td></tr>
                                    <tr><th>Inicio</th><td>{formatDate(legalCase.started_at)}</td></tr>
                                    <tr><th>Cierre</th><td>{formatDate(legalCase.closed_at)}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="lg-card" aria-labelledby="deadlines-title">
                        <div className="lg-card__head">
                            <h2 className="lg-card__title" id="deadlines-title">Vencimientos</h2>
                            <span className="lg-card__note">{deadlines.length} registros</span>
                        </div>
                        {deadlines.length === 0 ? (
                            <p className="lg-empty">Sin vencimientos cargados.</p>
                        ) : (
                            <div className="lg-table-wrap">
                                <table className="lg-table">
                                    <thead>
                                        <tr><th>Vencimiento</th><th>Tipo</th><th>Fecha</th><th>Responsable</th><th>Estado</th><th /></tr>
                                    </thead>
                                    <tbody>
                                        {deadlines.map((deadline) => (
                                            <tr key={deadline.id}>
                                                <td>{deadline.title}</td>
                                                <td>{deadlineTypeLabel[deadline.type] ?? deadline.type}</td>
                                                <td className="lg-nowrap">{formatDateTime(deadline.due_at)}</td>
                                                <td>{deadline.assignee ?? 'Sin asignar'}</td>
                                                <td><span className={`lg-chip ${deadlineTone(deadline.status, deadline.due_at)}`}>{deadlineStatusLabel[deadline.status] ?? deadline.status}</span></td>
                                                <td>
                                                    {deadline.status === 'pending' ? (
                                                        <button className="lg-button lg-button--ghost lg-button--small" type="button" onClick={() => router.post(`/deadlines/${deadline.id}/complete`, {}, { preserveScroll: true })}>
                                                            Cumplir
                                                        </button>
                                                    ) : null}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <form className="lg-form lg-card__body" onSubmit={addDeadline}>
                            <div className="lg-form__row">
                                <div className="lg-field">
                                    <label className="lg-label" htmlFor="deadline-title">Nuevo vencimiento</label>
                                    <input id="deadline-title" className="lg-input" value={deadlineForm.data.title} onChange={(e) => deadlineForm.setData('title', e.target.value)} required />
                                </div>
                                <div className="lg-field">
                                    <label className="lg-label" htmlFor="deadline-due">Fecha y hora</label>
                                    <input id="deadline-due" type="datetime-local" className="lg-input" value={deadlineForm.data.due_at} onChange={(e) => deadlineForm.setData('due_at', e.target.value)} required />
                                </div>
                            </div>
                            <div className="lg-form__row">
                                <div className="lg-field">
                                    <label className="lg-label" htmlFor="deadline-type">Tipo</label>
                                    <select id="deadline-type" className="lg-select" value={deadlineForm.data.type} onChange={(e) => deadlineForm.setData('type', e.target.value)}>
                                        {Object.entries(deadlineTypeLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                    </select>
                                </div>
                                <div className="lg-field">
                                    <label className="lg-label" htmlFor="deadline-assignee">Responsable</label>
                                    <select id="deadline-assignee" className="lg-select" value={deadlineForm.data.assigned_to} onChange={(e) => deadlineForm.setData('assigned_to', e.target.value)}>
                                        <option value="">Sin asignar</option>
                                        {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            {deadlineForm.errors.title ? <p className="lg-error">{deadlineForm.errors.title}</p> : null}
                            {deadlineForm.errors.due_at ? <p className="lg-error">{deadlineForm.errors.due_at}</p> : null}
                            {deadlineForm.errors.legal_case_id ? <p className="lg-error">{deadlineForm.errors.legal_case_id}</p> : null}
                            <button className="lg-button lg-button--small" type="submit" disabled={deadlineForm.processing}>Agregar vencimiento</button>
                        </form>
                    </section>

                    <section className="lg-card" aria-labelledby="documents-title">
                        <div className="lg-card__head">
                            <h2 className="lg-card__title" id="documents-title">Documentos</h2>
                            <span className="lg-card__note">Cifrados en reposo</span>
                        </div>
                        {documents.length === 0 ? (
                            <p className="lg-empty">Sin documentos.</p>
                        ) : (
                            <div className="lg-card__body">
                                {documents.map((document) => (
                                    <div className="lg-doc" key={document.id}>
                                        <div>
                                            <a className="lg-link lg-doc__name" href={`/documents/${document.id}/download`}>{document.original_name}</a>
                                            <div className="lg-doc__meta">{formatBytes(document.size)} · {document.uploaded_by ?? '—'} · {formatDateTime(document.created_at)}</div>
                                        </div>
                                        <div className="lg-doc__actions">
                                            <a className="lg-button lg-button--ghost lg-button--small" href={`/documents/${document.id}/download`}>Descargar</a>
                                            {canDelete ? (
                                                <button className="lg-link lg-link--danger mono" type="button" onClick={() => { if (confirm('¿Eliminar este documento?')) router.delete(`/documents/${document.id}`, { preserveScroll: true }); }}>
                                                    Eliminar
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <form className="lg-form lg-card__body" onSubmit={upload}>
                            <div className="lg-field">
                                <label className="lg-label" htmlFor="file">Subir documento (PDF, imagen, DOC/DOCX · máx. 15 MB)</label>
                                <input id="file" type="file" className="lg-input lg-input--file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={(e) => documentForm.setData('file', e.target.files?.[0] ?? null)} required />
                                {documentForm.errors.file ? <p className="lg-error">{documentForm.errors.file}</p> : null}
                            </div>
                            <button className="lg-button lg-button--small" type="submit" disabled={documentForm.processing || !documentForm.data.file}>Subir y cifrar</button>
                        </form>
                    </section>

                    <section className="lg-card" aria-labelledby="notes-title">
                        <div className="lg-card__head">
                            <h2 className="lg-card__title" id="notes-title">Notas del expediente</h2>
                            <span className="lg-card__note">{notes.length} notas</span>
                        </div>
                        <div className="lg-card__body">
                            <form className="lg-form" onSubmit={addNote}>
                                <div className="lg-field">
                                    <label className="lg-label" htmlFor="note-body">Nueva nota</label>
                                    <textarea id="note-body" className="lg-textarea" value={noteForm.data.body} onChange={(e) => noteForm.setData('body', e.target.value)} required />
                                </div>
                                <button className="lg-button lg-button--small" type="submit" disabled={noteForm.processing}>Agregar nota</button>
                            </form>
                            <div className="lg-stack" style={{ marginTop: '1.25rem' }}>
                                {notes.map((note) => (
                                    <div className="lg-note" key={note.id}>
                                        <div className="lg-note__head"><span>{note.user ?? '—'}</span><span>{formatDateTime(note.created_at)}</span></div>
                                        <p className="lg-note__body">{note.body}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                <aside className="lg-case-side">
                    <div className="lg-card">
                        <div className="lg-card__head"><h2 className="lg-card__title">Ficha</h2></div>
                        <div className="lg-card__body">
                            <table className="lg-facts">
                                <tbody>
                                    <tr><th>Cliente</th><td><Link className="lg-link" href={`/clients/${legalCase.client.id}`}>{legalCase.client.name}</Link></td></tr>
                                    <tr><th>Documento</th><td>{legalCase.client.tax_id ?? '—'}</td></tr>
                                    <tr><th>Email</th><td>{legalCase.client.email ?? '—'}</td></tr>
                                    <tr><th>Teléfono</th><td>{legalCase.client.phone ?? '—'}</td></tr>
                                    <tr><th>Materia</th><td>{matterLabel[legalCase.matter] ?? legalCase.matter}</td></tr>
                                    <tr><th>Tribunal</th><td>{legalCase.court ?? '—'}</td></tr>
                                    <tr><th>Jurisdicción</th><td>{legalCase.jurisdiction ?? '—'}</td></tr>
                                    <tr><th>Número</th><td>{legalCase.case_number ?? '—'}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="lg-card">
                        <div className="lg-card__head"><h2 className="lg-card__title">Tareas</h2><span className="lg-card__note">{tasks.length}</span></div>
                        <div className="lg-card__body">
                            {tasks.length === 0 ? <p className="lg-hint">Sin tareas.</p> : (
                                <div className="lg-stack">
                                    {tasks.map((task) => (
                                        <div key={task.id}>
                                            <div className="lg-note__head">
                                                <span>{task.status === 'done' ? taskStatusLabel.done : taskStatusLabel[task.status]}</span>
                                                <span>{task.due_at ? formatDate(task.due_at) : 'Sin fecha'}</span>
                                            </div>
                                            <p className="lg-note__body">{task.title}</p>
                                            {task.status === 'pending' ? (
                                                <button className="lg-link mono" type="button" onClick={() => router.post(`/tasks/${task.id}/complete`, {}, { preserveScroll: true })}>Marcar hecha</button>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <form className="lg-form" style={{ marginTop: '1rem' }} onSubmit={addTask}>
                                <div className="lg-field">
                                    <label className="lg-label" htmlFor="task-title">Nueva tarea</label>
                                    <input id="task-title" className="lg-input" value={taskForm.data.title} onChange={(e) => taskForm.setData('title', e.target.value)} required />
                                </div>
                                <div className="lg-form__row">
                                    <div className="lg-field">
                                        <label className="lg-label" htmlFor="task-due">Fecha</label>
                                        <input id="task-due" type="datetime-local" className="lg-input" value={taskForm.data.due_at} onChange={(e) => taskForm.setData('due_at', e.target.value)} />
                                    </div>
                                    <div className="lg-field">
                                        <label className="lg-label" htmlFor="task-assignee">Responsable</label>
                                        <select id="task-assignee" className="lg-select" value={taskForm.data.assigned_to} onChange={(e) => taskForm.setData('assigned_to', e.target.value)}>
                                            <option value="">Sin asignar</option>
                                            {users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                {taskForm.errors.title ? <p className="lg-error">{taskForm.errors.title}</p> : null}
                                {taskForm.errors.legal_case_id ? <p className="lg-error">{taskForm.errors.legal_case_id}</p> : null}
                                <button className="lg-button lg-button--small" type="submit" disabled={taskForm.processing}>Agregar tarea</button>
                            </form>
                        </div>
                    </div>

                    <details className="lg-card">
                        <summary className="lg-card__head" style={{ cursor: 'pointer' }}>
                            <span className="lg-card__title">Editar expediente</span>
                            <span className="lg-card__note">Datos y estado</span>
                        </summary>
                        <form className="lg-form lg-card__body" onSubmit={saveCase}>
                            <div className="lg-field">
                                <label className="lg-label" htmlFor="edit-client">Cliente</label>
                                <select id="edit-client" className="lg-select" value={editForm.data.client_id} onChange={(e) => editForm.setData('client_id', e.target.value)}>
                                    {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
                                </select>
                            </div>
                            <div className="lg-field">
                                <label className="lg-label" htmlFor="edit-title">Carátula</label>
                                <input id="edit-title" className="lg-input" value={editForm.data.title} onChange={(e) => editForm.setData('title', e.target.value)} required />
                            </div>
                            <div className="lg-form__row">
                                <div className="lg-field">
                                    <label className="lg-label" htmlFor="edit-number">Número</label>
                                    <input id="edit-number" className="lg-input" value={editForm.data.case_number} onChange={(e) => editForm.setData('case_number', e.target.value)} />
                                </div>
                                <div className="lg-field">
                                    <label className="lg-label" htmlFor="edit-status">Estado</label>
                                    <select id="edit-status" className="lg-select" value={editForm.data.status} onChange={(e) => editForm.setData('status', e.target.value)}>
                                        <option value="open">Abierto</option><option value="paused">Pausado</option><option value="closed">Cerrado</option><option value="archived">Archivado</option>
                                    </select>
                                </div>
                            </div>
                            <div className="lg-form__row">
                                <div className="lg-field">
                                    <label className="lg-label" htmlFor="edit-matter">Materia</label>
                                    <select id="edit-matter" className="lg-select" value={editForm.data.matter} onChange={(e) => editForm.setData('matter', e.target.value)}>
                                        {Object.entries(matterLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                    </select>
                                </div>
                                <div className="lg-field">
                                    <label className="lg-label" htmlFor="edit-court">Tribunal</label>
                                    <input id="edit-court" className="lg-input" value={editForm.data.court} onChange={(e) => editForm.setData('court', e.target.value)} />
                                </div>
                            </div>
                            <div className="lg-form__row">
                                <div className="lg-field"><label className="lg-label" htmlFor="edit-start">Inicio</label><input id="edit-start" type="date" className="lg-input" value={editForm.data.started_at} onChange={(e) => editForm.setData('started_at', e.target.value)} /></div>
                                <div className="lg-field"><label className="lg-label" htmlFor="edit-close">Cierre</label><input id="edit-close" type="date" className="lg-input" value={editForm.data.closed_at} onChange={(e) => editForm.setData('closed_at', e.target.value)} /></div>
                            </div>
                            <div className="lg-field"><label className="lg-label" htmlFor="edit-parties">Partes</label><textarea id="edit-parties" className="lg-textarea" value={editForm.data.parties} onChange={(e) => editForm.setData('parties', e.target.value)} /></div>
                            <div className="lg-field"><label className="lg-label" htmlFor="edit-description">Descripción</label><textarea id="edit-description" className="lg-textarea" value={editForm.data.description} onChange={(e) => editForm.setData('description', e.target.value)} /></div>
                            <button className="lg-button lg-button--small" type="submit" disabled={editForm.processing}>Guardar</button>
                        </form>
                        {isOwner ? (
                            <div className="lg-card__body" style={{ borderTop: '1px solid var(--color-rule)' }}>
                                <button className="lg-button lg-button--danger lg-button--small" type="button" onClick={() => { if (confirm('¿Eliminar este expediente?')) router.delete(`/cases/${legalCase.id}`); }}>Eliminar expediente</button>
                            </div>
                        ) : null}
                    </details>
                </aside>
            </div>
        </LegalLayout>
    );
}
