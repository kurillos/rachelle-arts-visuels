import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title="Connexion — Rachelle Arts" />
            <div style={{
                minHeight: '100vh',
                background: '#1A1C20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                margin: 0,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}>
                {/* Cercles décoratifs */}
                <div style={{
                    position: 'fixed', top: '-120px', right: '-120px',
                    width: '400px', height: '400px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(170,17,221,0.15) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'fixed', bottom: '-100px', left: '-100px',
                    width: '350px', height: '350px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(19,212,245,0.1) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                <div style={{
                    width: '100%', maxWidth: '440px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(170,17,221,0.25)',
                    borderRadius: '24px',
                    padding: '3rem 2.5rem',
                    backdropFilter: 'blur(10px)',
                    position: 'relative',
                }}>
                    {/* Logo */}
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <img src="/images/logo.svg" alt="Rachelle Arts" style={{ height: '70px', marginBottom: '1rem' }} />
                        <h1 style={{
                            fontFamily: "'Charmonman', cursive",
                            color: '#AA11DD',
                            fontSize: '1.8rem',
                            fontWeight: 700,
                            margin: 0,
                        }}>
                            Espace Studio
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                            Administration Rachelle Arts Visuels
                        </p>
                    </div>

                    {/* Ligne décorative */}
                    <div style={{
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, #AA11DD, #13D4F5, transparent)',
                        marginBottom: '2rem',
                    }} />

                    {status && (
                        <div style={{
                            background: 'rgba(19,212,245,0.1)',
                            border: '1px solid rgba(19,212,245,0.3)',
                            borderRadius: '10px',
                            padding: '0.75rem 1rem',
                            color: '#13D4F5',
                            fontSize: '0.9rem',
                            marginBottom: '1.5rem',
                        }}>
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        {/* Email */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '0.8rem',
                                letterSpacing: '1.5px',
                                textTransform: 'uppercase',
                                marginBottom: '0.5rem',
                            }}>
                                Adresse e-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                autoComplete="username"
                                autoFocus
                                onChange={e => setData('email', e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: `2px solid ${errors.email ? '#ef4444' : 'rgba(170,17,221,0.4)'}`,
                                    borderRadius: 0,
                                    color: 'white',
                                    padding: '0.6rem 0',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.3s',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={e => e.target.style.borderBottomColor = '#AA11DD'}
                                onBlur={e => e.target.style.borderBottomColor = errors.email ? '#ef4444' : 'rgba(170,17,221,0.4)'}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Mot de passe */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '0.8rem',
                                letterSpacing: '1.5px',
                                textTransform: 'uppercase',
                                marginBottom: '0.5rem',
                            }}>
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                autoComplete="current-password"
                                onChange={e => setData('password', e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'transparent',
                                    border: 'none',
                                    borderBottom: `2px solid ${errors.password ? '#ef4444' : 'rgba(170,17,221,0.4)'}`,
                                    borderRadius: 0,
                                    color: 'white',
                                    padding: '0.6rem 0',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.3s',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={e => e.target.style.borderBottomColor = '#AA11DD'}
                                onBlur={e => e.target.style.borderBottomColor = errors.password ? '#ef4444' : 'rgba(170,17,221,0.4)'}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Se souvenir + mot de passe oublié */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '2rem',
                        }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                color: 'rgba(255,255,255,0.5)',
                                fontSize: '0.85rem',
                            }}>
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                    style={{ accentColor: '#AA11DD' }}
                                />
                                Se souvenir
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    style={{
                                        color: '#13D4F5',
                                        fontSize: '0.85rem',
                                        textDecoration: 'none',
                                        transition: 'color 0.2s',
                                    }}
                                >
                                    Mot de passe oublié ?
                                </Link>
                            )}
                        </div>

                        {/* Bouton connexion */}
                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                width: '100%',
                                background: processing
                                    ? 'rgba(170,17,221,0.3)'
                                    : 'linear-gradient(90deg, #AA11DD 0%, #13D4F5 100%)',
                                border: 'none',
                                borderRadius: '50px',
                                color: 'white',
                                padding: '0.85rem',
                                fontSize: '1.1rem',
                                fontFamily: "'Charmonman', cursive",
                                cursor: processing ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s',
                                letterSpacing: '1px',
                            }}
                        >
                            {processing ? 'Connexion…' : 'Se connecter'}
                        </button>
                    </form>

                    {/* Lien retour site */}
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <Link
                            href="/"
                            style={{
                                color: 'rgba(255,255,255,0.3)',
                                fontSize: '0.8rem',
                                textDecoration: 'none',
                            }}
                        >
                            ← Retour au site
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
