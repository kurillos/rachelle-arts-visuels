import React, { useState, useEffect, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Heart, X, ShoppingCart, Clock, MessageSquare,
    Send, ChevronRight, ChevronLeft, ShieldCheck, Check, Loader2
} from 'lucide-react';
// @ts-ignore
import { route } from 'ziggy-js';

interface Photo {
    id: number;
    title: string;
    is_selected: boolean;
    full_url: string;
    client_comment?: string;
}

interface Gallery {
    id: number;
    title: string;
    slug: string;
    quota: number;
    extra_photo_price: number;
    expires_at: string;
    photos: Photo[];
}

interface Props {
    gallery: Gallery;
}

export default function Show({ gallery }: Props) {
    const [photos, setPhotos] = useState<Photo[]>(gallery.photos);
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 992);
    const [timeLeft, setTimeLeft] = useState('');
    const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
    const [commentText, setCommentText] = useState('');
    const [savingComment, setSavingComment] = useState(false);
    const [loadingFavorite, setLoadingFavorite] = useState<number | null>(null);
    const [validating, setValidating] = useState(false);

    // ── Carousel / Lightbox ──────────────────────────────────────────────────
    const [carouselIndex, setCarouselIndex] = useState<number | null>(null);

    const openCarousel = (index: number) => setCarouselIndex(index);
    const closeCarousel = () => setCarouselIndex(null);

    const prevPhoto = useCallback(() => {
        if (carouselIndex === null) return;
        setCarouselIndex((carouselIndex - 1 + photos.length) % photos.length);
    }, [carouselIndex, photos.length]);

    const nextPhoto = useCallback(() => {
        if (carouselIndex === null) return;
        setCarouselIndex((carouselIndex + 1) % photos.length);
    }, [carouselIndex, photos.length]);

    useEffect(() => {
        if (carouselIndex === null) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prevPhoto();
            if (e.key === 'ArrowRight') nextPhoto();
            if (e.key === 'Escape') closeCarousel();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [carouselIndex, prevPhoto, nextPhoto]);

    useEffect(() => { setPhotos(gallery.photos); }, [gallery.photos]);

    const selections = photos.filter(p => p.is_selected);
    const quota = gallery.quota || 0;
    const extraCount = Math.max(0, selections.length - quota);
    const totalPrice = extraCount * (gallery.extra_photo_price || 0);

    // ── Protection anti-téléchargement ──────────────────────────────────────
    useEffect(() => {
        const noCtx = (e: MouseEvent) => e.preventDefault();
        const noKey = (e: KeyboardEvent) => {
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
                (e.ctrlKey && ['u', 's', 'p'].includes(e.key)) ||
                (e.metaKey && ['p', 's'].includes(e.key))
            ) {
                e.preventDefault();
                alert('🔒 Le téléchargement est désactivé pour protéger les droits d\'auteur.');
            }
        };
        document.addEventListener('contextmenu', noCtx, true);
        document.addEventListener('keydown', noKey, true);
        return () => {
            document.removeEventListener('contextmenu', noCtx, true);
            document.removeEventListener('keydown', noKey, true);
        };
    }, []);

    // ── Timer ────────────────────────────────────────────────────────────────
    useEffect(() => {
        const update = () => {
            const dist = new Date(gallery.expires_at).getTime() - Date.now();
            if (dist < 0) { setTimeLeft('Expirée'); return; }
            const days = Math.floor(dist / 86_400_000);
            const hours = Math.floor((dist % 86_400_000) / 3_600_000);
            setTimeLeft(`${days}j ${hours}h restants`);
        };
        update();
        const t = setInterval(update, 60_000);
        return () => clearInterval(t);
    }, [gallery.expires_at]);

    // ── Favori (optimistic) ──────────────────────────────────────────────────
    const toggleFavorite = useCallback((photoId: number, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (loadingFavorite === photoId) return;
        setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, is_selected: !p.is_selected } : p));
        setLoadingFavorite(photoId);
        router.post(route('client.gallery.favorite', photoId), {}, {
            preserveScroll: true,
            onFinish: () => setLoadingFavorite(null),
            onError: () => setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, is_selected: !p.is_selected } : p)),
        });
    }, [loadingFavorite]);

    // ── Commentaire ──────────────────────────────────────────────────────────
    const openComment = (photo: Photo, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingPhoto(photo);
        setCommentText(photo.client_comment || '');
    };

    const saveComment = () => {
        if (!editingPhoto) return;
        setSavingComment(true);
        router.post(route('client.gallery.photo.comment', editingPhoto.id), { comment: commentText }, {
            preserveScroll: true,
            onSuccess: () => {
                setPhotos(prev => prev.map(p => p.id === editingPhoto!.id ? { ...p, client_comment: commentText } : p));
                setEditingPhoto(null);
                setCommentText('');
            },
            onFinish: () => setSavingComment(false),
        });
    };

    // ── Validation ───────────────────────────────────────────────────────────
    const validateSelection = () => {
        if (!confirm(`Valider votre sélection de ${selections.length} photo(s) ?\n\nCette action est définitive.`)) return;
        setValidating(true);
        router.post(route('client.gallery.validate', gallery.slug), {}, { onFinish: () => setValidating(false) });
    };

    const currentCarouselPhoto = carouselIndex !== null ? photos[carouselIndex] : null;

    return (
        <div className="bg-light min-vh-100 d-flex flex-column client-gallery-root no-select">
            <Head title={gallery.title} />

            {/* ── HEADER ─────────────────────────────────────────────────── */}
            <header className="bg-white py-2 px-4 shadow-sm d-flex justify-content-between align-items-center sticky-top" style={{ zIndex: 100 }}>
                <div className="d-flex align-items-center gap-3">
                    <img src="https://rachelle-art-visuels-storage.s3.eu-north-1.amazonaws.com/public/logo.png" height="45" alt="Logo" className="no-drag" />
                    <div className="vr d-none d-md-block mx-2" />
                    <div>
                        <h1 className="admin-title-cursive h5 text-purple mb-0">{gallery.title}</h1>
                        <span className="badge bg-purple-light text-purple rounded-pill small">
                            <Clock size={12} className="me-1" /> {timeLeft}
                        </span>
                    </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <div className="badge bg-success-light text-success d-none d-md-flex align-items-center me-2">
                        <ShieldCheck size={14} className="me-1" /> Sécurisé
                    </div>
                    <div className="text-end d-none d-lg-block">
                        <div className="small fw-bold">{selections.length} / {quota} photos</div>
                        <div className="progress" style={{ width: '100px', height: '6px' }}>
                            <div className="progress-bar bg-purple" style={{ width: `${Math.min(100, (selections.length / (quota || 1)) * 100)}%` }} />
                        </div>
                    </div>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="btn btn-purple rounded-pill px-4 py-2 shadow-sm fw-bold d-flex align-items-center">
                        Ma Sélection&nbsp;
                        {selections.length > 0 && <span className="badge bg-white text-purple rounded-pill me-1">{selections.length}</span>}
                        <ChevronRight size={18} className={`ms-1 transition-all ${isSidebarOpen ? 'rotate-90' : ''}`} />
                    </button>
                </div>
            </header>

            <div className="d-flex flex-grow-1 overflow-hidden">

                {/* ── GRILLE PHOTOS ──────────────────────────────────────── */}
                <main className="flex-grow-1 p-3 p-md-4 overflow-auto">
                    <div className="row g-3 g-md-4">
                        {photos.map((photo, index) => (
                            <div key={photo.id} className="col-6 col-md-4 col-xl-3">
                                {/* ── Correction carousel : onClick sur position-relative, pas sur .card ── */}
                                <div className={`card border-0 rounded-4 shadow-sm overflow-hidden photo-card-client ${photo.is_selected ? 'selected-ring' : ''}`}>
                                    <div
                                        className="position-relative"
                                        onClick={() => openCarousel(index)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            src={photo.full_url}
                                            className="img-fluid object-fit-cover w-100 no-drag"
                                            style={{ aspectRatio: '3/4' }}
                                            alt={photo.title}
                                        />
                                        <div className="position-absolute top-0 end-0 m-2 d-flex flex-column gap-2">
                                            <button
                                                onClick={(e) => toggleFavorite(photo.id, e)}
                                                className={`btn rounded-circle shadow-sm p-2 ${photo.is_selected ? 'btn-purple' : 'btn-light'}`}
                                            >
                                                {loadingFavorite === photo.id
                                                    ? <Loader2 size={20} className="spin" />
                                                    : <Heart size={20} fill={photo.is_selected ? 'white' : 'none'} />
                                                }
                                            </button>
                                            <button
                                                onClick={(e) => openComment(photo, e)}
                                                className={`btn rounded-circle shadow-sm p-2 ${photo.client_comment ? 'btn-info' : 'btn-light'}`}
                                            >
                                                <MessageSquare size={20} fill={photo.client_comment ? 'white' : 'none'} className={photo.client_comment ? 'text-white' : 'text-muted'} />
                                            </button>
                                        </div>
                                        {photo.client_comment && (
                                            <div className="position-absolute bottom-0 start-0 end-0 px-2 py-1" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.55))' }}>
                                                <p className="small text-white mb-0 text-truncate" style={{ fontSize: '0.7rem' }}>💬 {photo.client_comment}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                {/* ── SIDEBAR ────────────────────────────────────────────── */}
                {isSidebarOpen && (
                    <aside className="bg-white border-start shadow-sm d-flex flex-column" style={{ width: '380px', minWidth: '280px' }}>
                        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                            <h2 className="h6 mb-0 fw-bold d-flex align-items-center">
                                <ShoppingCart size={18} className="me-2 text-purple" /> Ma Sélection
                            </h2>
                            <button onClick={() => setIsSidebarOpen(false)} className="btn btn-link p-0 text-muted"><X size={20} /></button>
                        </div>

                        <div className="p-4 bg-purple-light-soft border-bottom">
                            <div className="d-flex justify-content-between small mb-2">
                                <span>Quota inclus</span>
                                <span className={selections.length > quota ? 'text-danger fw-bold' : 'text-success fw-bold'}>{selections.length} / {quota}</span>
                            </div>
                            <div className="progress mb-2" style={{ height: '8px' }}>
                                <div className={`progress-bar ${selections.length > quota ? 'bg-danger' : 'bg-purple'}`} style={{ width: `${Math.min(100, (selections.length / (quota || 1)) * 100)}%` }} />
                            </div>
                            {extraCount > 0 && (
                                <div className="mt-2 p-3 bg-white rounded-4 border border-danger-subtle shadow-sm text-center">
                                    <div className="small text-danger fw-bold mb-1">Hors forfait : +{extraCount} photo(s)</div>
                                    <div className="h4 mb-0 text-purple fw-bold">{totalPrice} €</div>
                                </div>
                            )}
                        </div>

                        <div className="flex-grow-1 overflow-auto p-3">
                            {selections.length === 0 ? (
                                <p className="text-muted small text-center mt-4">Cliquez sur ❤️ pour ajouter des photos.</p>
                            ) : (
                                <div className="row g-2">
                                    {selections.map(p => {
                                        const idx = photos.findIndex(ph => ph.id === p.id);
                                        return (
                                            <div key={p.id} className="col-4 position-relative mb-2">
                                                <img
                                                    src={p.full_url}
                                                    className="img-fluid rounded-3 border sidebar-thumb"
                                                    style={{ aspectRatio: '1/1', objectFit: 'cover', cursor: 'pointer' }}
                                                    alt={p.title}
                                                    onClick={() => openCarousel(idx)}
                                                />
                                                {p.client_comment && (
                                                    <span className="position-absolute bottom-0 start-0 badge bg-info" style={{ fontSize: '0.55rem' }} title={p.client_comment}>💬</span>
                                                )}
                                                <button onClick={(e) => { e.stopPropagation(); toggleFavorite(p.id); }} className="btn-remove-selection">
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-top">
                            <button
                                onClick={validateSelection}
                                className="btn btn-purple w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                                disabled={selections.length === 0 || validating}
                            >
                                {validating ? <><Loader2 size={18} className="spin" /> Envoi...</> : <><Send size={18} /> Valider ma sélection ({selections.length})</>}
                            </button>
                            <p className="text-muted text-center small mt-2 mb-0">Cette action est définitive.</p>
                        </div>
                    </aside>
                )}
            </div>

            {/* ── CAROUSEL LIGHTBOX ──────────────────────────────────────── */}
            {currentCarouselPhoto && (
                <div className="carousel-overlay" onClick={closeCarousel}>
                    <button className="carousel-close" onClick={closeCarousel}><X size={28} /></button>

                    <button className="carousel-nav carousel-prev" onClick={(e) => { e.stopPropagation(); prevPhoto(); }}>
                        <ChevronLeft size={36} />
                    </button>

                    <div className="carousel-content" onClick={(e) => e.stopPropagation()}>
                        <img src={currentCarouselPhoto.full_url} className="carousel-img" alt={currentCarouselPhoto.title} />
                        <div className="carousel-toolbar">
                            <span className="text-white small opacity-75">{carouselIndex! + 1} / {photos.length}</span>
                            <div className="d-flex gap-2">
                                <button
                                    onClick={() => toggleFavorite(currentCarouselPhoto.id)}
                                    className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-2 ${currentCarouselPhoto.is_selected ? 'btn-purple' : 'btn-light'}`}
                                >
                                    {loadingFavorite === currentCarouselPhoto.id
                                        ? <Loader2 size={16} className="spin" />
                                        : <Heart size={16} fill={currentCarouselPhoto.is_selected ? 'white' : 'none'} />
                                    }
                                    {currentCarouselPhoto.is_selected ? 'Sélectionnée' : 'Sélectionner'}
                                </button>
                                <button
                                    onClick={(e) => { closeCarousel(); openComment(currentCarouselPhoto, e); }}
                                    className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-2 ${currentCarouselPhoto.client_comment ? 'btn-info text-white' : 'btn-light'}`}
                                >
                                    <MessageSquare size={16} /> Note
                                </button>
                            </div>
                        </div>
                    </div>

                    <button className="carousel-nav carousel-next" onClick={(e) => { e.stopPropagation(); nextPhoto(); }}>
                        <ChevronRight size={36} />
                    </button>
                </div>
            )}

            {/* ── MODALE COMMENTAIRE ──────────────────────────────────────── */}
            {editingPhoto && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 overflow-hidden shadow-lg">
                            <div className="row g-0">
                                <div className="col-4">
                                    <img src={editingPhoto.full_url} className="img-fluid h-100 object-fit-cover" alt="" />
                                </div>
                                <div className="col-8 p-4">
                                    <h5 className="fw-bold mb-1">Notes de retouche</h5>
                                    <p className="text-muted small mb-3">Ex : "Noir & Blanc", "Éclaircir le visage"...</p>
                                    <textarea
                                        className="form-control admin-input rounded-3 mb-3"
                                        rows={4}
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Votre note pour Rachelle..."
                                        maxLength={500}
                                    />
                                    <div className="d-flex gap-2 justify-content-between align-items-center">
                                        <span className="text-muted small">{commentText.length}/500</span>
                                        <div className="d-flex gap-2">
                                            <button onClick={() => setEditingPhoto(null)} className="btn btn-light px-4 rounded-pill">Annuler</button>
                                            <button onClick={saveComment} disabled={savingComment} className="btn btn-purple px-4 rounded-pill d-flex align-items-center gap-2">
                                                {savingComment ? <><Loader2 size={16} className="spin" /> Enreg...</> : <><Check size={16} /> Enregistrer</>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .no-select { -webkit-user-select:none; user-select:none; -webkit-touch-callout:none; }
                /* ── Correction : no-drag sur img uniquement, pas pointer-events global ── */
                .no-drag { -webkit-user-drag:none; }
                img.no-drag { pointer-events:none !important; }
                @media print { body { display:none !important; } }

                .bg-purple-light-soft { background-color:#fdfaff; }
                .btn-purple { background-color:#a855f7; color:white; border:none; }
                .btn-purple:hover { background-color:#9333ea; color:white; }
                .btn-purple:disabled { background-color:#c084fc; }
                .selected-ring { outline:4px solid #a855f7; outline-offset:-4px; }
                .btn-remove-selection {
                    position:absolute; top:-5px; right:-5px;
                    background:#ef4444; color:white; border:none;
                    border-radius:50%; width:20px; height:20px;
                    display:flex; align-items:center; justify-content:center; cursor:pointer;
                }
                .rotate-90 { transform:rotate(90deg); }
                .transition-all { transition:all 0.3s ease; }
                .spin { animation:spin 1s linear infinite; }
                @keyframes spin { to { transform:rotate(360deg); } }
                .photo-card-client { transition:transform 0.2s ease,box-shadow 0.2s ease; }
                .photo-card-client:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(168,85,247,0.15)!important; }
                .sidebar-thumb { transition:transform 0.15s ease; }
                .sidebar-thumb:hover { transform:scale(1.05); box-shadow:0 4px 12px rgba(0,0,0,0.15); }

                /* Carousel */
                .carousel-overlay {
                    position:fixed; inset:0;
                    background:rgba(0,0,0,0.92);
                    display:flex; align-items:center; justify-content:center;
                    z-index:2000; animation:fadeIn 0.2s ease;
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
                    -webkit-user-drag:none;
                }
                .carousel-toolbar {
                    display:flex; align-items:center; justify-content:space-between;
                    width:100%; padding:12px 4px 0;
                }
            `}</style>
        </div>
    );
}
