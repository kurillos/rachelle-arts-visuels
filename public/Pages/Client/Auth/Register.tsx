import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Clock, Lock, CheckCircle, ShieldCheck } from 'lucide-react';
// @ts-ignore
import { route } from 'ziggy-js';

interface Props {
    gallery_title: string;
    slug: string;
    email: string;
    expires_at: string;
}

export default function Register({ gallery_title, slug, email, expires_at }: Props) {
    // --- LOGIQUE DU TIMER ---
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        if (!expires_at) return;

        const timer = setInterval(() => {
            const end = new Date(expires_at).getTime();
            const now = new Date().getTime();
            const distance = end - now;

            if (distance < 0) {
                setTimeLeft("Expirée");
                clearInterval(timer);
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                setTimeLeft(`${days}j ${hours}h restant`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [expires_at]);

    // --- FORMULAIRE ---
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
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-client-auth py-5 px-3">
            <Head title="Accès à ma galerie - Rachelle Arts" />
            
            <div className="card border-0 shadow-lg overflow-hidden" style={{ maxWidth: '650px', borderRadius: '2rem' }}>
                {/* Header avec Logo Public S3 */}
                <div className="bg-white p-4 text-center border-bottom">
                    <img 
                        src="https://rachelle-art-visuels-storage.s3.eu-north-1.amazonaws.com/public/logo.png" 
                        alt="Rachelle Arts" 
                        style={{ height: '80px', objectFit: 'contain' }}
                        className="mb-2"
                    />
                    <div className="d-flex align-items-center justify-content-center gap-2 mt-2">
                        <span className="badge bg-purple-light text-purple rounded-pill px-3 py-2 small d-flex align-items-center">
                            <ShieldCheck size={14} className="me-1" /> Espace Sécurisé
                        </span>
                        {expires_at && (
                            <span className="badge bg-light text-muted rounded-pill px-3 py-2 small d-flex align-items-center border">
                                <Clock size={14} className="me-1" /> {timeLeft}
                            </span>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-4 p-md-5 bg-white">
                    <div className="text-center mb-4">
                        <h3 className="h4 fw-bold text-dark mb-1">Bienvenue dans votre galerie</h3>
                        <p className="text-muted">Créez votre accès pour découvrir : <br/><strong>{gallery_title}</strong></p>
                    </div>

                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-muted">Prénom</label>
                            <input type="text" className="form-control admin-input rounded-4" value={data.first_name} onChange={e => setData('first_name', e.target.value)} required />
                            {errors.first_name && <div className="text-danger small mt-1">{errors.first_name}</div>}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-muted">Nom</label>
                            <input type="text" className="form-control admin-input rounded-4" value={data.last_name} onChange={e => setData('last_name', e.target.value)} required />
                        </div>
                        <div className="col-12">
                            <label className="form-label small fw-bold text-muted">Votre Email</label>
                            <input type="email" className="form-control rounded-4 bg-light border-0" value={data.email} disabled />
                            <small className="text-muted italic">Cet email sera votre identifiant de connexion.</small>
                        </div>
                        <div className="col-12">
                            <label className="form-label small fw-bold text-muted">Téléphone</label>
                            <input type="tel" className="form-control admin-input rounded-4" value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="06.." required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-muted">Définir un mot de passe</label>
                            <input type="password" placeholder="••••••••" className="form-control admin-input rounded-4" value={data.password} onChange={e => setData('password', e.target.value)} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-muted">Confirmation</label>
                            <input type="password" placeholder="••••••••" className="form-control admin-input rounded-4" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required />
                        </div>
                    </div>

                    <div className="form-check mt-4">
                        <input className="form-check-input" type="checkbox" id="cgv" checked={data.cgv} onChange={e => setData('cgv', e.target.checked)} required />
                        <label className="form-check-label small text-muted" htmlFor="cgv">
                            J'accepte de recevoir mes photos et j'adhère aux <a href="#" className="text-purple fw-bold decoration-none">CGV</a>.
                        </label>
                    </div>

                    <button type="submit" disabled={processing} className="btn btn-purple w-100 rounded-4 py-3 mt-4 fw-bold shadow-sm d-flex align-items-center justify-content-center">
                        {processing ? 'Initialisation...' : 'Valider et découvrir mes photos'}
                        <CheckCircle size={18} className="ms-2" />
                    </button>
                    
                    <p className="text-center mt-4 small text-muted">
                         🔒 Vos données sont protégées et ne seront jamais partagées.
                    </p>
                </form>
            </div>
        </div>
    );
}