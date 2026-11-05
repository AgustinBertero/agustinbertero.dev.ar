import PageHead from '@/components/page-head';
import LegalLayout from '@/layouts/legal-layout';
import { formatDateTime, roleLabel } from '@/lib/legal';
import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useState } from 'react';

type User = { id: number; name: string; email: string; role: string; active: boolean; last_login_at: string | null; created_at: string | null };

export default function UsersIndex({ users }: { users: User[] }) {
    const [selected, setSelected] = useState<User | null>(null);
    const createForm = useForm({ name: '', email: '', role: 'lawyer', password: '', password_confirmation: '' });
    const editForm = useForm<{ name: string; email: string; role: string; active: boolean; password: string; password_confirmation: string }>({ name: '', email: '', role: 'lawyer', active: true, password: '', password_confirmation: '' });

    const create = (event: FormEvent) => {
        event.preventDefault();
        createForm.post('/users', { preserveScroll: true, onSuccess: () => createForm.reset() });
    };

    const select = (user: User) => {
        setSelected(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            role: user.role,
            active: user.active,
            password: '',
            password_confirmation: '',
        });
        editForm.clearErrors();
    };

    const update = (event: FormEvent) => {
        event.preventDefault();
        if (!selected) return;
        editForm.put(`/users/${selected.id}`, {
            preserveScroll: true,
            onSuccess: () => { setSelected(null); editForm.reset(); },
        });
    };

    return (
        <LegalLayout>
            <PageHead kicker="Accesos" title="Usuarios del estudio" lede="Solo el titular puede crear o desactivar cuentas. Cada acción queda en auditoría." actions={<span className="mono">{users.length} cuentas</span>} />

            <div className="lg-grid">
                <section className="lg-card">
                    <div className="lg-card__head"><h2 className="lg-card__title">Cuentas</h2></div>
                    <div className="lg-table-wrap">
                        <table className="lg-table">
                            <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Último ingreso</th><th /></tr></thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{roleLabel[user.role] ?? user.role}</td>
                                        <td><span className={`lg-chip ${user.active ? 'lg-chip--open' : 'lg-chip--closed'}`}>{user.active ? 'Activo' : 'Inactivo'}</span></td>
                                        <td className="lg-nowrap">{formatDateTime(user.last_login_at)}</td>
                                        <td><button className="lg-link mono" type="button" onClick={() => select(user)}>Editar</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <aside className="lg-stack">
                    {selected ? (
                        <div className="lg-card">
                            <div className="lg-card__head"><h2 className="lg-card__title">Editar usuario</h2><button className="lg-link mono" type="button" onClick={() => setSelected(null)}>Cerrar</button></div>
                            <form className="lg-form lg-card__body" onSubmit={update}>
                                <div className="lg-field"><label className="lg-label" htmlFor="edit-name">Nombre</label><input id="edit-name" className="lg-input" value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} required /></div>
                                <div className="lg-field"><label className="lg-label" htmlFor="edit-email">Email</label><input id="edit-email" type="email" className="lg-input" value={editForm.data.email} onChange={(e) => editForm.setData('email', e.target.value)} required /></div>
                                <div className="lg-form__row">
                                    <div className="lg-field"><label className="lg-label" htmlFor="edit-role">Rol</label><select id="edit-role" className="lg-select" value={editForm.data.role} onChange={(e) => editForm.setData('role', e.target.value)}><option value="owner">Titular</option><option value="lawyer">Abogado/a</option><option value="assistant">Asistente</option></select></div>
                                    <div className="lg-field"><label className="lg-label" htmlFor="edit-active">Estado</label><select id="edit-active" className="lg-select" value={editForm.data.active ? '1' : '0'} onChange={(e) => editForm.setData('active', e.target.value === '1')}><option value="1">Activo</option><option value="0">Inactivo</option></select></div>
                                </div>
                                <div className="lg-form__row">
                                    <div className="lg-field"><label className="lg-label" htmlFor="edit-password">Nueva contraseña</label><input id="edit-password" type="password" className="lg-input" value={editForm.data.password} onChange={(e) => editForm.setData('password', e.target.value)} autoComplete="new-password" /></div>
                                    <div className="lg-field"><label className="lg-label" htmlFor="edit-password-confirm">Repetir</label><input id="edit-password-confirm" type="password" className="lg-input" value={editForm.data.password_confirmation} onChange={(e) => editForm.setData('password_confirmation', e.target.value)} autoComplete="new-password" /></div>
                                </div>
                                <button className="lg-button" type="submit" disabled={editForm.processing}>Guardar cambios</button>
                            </form>
                        </div>
                    ) : null}

                    <div className="lg-card">
                        <div className="lg-card__head"><h2 className="lg-card__title">Nueva cuenta</h2></div>
                        <form className="lg-form lg-card__body" onSubmit={create}>
                            <div className="lg-field"><label className="lg-label" htmlFor="name">Nombre</label><input id="name" className="lg-input" value={createForm.data.name} onChange={(e) => createForm.setData('name', e.target.value)} required /></div>
                            <div className="lg-field"><label className="lg-label" htmlFor="email">Email</label><input id="email" type="email" className="lg-input" value={createForm.data.email} onChange={(e) => createForm.setData('email', e.target.value)} required />{createForm.errors.email ? <p className="lg-error">{createForm.errors.email}</p> : null}</div>
                            <div className="lg-field"><label className="lg-label" htmlFor="role">Rol</label><select id="role" className="lg-select" value={createForm.data.role} onChange={(e) => createForm.setData('role', e.target.value)}><option value="lawyer">Abogado/a</option><option value="assistant">Asistente</option><option value="owner">Titular</option></select></div>
                            <div className="lg-form__row">
                                <div className="lg-field"><label className="lg-label" htmlFor="password">Contraseña</label><input id="password" type="password" className="lg-input" value={createForm.data.password} onChange={(e) => createForm.setData('password', e.target.value)} autoComplete="new-password" required /></div>
                                <div className="lg-field"><label className="lg-label" htmlFor="password_confirmation">Repetir</label><input id="password_confirmation" type="password" className="lg-input" value={createForm.data.password_confirmation} onChange={(e) => createForm.setData('password_confirmation', e.target.value)} autoComplete="new-password" required /></div>
                            </div>
                            {createForm.errors.password ? <p className="lg-error">{createForm.errors.password}</p> : null}
                            <p className="lg-hint">La contraseña debe tener al menos 12 caracteres. Compartila por un canal seguro.</p>
                            <button className="lg-button" type="submit" disabled={createForm.processing}>{createForm.processing ? 'Creando…' : 'Crear cuenta'}</button>
                        </form>
                    </div>
                </aside>
            </div>
        </LegalLayout>
    );
}
