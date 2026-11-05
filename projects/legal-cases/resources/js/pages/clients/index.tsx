import PageHead from '@/components/page-head';
import LegalLayout from '@/layouts/legal-layout';
import { formatDate } from '@/lib/legal';
import { Link, router, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';

type ClientRow = {
    id: number;
    type: string;
    name: string;
    tax_id: string | null;
    email: string | null;
    phone: string | null;
    cases_count: number;
    created_at: string | null;
};
type Paginator = { data: ClientRow[]; current_page: number; last_page: number; total: number };

export default function ClientsIndex({ clients, filters }: { clients: Paginator; filters: { q: string } }) {
    const [q, setQ] = useState(filters.q);
    const form = useForm({
        type: 'person',
        name: '',
        tax_id: '',
        email: '',
        phone: '',
        address: '',
        notes: '',
    });

    const search = (event: FormEvent) => {
        event.preventDefault();
        router.get('/clients', { q }, { preserveState: true, preserveScroll: true });
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post('/clients', {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    return (
        <LegalLayout>
            <PageHead
                kicker="Clientes"
                title="Personas y empresas"
                lede="El punto de entrada de cada expediente. Datos de contacto, identificación y historial."
                actions={<span className="mono">{clients.total} registros</span>}
            />

            <div className="lg-grid">
                <section className="lg-card" aria-labelledby="clients-title">
                    <div className="lg-card__head">
                        <h2 className="lg-card__title" id="clients-title">
                            Clientes
                        </h2>
                        <form className="lg-actions" onSubmit={search}>
                            <div className="lg-field">
                                <label className="lg-label" htmlFor="client-q">
                                    Buscar
                                </label>
                                <input
                                    id="client-q"
                                    className="lg-input"
                                    value={q}
                                    onChange={(event) => setQ(event.target.value)}
                                    placeholder="Nombre, CUIT o email"
                                />
                            </div>
                            <button className="lg-button lg-button--ghost lg-button--small" type="submit">
                                Filtrar
                            </button>
                        </form>
                    </div>

                    {clients.data.length === 0 ? (
                        <p className="lg-empty">No hay clientes con esa búsqueda.</p>
                    ) : (
                        <div className="lg-table-wrap">
                            <table className="lg-table">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Tipo</th>
                                        <th>Documento</th>
                                        <th>Contacto</th>
                                        <th>Expedientes</th>
                                        <th>Alta</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients.data.map((client) => (
                                        <tr key={client.id}>
                                            <td>
                                                <Link href={`/clients/${client.id}`}>{client.name}</Link>
                                            </td>
                                            <td>{client.type === 'company' ? 'Empresa' : 'Persona'}</td>
                                            <td>{client.tax_id ?? '—'}</td>
                                            <td>
                                                {client.email ?? '—'}
                                                {client.phone ? <div className="lg-hint">{client.phone}</div> : null}
                                            </td>
                                            <td>{client.cases_count}</td>
                                            <td className="lg-nowrap">{formatDate(client.created_at)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {clients.last_page > 1 ? (
                        <nav className="lg-pagination" aria-label="Paginación">
                            <button
                                className="lg-button lg-button--ghost lg-button--small"
                                disabled={clients.current_page === 1}
                                onClick={() => router.get('/clients', { q: filters.q, page: clients.current_page - 1 })}
                                type="button"
                            >
                                Anterior
                            </button>
                            <span className="is-current">{clients.current_page} / {clients.last_page}</span>
                            <button
                                className="lg-button lg-button--ghost lg-button--small"
                                disabled={clients.current_page === clients.last_page}
                                onClick={() => router.get('/clients', { q: filters.q, page: clients.current_page + 1 })}
                                type="button"
                            >
                                Siguiente
                            </button>
                        </nav>
                    ) : null}
                </section>

                <aside className="lg-stack" aria-labelledby="new-client-title">
                    <div className="lg-card">
                        <div className="lg-card__head">
                            <h2 className="lg-card__title" id="new-client-title">
                                Nuevo cliente
                            </h2>
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
                                <label className="lg-label" htmlFor="name">Nombre o razón social</label>
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
                                {form.processing ? 'Guardando…' : 'Crear cliente'}
                            </button>
                        </form>
                    </div>
                </aside>
            </div>
        </LegalLayout>
    );
}
