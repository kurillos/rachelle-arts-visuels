import React, { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    ChevronLeft, Heart, Share2, ExternalLink, Download,
    Layers, Calendar, User, Timer, UploadCloud, CheckCircle, XCircle, Loader2
} from 'lucide-react';
import axios from 'axios';
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

const cyanStyle = {
    color: '#00e5ff',
    bgLight: 'rgba(0, 229, 255, 0.1)',
    border: '2px dashed #00e5ff',
    progressBg: '#00e5ff'
};

export default function Show({ auth, gallery }: Props) {
    const [filterFavorites, setFilterFavorites] = useState(false);

    // Moteur d'upload Asynchrone
    const [uploadState, setUploadState] = useState({
        isUploading: false,
        filesToUpload: [] as File[],
        currentIndex: 0,
        successCount: 0,
        errorCount: 0,
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setUploadState({
            isUploading: true,
            filesToUpload: files,
            currentIndex: 0,
            successCount: 0,
            errorCount: 0,
        });

        let success = 0;
        let errors = 0;

        for (let i = 0; i < files.length; i++) {
            setUploadState(prev => ({ ...prev, currentIndex: i }));

            const formData = new FormData();
            formData.append('photo', files[i]);

            try {
                await axios.post(route('admin.galleries.upload', gallery.id), formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                success++;
            } catch (error) {
                console.error(`Erreur photo ${files[i].name}`, error);
                errors++;
            }
        }

        setUploadState(prev => ({
            ...prev,
            isUploading: false,
            successCount: success,
            errorCount: errors,
            currentIndex: files.length
        }));

        // Rafraîchir pour afficher les photos
        router.reload({ only: ['gallery'] });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const displayedPhotos = filterFavorites
        ? gallery.photos.filter(p => p.is_selected)
        : gallery.photos;

    const favoritesCount = gallery.photos.filter(p => p.is_selected).length;

    const calculateDaysLeft = () => {
        if (!gallery.expires_at) return 0;
        const diff = new Date(gallery.expires_at).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return Math.max(0, days);
    };

    const copyClientLink = () => {
        const url = `${window.location.origin}/client/gallery/${gallery.slug}`;
        navigator.clipboard.writeText(url);
        alert("Lien copié ! Vous pouvez l'envoyer au client.");
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`Galerie - ${gallery.title}`} />

            <div className="admin-show-gallery">
                <div className="mb-4">
                    <Link href={route('admin.galleries.index')} className="text-muted text-decoration-none d-flex align-items-center small">
                        <ChevronLeft size={16} className="me-1" /> Retour aux galeries
                    </Link>
                </div>

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

                {/* ZONE DE DÉPÔT ET GRILLE */}
                <div className="row g-4">
                    {/* COLONNE UPLOAD ASYNCHRONE (CYAN) */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                            <div className="card-body p-4 text-center">
                                <h5 className="fw-bold mb-4">Ajouter des photos</h5>

                                {!uploadState.isUploading ? (
                                    <label className="d-block p-5 rounded-4 pointer" style={{ backgroundColor: cyanStyle.bgLight, border: cyanStyle.border, transition: 'all 0.3s ease' }}>
                                        <input type="file" multiple accept="image/jpeg, image/png, image/webp" className="d-none" onChange={handleFilesSelected} ref={fileInputRef} />
                                        <UploadCloud size={48} style={{ color: cyanStyle.color }} className="mb-3 mx-auto" />
                                        <h6 className="fw-bold text-dark">Cliquez ou glissez vos photos ici</h6>
                                        <p className="small text-muted mb-0">L'upload se fera automatiquement une par une avec filigrane.</p>
                                    </label>
                                ) : (
                                    <div className="p-4 rounded-4 bg-light">
                                        <Loader2 size={40} className="spin mb-3 mx-auto" style={{ color: cyanStyle.color }} />
                                        <h6 className="fw-bold mb-1">Traitement en cours...</h6>
                                        <div className="d-flex justify-content-between small fw-bold mt-4 mb-2">
                                            <span className="text-muted text-truncate" style={{ maxWidth: '70%' }}>
                                                {uploadState.filesToUpload[uploadState.currentIndex]?.name}
                                            </span>
                                            <span style={{ color: cyanStyle.color }}>
                                                {uploadState.currentIndex} / {uploadState.filesToUpload.length}
                                            </span>
                                        </div>
                                        <div className="progress" style={{ height: '12px', borderRadius: '10px' }}>
                                            <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${(uploadState.currentIndex / uploadState.filesToUpload.length) * 100}%`, backgroundColor: cyanStyle.progressBg }}></div>
                                        </div>
                                    </div>
                                )}

                                {uploadState.filesToUpload.length > 0 && !uploadState.isUploading && (
                                    <div className="mt-4 p-3 rounded-3 bg-light text-start small">
                                        <div className="fw-bold mb-2">Dernier transfert :</div>
                                        <div className="text-success d-flex align-items-center mb-1">
                                            <CheckCircle size={14} className="me-2" /> {uploadState.successCount} réussies
                                        </div>
                                        {uploadState.errorCount > 0 && (
                                            <div className="text-danger d-flex align-items-center">
                                                <XCircle size={14} className="me-2" /> {uploadState.errorCount} échecs
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* COLONNE GRILLE PHOTOS */}
                    <div className="col-lg-8">
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

                        <div className="row g-4">
                            {displayedPhotos.length > 0 ? (
                                displayedPhotos.map((photo) => (
                                    <div key={photo.id} className="col-6 col-md-4">
                                        <div className="admin-photo-card bg-white rounded-4 shadow-sm overflow-hidden border h-100">
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
                                            <div className="p-3 border-top bg-white">
                                                <p className="small fw-bold mb-0 text-truncate text-dark" title={photo.title}>
                                                    {photo.title}
                                                </p>
                                                <div className="d-flex justify-content-between align-items-center mt-2">
                                                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                        ID: #{photo.id}
                                                    </span>
                                                    <a href={photo.full_url} target="_blank" rel="noreferrer" className="btn btn-link btn-sm p-0 text-purple">
                                                        <Download size={14} />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center py-5 bg-white rounded-4 shadow-sm">
                                    <p className="text-muted mb-0">Aucune photo dans cette galerie pour le moment.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}