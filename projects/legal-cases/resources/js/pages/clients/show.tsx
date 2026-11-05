import PageHead from '@/components/page-head';
import LegalLayout from '@/layouts/legal-layout';
import { caseStatusLabel, formatDate, formatDateTime, statusTone } from '@/lib/legal';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';

type Client = {
    id: number;
    type: string;
    name: string;
    tax_id: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    notes: string | null;
    created_at: string | null;
};
type CaseRow = { id: number; title: string; case_number: string | null; status: string; matter: string; next_deadline: string | null };

export default function ClientShow({ client, cases }: { client: Client; cases: CaseRow[] }) {
    const { auth } = usePage<{ auth?: { user?: { role: string } } }>().props;
    const owner = auth?.user?.role === 'owner';
    const form = useForm({
        type: client.type,
        name: client.name,
        tax_id: client.tax_id ?? '',
        email: client.email ?? '',
        phone: client.phone ?? '',
        address: client.address ?? '',
        notes: client.notes ?? '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put(`/clients/${client.id}`, { preserveScroll: true });
    };

    return (
        <LegalLayout>
            <PageHead
                kicker="Cliente"
                title={client.name}
                lede={[client.tax_id, client.email, client.phone].filter(Boolean).join(' · ') || 'Sin datos de contacto.'}
                actions={
                    <>
                        <Link className="lg-button lg-button--ghost" href="/clients">
                            Volver
                        </Link>
                        <Link className="lg-button" href={`/cases?client_id=${client.id}`}>
                            Nuevo expediente
                        </Link>
                    </>
                }
            />

            <div className="lg-grid">
                <div className="lg-stack">
                    <section className="lg-card" aria-labelledby="client-cases">
                        <div className="lg-card__head">
                            <h2 className="lg-card__title" id="client-cases">
                                Expedientes
                            </h2>
                            <span className="lg-card__note">{cases.length} registros</span>
                        </div>
                        {cases.length === 0 ? (
                            <p className="lg-empty">Este cliente todavía no tiene expedientes.</p>
                        ) : (
                            <div className="lg-table-wrap">
                                <table className="lg-table">
                                    <thead>
                                        <tr>
                                            <th>Carátula</th>
                                            <th>Número</th>
                                            <th>Estado</th>
                                            <th>Próximo vencimiento</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cases.map((item) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <Link href={`/cases/${item.id}`}>{item.title}</Link>
                                                </td>
                                                <td>{item.case_number ?? '—'}</td>
                                                <td>
                                                    <span className={`lg-chip ${statusTone(item.status)}`}>
                                                        {caseStatusLabel[item.status] ?? item.status}
                                                    </span>
                                                </td>
                                                <td className="lg-nowrap">
                                                    {item.next_deadline ? formatDateTime(item.next_deadline) : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    <section className="lg-card" aria-labelledby="edit-client">
                        <div className="lg-card__head">
                            <h2 className="lg-card__title" id="edit-client">
                                Datos del cliente
                            </h2>
                            <span className="lg-card__note">Alta {formatDate(client.created_at)}</span>
                        </div>
                        <form className="lg-form lg-card__body" onSubmit={submit}>
                            <div className="lg-form__row">
                                <div className="lg-field">
                                    <label className="lg-label" htmlFor="type">Tipo</label>
                                    <select id="type" className="lg-select" value={form.data.type} onChange={(e) => form.setData('type', e.target.value)}>
                                        <option value="person">Persona</option>
                                        <option value="company">Empresa</option>
                                    </select>
                                </div>
                                <div className="lg-field">
                                    <label className="lg-label" htmlFor="tax_id">DNI / CUIT</label>
                                    <input id="tax_id" className="lg-input" value={form.data.tax_id} onChange={(e) => form.setData('tax_id', e.target.value)} />
                                </div>
                            </div>
                            <div className="lg-field">
                                <label className="lg-label" htmlFor="name">Nombre</label>
                                <input id="name" className="lg-input" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} required />
                                {form.errors.name ? <p className="lg-error">{form.errors.name}</p> : null}
                            </div>
                            <div className="lg-form__row">
                                <div className="lg-field">
                                    <label className="lg-label" htmlFor="email">Email</label>
                                    <input id="email" type="email" className="lg-input" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />
                                </div>
                                <div className="lg-field">
                                    <label className="lg-label" htmlFor="phone">Teléfono</label>
                                    <input id="phone" className="lg-input" value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} />
                                </div>
                            </div>
                            <div className="lg-field">
                                <label className="lg-label" htmlFor="address">Domicilio</label>
                                <input id="address" className="lg-input" value={form.data.address} onChange={(e) => form.setData('address', e.target.value)} />
                            </div>
                            <div className="lg-field">
                                <label className="lg-label" htmlFor="notes">Notas</label>
                                <textarea id="notes" className="lg-textarea" value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} />
                            </div>
                            <button className="lg-button" type="submit" disabled={form.processing}>
                                {form.processing ? 'Guardando…' : 'Guardar cambios'}
                            </button>
                        </form>
                    </section>
                </div>

                <aside className="lg-stack">
                    <div className="lg-card">
                        <div className="lg-card__head">
                            <h2 className="lg-card__title">Ficha</h2>
                        </div>
                        <div className="lg-card__body">
                            <table className="lg-facts">
                                <tbody>
                                    <tr><th>Tipo</th><td>{client.type === 'company' ? 'Empresa' : 'Persona'}</td></tr>
                                    <tr><th>Documento</th><td>{client.tax_id ?? '—'}</td></tr>
                                    <tr><th>Email</th><td>{client.email ?? '—'}</td></tr>
                                    <tr><th>Teléfono</th><td>{client.phone ?? '—'}</td></tr>
                                    <tr><th>Domicilio</th><td>{client.address ?? '—'}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {owner ? (
                        <div className="lg-card">
                            <div className="lg-card__head">
                                <h2 className="lg-card__title">Zona sensible</h2>
                            </div>
                            <div className="lg-card__body">
                                <p className="lg-hint">
                                    Solo el titular puede eliminar un cliente. Si tiene expedientes, primero
                                    hay que archivarlos o reasignarlos.
                                </p>
                                <button
                                    className="lg-button lg-button--danger lg-button--small"
                                    type="button"
                                    onClick={() => {
                                        if (confirm('¿Eliminar este cliente?')) router.delete(`/clients/${client.id}`);
                                    }}
                                >
                                    Eliminar cliente
                                </button>
                            </div>
                        </div>
                    ) : null}
                </aside>
            </div>
        </LegalLayout>
    );
}
