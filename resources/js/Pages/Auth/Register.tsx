import { Head, Link, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

export default function Register() {
    // Gestion de l'affichage du formulaire
    const [showEmailForm, setShowEmailForm] = useState(false);

    // Initialisation du hook useForm pour les champs du formulaire
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        lastname: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        // Nettoyer les champs password et password_confirmation lors du démontage du composant
        return () => {
            reset ('password', 'password_confirmation');
        };
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('signup.store'));
    };

    // Logique inscription SSO (Social Sign-on)
    const handleSsoLogin = (provider: string) => {
        window.location.href = route('socialite.redirect', { provider});
        alert('Vous êtes redirigé(e) vers ' + provider + ' pour vous inscrire.');
    };

    return (
        <>
            <Head title="Inscription" />

            <div className="d-flex flex-column justify-content-center align-items-center bg-light signup-container">
                <div className="register-card shadow-lg p-4">
                    <div className="card-container">
                        <h1 className="card-title mb-4 fs-3 fw-bold">Créer un compte</h1>

                        {/* BOUTON SSO */}
                        {!showEmailForm && (
                            <div className="d-grid gap-3 mb-4">
                                {/* Bouton Google SSO */}
                                <button
                                    type="button"
                                    className="btn btn-outline-dark sso-btn google-btn"
                                    onClick={() => handleSsoLogin('google')}
                                >
                                    <img src="/images/google-logo.png" alt="Google" className="sso-logo" />
                                    <span>Inscrivez-vous avec Google</span>
                                </button>

                                {/* Bouton Apple 
                                <button
                                    type="button"
                                    className="btn btn-outline-dark sso-btn apple-btn"
                                    onClick={() => handleSsoLogin('apple')}
                                >
                                    <img src="/images/apple-logo.png" alt="Apple" className="sso-logo" />
                                    <span>Inscrivez-vous avec Apple</span>
                                </button>
                                */}

                                {/* Bouton Microsoft 
                                <button
                                    type="button"
                                    className="btn btn-outline-dark sso-btn microsoft-btn"
                                    onClick={() => handleSsoLogin('microsoft')}
                                >
                                    <img src="/images/microsoft-logo.png" alt="Microsoft" className="sso-logo" />
                                    <span>Inscrivez-vous avec Microsoft</span>
                                </button>
                                */}

                                {/* Ligne de séparation */}
                                <div className="d-flex align-items-center my-3">
                                    <hr className="flex-grow-1" />
                                    <span className="mx-2 text-muted">ou</span>
                                    <hr className="flex-grow-1" />
                                </div>

                                {/* Bouton pour afficher le formulaire d'inscription par email */}
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setShowEmailForm(true)}
                                >
                                    Inscrivez-vous avec votre email
                                </button>
                            </div>
                        )}                            </div>
                        
                        {/* FORMULAIRE D'INSCRIPTION PAR EMAIL */}
                        {showEmailForm && (
                        <form onSubmit={submit}>
                            {/* Champ Prénom */}
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Prénom</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    autoComplete='name'
                                    required
                                />
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>

                            {/* Champ Nom */}
                            <div className="mb-3">
                                <label htmlFor="lastname" className="form-label">Nom</label>
                                <input
                                    id="lastname"
                                    name="lastname"
                                    type="text"
                                    className={`form-control ${errors.lastname ? 'is-invalid' : ''}`}
                                    value={data.lastname}
                                    onChange={(e) => setData('lastname', e.target.value)}
                                    autoComplete='lastname'
                                    required
                                />
                                {errors.lastname && <div className="invalid-feedback">{errors.lastname}</div>}
                            </div>

                            {/* Champ Email */}
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    autoComplete='username'
                                    required
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>

                            {/* Champ Téléphone */}
                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">Téléphone</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    autoComplete='tel'
                                    required
                                />
                                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                            </div>

                            {/* Champ Mot de passe */}
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Mot de passe</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoComplete='new-password'
                                    required
                                />
                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                            </div>

                            {/* Champ Confirmation du mot de passe */}
                            <div className="mb-3">
                                <label htmlFor="password_confirmation" className="form-label">Confirmer le mot de passe</label>
                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    autoComplete='new-password'
                                    required
                                />
                                {errors.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation}</div>}
                            </div>

                            <div className="d-flex flex-column align-items-center mt-4">
                                 {/* Bouton de soumission */}
                                <button type="submit" className="btn btn-primary" disabled={processing}>
                                    {processing ? 'Inscription en cours...' : "S'inscrire"}
                                </button>

                                {/* Lien de connexion */}
                                <Link href={route('login')} className="text-decoration-none mt-2">
                                    Déjà inscrit ?
                                </Link>
                            </div>
                        </form>
                        )}
                    </div>
                </div>
        </>
    );
}