import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { User, Mail, Phone, Lock, CheckCircle } from 'lucide-react';
// @ts-ignore
import { route } from 'ziggy-js';

interface Props {
    gallery_title: string;
    slug: string;
    email: string;
}

export default function Register({ gallery_title, slug, email }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: email || '',
        phone: '',
        password: '',
        password_confirmation: '',
        cgv: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('client.gallery.register.store', slug));
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-client-auth py-5">
            <Head title="Créer mon compte client" />
            
            <div className="card border-0 shadow-lg overflow-hidden" style={{ maxWidth: '600px', borderRadius: '1.5rem' }}>
                <div className="bg-purple p-4 text-white text-center">
                    <h2 className="admin-title-cursive h1 mb-0">Rachelle Arts</h2>
                    <p className="mb-0 opacity-75">Création de votre espace personnel</p>
                </div>

                <form onSubmit={handleSubmit} className="p-4 p-md-5">
                    <div className="text-center mb-4">
                        <h3 className="h5 text-dark">Bienvenue !</h3>
                        <p className="text-muted small">Complétez vos informations pour accéder à la galerie : <br/><strong>{gallery_title}</strong></p>
                    </div>

                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Prénom</label>
                            <input type="text" className="form-control rounded-pill" value={data.first_name} onChange={e => setData('first_name', e.target.value)} required />
                            {errors.first_name && <div className="text-danger small">{errors.first_name}</div>}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Nom</label>
                            <input type="text" className="form-control rounded-pill" value={data.last_name} onChange={e => setData('last_name', e.target.value)} required />
                            {errors.last_name && <div className="text-danger small">{errors.last_name}</div>}
                        </div>
                        <div className="col-12">
                            <label className="form-label small fw-bold">Email (Identifiant)</label>
                            <input type="email" className="form-control rounded-pill bg-light" value={data.email} disabled />
                        </div>
                        <div className="col-12">
                            <label className="form-label small fw-bold">Téléphone</label>
                            <input type="tel" className="form-control rounded-pill" value={data.phone} onChange={e => setData('phone', e.target.value)} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Mot de passe</label>
                            <input type="password" placeholder="••••••••" className="form-control rounded-pill" value={data.password} onChange={e => setData('password', e.target.value)} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">Confirmation</label>
                            <input type="password" placeholder="••••••••" className="form-control rounded-pill" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required />
                        </div>
                    </div>

                    <div className="form-check mt-4">
                        <input className="form-check-input" type="checkbox" id="cgv" checked={data.cgv} onChange={e => setData('cgv', e.target.checked)} required />
                        <label className="form-check-input-label small text-muted" htmlFor="cgv">
                            J'accepte les <a href="#" className="text-purple">Conditions Générales de Vente</a> et la politique de confidentialité.
                        </label>
                    </div>

                    <button type="submit" disabled={processing} className="btn btn-purple w-100 rounded-pill py-3 mt-4 fw-bold shadow-sm">
                        {processing ? 'Création en cours...' : 'Créer mon compte et voir mes photos'}
                    </button>
                </form>
            </div>
        </div>
    );
}