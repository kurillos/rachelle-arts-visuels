import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    ChevronLeft, ChevronRight, Heart, Share2, ExternalLink, Download,
    Layers, Calendar, User, Timer, UploadCloud, CheckCircle,
    XCircle, Loader2, MessageSquare, X, CheckSquare
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
    client_comment?: string;
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

    // ── Lightbox admin ──────────────────────────────────────────────────────
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // La lightbox admin navigue uniquement dans la liste affichée (toutes ou favoris)
    const displayedPhotos = filterFavorites
        ? gallery.photos.filter(p => p.is_selected)
        : gallery.photos;

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const prevLight = useCallback(() => {
        if (lightboxIndex === null) return;
        setLightboxIndex((lightboxIndex - 1 + displayedPhotos.length) % displayedPhotos.length);
    }, [lightboxIndex, displayedPhotos.length]);

    const nextLight = useCallback(() => {
        if (lightboxIndex === null) return;
        setLightboxIndex((lightboxIndex + 1) % displayedPhotos.length);
    }, [lightboxIndex, displayedPhotos.length]);

    useEffect(() => {
        if (lightboxIndex === null) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft')  prevLight();
            if (e.key === 'ArrowRight') nextLight();
            if (e.key === 'Escape')     closeLightbox();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [lightboxIndex, prevLight, nextLight]);

    // ── Upload asynchrone ───────────────────────────────────────────────────
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

        setUploadState({ isUploading: true, filesToUpload: files, currentIndex: 0, successCount: 0, errorCount: 0 });

        let success = 0, errors = 0;
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

        setUploadState(prev => ({ ...prev, isUploading: false, successCount: success, errorCount: errors, currentIndex: files.length }));
        router.reload({ only: ['gallery'] });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const favoritesCount = gallery.photos.filter(p => p.is_selected).length;
    const commentsCount  = gallery.photos.filter(p => p.client_comment).length;

    const calculateDaysLeft = () => {
        if (!gallery.expires_at) return 0;
        return Math.max(0, Math.ceil((new Date(gallery.expires_at).getTime() - Date.now()) / 86_400_000));
    };

    const copyClientLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/client/gallery/${gallery.slug}`);
        alert("Lien copié !");
    };

    const validateSelection = () => {
        if (!confirm(`Valider la sélection de ${favoritesCount} photo(s) pour ${gallery.client_name} ?`)) return;
        router.post(route('admin.galleries.send', gallery.id));
    };

    const currentLightPhoto = lightboxIndex !== null ? displayedPhotos[lightboxIndex] : null;

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`Galerie - ${gallery.title}`} />

            <div className="admin-show-gallery">
                <div className="mb-4">
                    <Link href={route('admin.galleries.index')} className="text-muted text-decoration-none d-flex align-items-center small">
                        <ChevronLeft size={16} className="me-1" /> Retour aux galeries
                    </Link>
                </div>

                {/* ── HEADER GALERIE ────────────────────────────────────── */}
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
                                        {gallery.expires_at
                                            ? <>Expire le {new Date(gallery.expires_at).toLocaleDateString()} <span className="ms-1">({calculateDaysLeft()} j. restants)</span></>
                                            : 'Pas d\'expiration'}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4 text-lg-end mt-4 mt-lg-0 d-flex flex-wrap gap-2 justify-content-lg-end">
                                {favoritesCount > 0 && (
                                    <button onClick={validateSelection} className="btn btn-success d-flex align-items-center gap-2">
                                        <CheckSquare size={18} /> Valider Sélection
                                    </button>
                                )}
                                <button onClick={copyClientLink} className="btn btn-outline-purple">
                                    <Share2 size={18} className="me-2" /> Partager
                                </button>
                                <a href={`/client/gallery/${gallery.slug}`} target="_blank" className="btn btn-admin-action">
                                    <ExternalLink size={18} className="me-2" /> Aperçu
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── CONTENU ───────────────────────────────────────────── */}
                <div className="row g-4">

                    {/* Colonne Upload */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 h-100 bg-white">
                            <div className="card-body p-4 text-center">
                                <h5 className="fw-bold mb-4">Uploader des photos</h5>

                                {!uploadState.isUploading ? (
                                    <label className="d-block p-5 rounded-4 pointer" style={{ backgroundColor: cyanStyle.bgLight, border: cyanStyle.border }}>
                                        <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="d-none" onChange={handleFilesSelected} ref={fileInputRef} />
                                        <UploadCloud size={48} style={{ color: cyanStyle.color }} className="mb-3 mx-auto" />
                                        <h6 className="fw-bold text-dark">Glissez les photos ici</h6>
                                        <p className="small text-muted mb-0">Traitement asynchrone sécurisé</p>
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
                                            <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${(uploadState.currentIndex / uploadState.filesToUpload.length) * 100}%`, backgroundColor: cyanStyle.progressBg }} />
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

                    {/* Colonne Grille */}
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
                                    className={`btn btn-sm px-4 d-flex align-items-center gap-2 ${filterFavorites ? 'btn-purple text-white shadow-sm' : 'btn-light'}`}
                                >
                                    <Heart size={14} fill={filterFavorites ? 'white' : 'none'} stroke={filterFavorites ? 'white' : 'currentColor'} />
                                    Sélection ({favoritesCount})
                                    {commentsCount > 0 && (
                                        <span className={`badge rounded-pill ${filterFavorites ? 'bg-white text-purple' : 'bg-info text-white'}`} style={{ fontSize: '0.65rem' }}>
                                            <MessageSquare size={10} className="me-1" />{commentsCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="row g-3">
                            {displayedPhotos.length > 0 ? (
                                displayedPhotos.map((photo, index) => (
                                    <div key={photo.id} className="col-6 col-md-4">
                                        {/* ── Carte photo style client ─────────────────── */}
                                        <div
                                            className={`admin-photo-card rounded-4 shadow-sm overflow-hidden border-0 h-100 ${photo.is_selected ? 'admin-selected-ring' : ''}`}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => openLightbox(index)}
                                        >
                                            <div className="position-relative">
                                                <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#f0f0f0' }}>
                                                    <img
                                                        src={photo.full_url}
                                                        alt={photo.title}
                                                        className="w-100 h-100 object-fit-cover"
                                                        onError={(e) => { e.currentTarget.src = `https://placehold.co/400x533/f3f0ff/6366f1?text=${photo.id}`; }}
                                                    />
                                                </div>

                                                {/* Badges style client (petits, en haut à droite) */}
                                                <div className="position-absolute top-0 end-0 m-2 d-flex flex-column gap-1">
                                                    {photo.is_selected && (
                                                        <span className="admin-badge-heart">
                                                            <Heart size={12} fill="white" stroke="white" />
                                                        </span>
                                                    )}
                                                    {photo.client_comment && (
                                                        <span className="admin-badge-comment" title={photo.client_comment}>
                                                            <MessageSquare size={12} fill="white" stroke="white" />
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Overlay commentaire en bas */}
                                                {photo.client_comment && (
                                                    <div className="position-absolute bottom-0 start-0 end-0 px-2 py-1" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.6))' }}>
                                                        <p className="small text-white mb-0 text-truncate" style={{ fontSize: '0.7rem', fontStyle: 'italic' }}>
                                                            💬 {photo.client_comment}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Pied de carte */}
                                            <div className="p-2 bg-white border-top d-flex justify-content-between align-items-center">
                                                <p className="small fw-bold mb-0 text-truncate text-dark" style={{ fontSize: '0.72rem' }} title={photo.title}>
                                                    {photo.title}
                                                </p>
                                                <a
                                                    href={photo.full_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="btn btn-link btn-sm p-0 text-purple ms-2"
                                                    onClick={(e) => e.stopPropagation()}
                                                    title="Télécharger"
                                                >
                                                    <Download size={14} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center py-5 bg-white rounded-4 shadow-sm">
                                    <p className="text-muted mb-0">
                                        {filterFavorites ? 'Le client n\'a pas encore fait de sélection.' : 'Aucune photo dans cette galerie.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── LIGHTBOX ADMIN ────────────────────────────────────────── */}
            {currentLightPhoto && (
                <div className="carousel-overlay" onClick={closeLightbox}>
                    <button className="carousel-close" onClick={closeLightbox}><X size={28} /></button>

                    <button className="carousel-nav carousel-prev" onClick={(e) => { e.stopPropagation(); prevLight(); }}>
                        <ChevronLeft size={36} />
                    </button>

                    <div className="carousel-content" onClick={(e) => e.stopPropagation()}>
                        <img src={currentLightPhoto.full_url} className="carousel-img" alt={currentLightPhoto.title} />
                        <div className="carousel-toolbar">
                            <div className="d-flex align-items-center gap-3">
                                <span className="text-white small opacity-75">{lightboxIndex! + 1} / {displayedPhotos.length}</span>
                                <span className="text-white small fw-bold">{currentLightPhoto.title}</span>
                            </div>
                            <div className="d-flex gap-2 align-items-center">
                                {currentLightPhoto.is_selected && (
                                    <span className="badge bg-purple-solid d-flex align-items-center gap-1 px-3 py-2">
                                        <Heart size={14} fill="white" stroke="white" /> Sélectionné
                                    </span>
                                )}
                                {currentLightPhoto.client_comment && (
                                    <span className="badge bg-info d-flex align-items-center gap-1 px-3 py-2" title={currentLightPhoto.client_comment}>
                                        <MessageSquare size={14} /> {currentLightPhoto.client_comment}
                                    </span>
                                )}
                                <a href={currentLightPhoto.full_url} target="_blank" rel="noreferrer" className="btn btn-light btn-sm rounded-pill px-3 d-flex align-items-center gap-2">
                                    <Download size={14} /> Télécharger
                                </a>
                            </div>
                        </div>
                    </div>

                    <button className="carousel-nav carousel-next" onClick={(e) => { e.stopPropagation(); nextLight(); }}>
                        <ChevronRight size={36} />
                    </button>
                </div>
            )}

            <style>{`
                .btn-purple { background-color:#a855f7; color:white; border:none; }
                .btn-purple:hover { background-color:#9333ea; color:white; }
                .btn-outline-purple { border:1px solid #a855f7; color:#a855f7; background:transparent; }
                .btn-outline-purple:hover { background:#a855f7; color:white; }
                .bg-purple-solid { background-color:#a855f7 !important; }

                /* Carte photo style client dans l'admin */
                .admin-photo-card { background:white; transition:transform 0.2s ease, box-shadow 0.2s ease; }
                .admin-photo-card:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(168,85,247,0.18)!important; }
                .admin-selected-ring { outline:3px solid #a855f7; outline-offset:-3px; }

                /* Petits badges ronds (style client) */
                .admin-badge-heart {
                    display:inline-flex; align-items:center; justify-content:center;
                    width:26px; height:26px; border-radius:50%;
                    background:#ef4444; box-shadow:0 2px 6px rgba(0,0,0,0.3);
                }
                .admin-badge-comment {
                    display:inline-flex; align-items:center; justify-content:center;
                    width:26px; height:26px; border-radius:50%;
                    background:#0ea5e9; box-shadow:0 2px 6px rgba(0,0,0,0.3);
                }

                .spin { animation:spin 1s linear infinite; }
                @keyframes spin { to { transform:rotate(360deg); } }

                /* Lightbox */
                .carousel-overlay {
                    position:fixed; inset:0;
                    background:rgba(0,0,0,0.93);
                    display:flex; align-items:center; justify-content:center;
                    z-index:3000; animation:fadeIn 0.2s ease;
                }
                @keyframes fadeIn { from{opacity:0} to{opacity:1} }
                .carousel-close {
                    position:absolute; top:16px; right:20px;
                    background:rgba(255,255,255,0.15); color:white; border:none;
                    border-radius:50%; width:48px; height:48px;
                    display:flex; align-items:center; justify-content:center;
                    cursor:pointer; transition:background 0.2s; z-index:10;
                }
                .carousel-close:hover { background:rgba(255,255,255,0.3); }
                .carousel-nav {
                    position:absolute; top:50%; transform:translateY(-50%);
                    background:rgba(255,255,255,0.12); color:white; border:none;
                    border-radius:50%; width:56px; height:56px;
                    display:flex; align-items:center; justify-content:center;
                    cursor:pointer; transition:background 0.2s; z-index:10;
                }
                .carousel-nav:hover { background:rgba(255,255,255,0.28); }
                .carousel-prev { left:16px; }
                .carousel-next { right:16px; }
                .carousel-content {
                    display:flex; flex-direction:column; align-items:center;
                    max-height:90vh; max-width:calc(100vw - 160px);
                }
                .carousel-img {
                    max-height:82vh; max-width:100%;
                    object-fit:contain; border-radius:12px; display:block;
                }
                .carousel-toolbar {
                    display:flex; align-items:center; justify-content:space-between;
                    width:100%; padding:12px 4px 0; flex-wrap:wrap; gap:8px;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
