import React, { useState, useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const [showEmailLoginForm, setShowLoginForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    // SSO Google
    const handleSsoLogin = (provider) => {
        const url = route('socialite.redirect', { provider });
        window.location.href = url;
    };

    const ssoButtons = [
        { provider: 'google', label: 'Connectez-vous avec Google', className: 'google-btn' },
    ];

    return (
        <GuestLayout>
            <Head title="Connexion" />

            <div className="card shadow-lg p-4 bg-dark" style={{ width: '100%', maxWidth: '400px' }}>
                <h1 className="card-title text-center text-white fw-bold mb-4">Connectez-vous</h1>

                {!showEmailLoginForm && (
                    <div className="d-grid gap-3 mb-4">
                        {ssoButtons.map((sso) => (
                            <button
                                key={sso.provider}
                                type="button"
                                className={`btn btn-outline-light sso-btn ${sso.className}`}
                                onClick={() => handleSsoLogin(sso.provider)}
                            >
                                <img
                                    src={`/images/${sso.provider}-logo.png`}
                                    alt={sso.provider}
                                    className="sso-logo"
                                />
                                <span>{sso.label}</span>
                            </button>
                        ))}

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => setShowLoginForm(true)}
                        >
                            Connexion avec Email
                        </button>
                    </div>
                )}

                {showEmailLoginForm && (
                    <form onSubmit={submit}>
                        <div className="mb-3">
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2 text-danger" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2 text-danger" />
                        </div>

                        <div className="d-flex align-items-center justify-content-between my-3">
                            <div className="form-check">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="form-check-input"
                                />
                                <label className="form-check-label text-white-50">
                                    Se souvenir de moi
                                </label>
                            </div>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-decoration-none text-info"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            )}
                        </div>

                        <div className="d-grid gap-2">
                            <PrimaryButton className="p-3" disabled={processing}>
                                {processing ? 'Connexion en cours...' : 'Se connecter'}
                            </PrimaryButton>

                            <Link
                                href={route('register')}
                                className="btn btn-outline-secondary p-3"
                            >
                                Pas encore de compte ? S'inscrire
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </GuestLayout>
    );
}
