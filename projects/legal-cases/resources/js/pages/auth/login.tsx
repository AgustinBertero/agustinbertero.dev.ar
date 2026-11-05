import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

export default function Login({ status }: { status?: string }) {
    const form = useForm<{ email: string; password: string; remember: boolean }>({ email: '', password: '', remember: false });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post('/login', { onFinish: () => form.reset('password') });
    };

    return (
        <>
            <Head title="Acceso" />
            <main className="lg-login">
                <div className="lg-login__box">
                    <div className="lg-login__brand">
                        <span className="lg-brand">
                            Estudio<span> / Expedientes</span>
                            <small>Acceso privado</small>
                        </span>
                    </div>
                    <h1 className="lg-login__title">Entrar a la mesa</h1>
                    <p className="lg-login__lede">
                        Este espacio guarda datos de clientes y expedientes. El acceso es solo para
                        personas autorizadas del estudio.
                    </p>

                    {status ? <p className="lg-flash">{status}</p> : null}

                    <form className="lg-form" onSubmit={submit}>
                        <div className="lg-field">
                            <label className="lg-label" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="lg-input"
                                autoComplete="username"
                                autoFocus
                                value={form.data.email}
                                onChange={(event) => form.setData('email', event.target.value)}
                                required
                            />
                            {form.errors.email ? <p className="lg-error">{form.errors.email}</p> : null}
                        </div>
                        <div className="lg-field">
                            <label className="lg-label" htmlFor="password">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="lg-input"
                                autoComplete="current-password"
                                value={form.data.password}
                                onChange={(event) => form.setData('password', event.target.value)}
                                required
                            />
                            {form.errors.password ? <p className="lg-error">{form.errors.password}</p> : null}
                        </div>
                        <label className="lg-hint" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                checked={form.data.remember}
                                onChange={(event) => form.setData('remember', event.target.checked)}
                            />
                            Recordarme en este dispositivo
                        </label>
                        <button className="lg-button" type="submit" disabled={form.processing}>
                            {form.processing ? 'Entrando…' : 'Entrar'}
                        </button>
                    </form>

                    <p className="lg-hint" style={{ marginTop: '1.25rem' }}>
                        Sin registro público. Si necesitás acceso, pedíselo al titular del estudio.
                    </p>
                </div>
            </main>
        </>
    );
}
