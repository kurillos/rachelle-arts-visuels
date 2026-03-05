import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    ChevronLeft, 
    Heart, 
    Share2, 
    ExternalLink, 
    Download,
    Layers,
    Calendar,
    User,
    Timer
} from 'lucide-react';

// @ts-ignore
import { route } from 'ziggy-js';

interface Photo {
    id: number;
    image_path: string;
    title: string;
    is_selected: boolean;
    full_url: string;
}

interface Gallery {
    id: number;
    title: string;
    client_name: string;
    slug: string;
    event_date: string;
    expires_at: string;
    password: string;
    photos: Photo[];
}

interface Props {
    auth: any;
    gallery: Gallery;
}

export default function Show({ auth, gallery }: Props) {
    const [filterFavorites, setFilterFavorites] = useState(false);

    // Filtrage local des photos pour la vue Admin
    const displayedPhotos = filterFavorites 
        ? gallery.photos.filter(p => p.is_selected) 
        : gallery.photos;

    const favoritesCount = gallery.photos.filter(p => p.is_selected).length;

    // Calcul des jours restants avant expiration
    const calculateDaysLeft = () => {
        const diff = new Date(gallery.expires_at).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return Math.max(0, days);
    };

    // Fonction pour copier le lien client
    const copyClientLink = () => {
        const url = `${window.location.origin}/client/gallery/${gallery.slug}`;
        navigator.clipboard.writeText(url);
        alert("Lien copié ! Vous pouvez l'envoyer au client.");
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`Galerie - ${gallery.title}`} />

            <div className="admin-show-gallery">
                {/* BARRE DE NAVIGATION RETOUR */}
                <div className="mb-4">
                    <Link href={route('admin.galleries.index')} className="text-muted text-decoration-none d-flex align-items-center small">
                        <ChevronLeft size={16} className="me-1" /> Retour aux galeries
                    </Link>
                </div>

                {/* HEADER DE LA GALERIE */}
                <div className="card admin-card border-0 shadow-sm mb-5">
                    <div className="card-body p-4 p-md-5">
                        <div className="row align-items-center">
                            <div className="col-lg-8">
                                <h1 className="admin-title-cursive h2 text-purple mb-3">{gallery.title}</h1>
                                <div className="d-flex flex-wrap gap-4 text-muted small">
                                    <div className="d-flex align-items-center">
                                        <User size={16} className="me-2 text-purple" /> 
                                        {gallery.client_name || 'Client inconnu'}
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <Calendar size={16} className="me-2 text-purple" /> 
                                        {gallery.event_date ? new Date(gallery.event_date).toLocaleDateString() : 'Date non définie'}
                                    </div>
                                    <div className="d-flex align-items-center text-purple fw-bold">
                                        <Layers size={16} className="me-2" /> 
                                        {gallery.photos.length} photos
                                    </div>
                                    {/* COMPTEUR D'EXPIRATION */}
                                    <div className="d-flex align-items-center text-danger fw-bold bg-danger-light px-2 py-1 rounded">
                                        <Timer size={16} className="me-2" /> 
                                        {gallery.expires_at ? (
                                        <>
                                            Expire le : {new Date(gallery.expires_at).toLocaleDateString()} 
                                            <span className="ms-1">({calculateDaysLeft()} j. restants)</span>
                                        </>
                                        ) : (
                                            <span>Date d'expiration non définie</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
                                <button onClick={copyClientLink} className="btn btn-outline-purple me-2">
                                    <Share2 size={18} className="me-2" /> Partager
                                </button>
                                <a href={`/client/gallery/${gallery.slug}`} target="_blank" className="btn btn-admin-action">
                                    <ExternalLink size={18} className="me-2" /> Aperçu Client
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FILTRES ET STATISTIQUES */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="btn-group bg-white shadow-sm p-1 rounded-3">
                        <button 
                            onClick={() => setFilterFavorites(false)}
                            className={`btn btn-sm px-4 ${!filterFavorites ? 'btn-purple text-white shadow-sm' : 'btn-light'}`}
                        >
                            Toutes les photos
                        </button>
                        <button 
                            onClick={() => setFilterFavorites(true)}
                            className={`btn btn-sm px-4 ${filterFavorites ? 'btn-purple text-white shadow-sm' : 'btn-light'}`}
                        >
                            <Heart size={14} className={`me-2 ${filterFavorites ? 'fill-white' : ''}`} /> 
                            Sélection Client ({favoritesCount})
                        </button>
                    </div>
                </div>

                {/* GRILLE DE PHOTOS S3 */}
                <div className="row g-4">
                    {displayedPhotos.length > 0 ? (
                        displayedPhotos.map((photo) => (
                            <div key={photo.id} className="col-6 col-md-4 col-lg-3">
                                <div className="admin-photo-card bg-white rounded-4 shadow-sm overflow-hidden border h-100">
                                    {/* APPERCU IMAGE */}
                                    <div className="position-relative ratio ratio-1x1 bg-light">
                                        <img 
                                            src={photo.full_url} 
                                            alt={photo.title}
                                            className="object-fit-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = `https://placehold.co/400x400/f3f0ff/6366f1?text=${photo.title}`;
                                            }}
                                        />
                                        {photo.is_selected && (
                                            <div className="position-absolute top-0 end-0 p-2">
                                                <span className="badge bg-danger rounded-pill shadow-sm d-flex align-items-center">
                                                    <Heart size={12} className="fill-white me-1" /> Sélection
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* INFOS FICHIER */}
                                    <div className="p-3 border-top bg-white">
                                        <p className="small fw-bold mb-0 text-truncate text-dark" title={photo.title}>
                                            {photo.title}
                                        </p>
                                        <div className="d-flex justify-content-between align-items-center mt-2">
                                            <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                ID: #{photo.id}
                                            </span>
                                            <a href={photo.full_url} target="_blank" className="btn btn-link btn-sm p-0 text-purple">
                                                <Download size={14} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <p className="text-muted">Aucune photo dans cette catégorie.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}