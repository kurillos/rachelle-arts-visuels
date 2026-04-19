import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Heart, Instagram, ExternalLink } from 'lucide-react';

export default function Thanks({ title, count }: { title: string, count: number }) {
    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
            <Head title="Merci ! - Rachelle Arts" />
            
            <div className="card border-0 shadow-lg text-center p-5 rounded-5" style={{ maxWidth: '500px' }}>
                <div className="mb-4">
                    <CheckCircle size={80} className="text-success mx-auto" />
                </div>
                
                <h1 className="admin-title-cursive text-purple h2 mb-3">Merci beaucoup !</h1>
                <p className="text-muted mb-4">
                    Votre sélection de <strong>{count} photos</strong> pour la galerie <strong>{title}</strong> a bien été transmise à Rachelle.
                </p>

                <div className="bg-purple-light-soft p-4 rounded-4 mb-4">
                    <h6 className="fw-bold mb-2">Et maintenant ?</h6>
                    <p className="small text-muted mb-0">
                        Rachelle va maintenant traiter vos photos. Vous recevrez un mail dès que vos visuels finaux seront prêts à être téléchargés !
                    </p>
                </div>

                <div className="d-grid gap-2">
                    <a href="https://instagram.com/rachelle_arts" target="_blank" className="btn btn-outline-purple rounded-pill d-flex align-items-center justify-content-center">
                        <Instagram size={18} className="me-2" /> Suivre mes aventures
                    </a>
                    <Link href="/" className="btn btn-link text-muted small mt-2">Retour au site</Link>
                </div>
            </div>
        </div>
    );
}