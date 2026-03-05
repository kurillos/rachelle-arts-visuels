import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Lock } from 'lucide-react';

interface Props {
    gallery_title: string;
    slug: string;
}

export default function Login({ gallery_title, slug }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/client/gallery/${slug}/login`);
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-client-auth">
            <Head title={`Accès Privé - ${gallery_title}`} />
            
            <div className="card border-0 shadow-lg p-4 p-md-5 text-center" style={{ maxWidth: '450px', borderRadius: '2rem' }}>
                <h2 className="admin-title-cursive text-purple mb-2">Rachelle Arts</h2>
                <p className="text-muted mb-4 small text-uppercase fw-light" style={{ letterSpacing: '2px' }}>Studio Photographie</p>
                
                <hr className="w-25 mx-auto mb-4" />
                
                <h3 className="h5 mb-4 fw-normal">Bienvenue dans votre galerie<br/><strong>{gallery_title}</strong></h3>
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <div className="input-group input-group-lg border rounded-pill overflow-hidden bg-light">
                            <span className="input-group-text bg-transparent border-0 ps-3 text-muted">
                                <Lock size={18} />
                            </span>
                            <input 
                                type="password" 
                                className="form-control bg-transparent border-0 shadow-none ps-2" 
                                placeholder="Mot de passe"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                required
                            />
                        </div>
                        {errors.password && <div className="text-danger small mt-2">{errors.password}</div>}
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="btn btn-purple btn-lg w-100 rounded-pill shadow-sm mt-2 py-3 fw-bold"
                    >
                        {processing ? 'Chargement...' : 'Découvrir mes photos'}
                    </button>
                </form>
                
                <p className="mt-5 mb-0 text-muted small italic">
                    Un problème d'accès ? Contactez votre photographe.
                </p>
            </div>
        </div>
    );
}