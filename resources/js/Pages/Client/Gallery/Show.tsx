import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
    Heart, X, ShoppingCart, Info, CheckCircle, 
    Clock, MessageSquare, Send, ChevronRight 
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
    quota: number;
    extra_photo_price: number;
    expires_at: string;
    photos: Photo[];
}

interface Props {
    gallery: Gallery;
}

export default function Show({ gallery }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 992);
    const [timeLeft, setTimeLeft] = useState("");
    const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
    const [commentText, setCommentText] = useState("");

    const selections = gallery.photos.filter(p => p.is_selected);
    const quota = gallery.quota || 15;
    const extraCount = Math.max(0, selections.length - quota);
    const totalPrice = extraCount * (gallery.extra_photo_price || 10);

    // --- Logique du Timer ---
    useEffect(() => {
        const timer = setInterval(() => {
            const end = new Date(gallery.expires_at).getTime();
            const now = new Date().getTime();
            const distance = end - now;
            if (distance < 0) {
                setTimeLeft("Expirée");
                clearInterval(timer);
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                setTimeLeft(`${days}j ${hours}h restants`);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [gallery.expires_at]);

    const toggleFavorite = (photoId: number) => {
        router.post(route('client.gallery.favorite', photoId), {}, { preserveScroll: true });
    };

    const saveComment = () => {
        if (!editingPhoto) return;
        router.post(route('client.gallery.photo.comment', editingPhoto.id), {
            comment: commentText
        }, {
            onSuccess: () => {
                setEditingPhoto(null);
                setCommentText("");
            },
            preserveScroll: true
        });
    };

    return (
        <div className="bg-light min-vh-100 d-flex flex-column client-gallery-root">
            <Head title={gallery.title} />

            {/* HEADER CLIENT */}
            <header className="bg-white py-2 px-4 shadow-sm d-flex justify-content-between align-items-center sticky-top z-3">
                <div className="d-flex align-items-center gap-3">
                    <img 
                        src="https://rachelle-art-visuels-storage.s3.eu-north-1.amazonaws.com/public/logo.png" 
                        height="45" 
                        alt="Logo Rachelle Arts" 
                    />
                    <div className="vr d-none d-md-block mx-2"></div>
                    <div className="d-none d-md-block">
                        <h1 className="admin-title-cursive h5 text-purple mb-0">{gallery.title}</h1>
                        <span className="badge bg-purple-light text-purple rounded-pill small">
                            <Clock size={12} className="me-1" /> {timeLeft}
                        </span>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                    <div className="text-end d-none d-lg-block">
                        <div className="small fw-bold">{selections.length} / {quota} photos</div>
                        <div className="progress" style={{ width: '100px', height: '6px' }}>
                            <div className="progress-bar bg-purple" style={{ width: `${Math.min(100, (selections.length / quota) * 100)}%` }}></div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                        className="btn btn-purple rounded-pill px-4 py-2 shadow-sm fw-bold d-flex align-items-center"
                    >
                        Ma Sélection <ChevronRight size={18} className={`ms-1 transition-all ${isSidebarOpen ? 'rotate-90' : ''}`} />
                    </button>
                </div>
            </header>

            <div className="d-flex flex-grow-1 overflow-hidden">
                {/* GRILLE PHOTOS */}
                <main className="flex-grow-1 p-3 p-md-4 overflow-auto">
                    <div className="row g-3 g-md-4">
                        {gallery.photos.map((photo) => (
                            <div key={photo.id} className="col-6 col-md-4 col-xl-3">
                                <div className={`card border-0 rounded-4 shadow-sm overflow-hidden photo-card-client ${photo.is_selected ? 'selected-ring' : ''}`}>
                                    <div className="position-relative">
                                        <img 
                                            src={photo.full_url} 
                                            className="img-fluid object-fit-cover w-100" 
                                            style={{ aspectRatio: '3/4', cursor: 'pointer' }}
                                            onClick={() => toggleFavorite(photo.id)}
                                        />
                                        
                                        {/* Badge Commentaire Existant */}
                                        {photo.client_comment && (
                                            <div className="position-absolute top-0 start-0 m-2">
                                                <span className="badge bg-dark rounded-pill opacity-75"><MessageSquare size={12}/></span>
                                            </div>
                                        )}

                                        {/* Actions Overlay */}
                                        <div className="position-absolute top-0 end-0 m-2 d-flex flex-column gap-2">
                                            <button 
                                                onClick={() => toggleFavorite(photo.id)} 
                                                className={`btn rounded-circle shadow-sm p-2 ${photo.is_selected ? 'btn-purple' : 'btn-light'}`}
                                            >
                                                <Heart size={20} fill={photo.is_selected ? "white" : "none"} />
                                            </button>
                                            
                                            <button 
                                                onClick={() => {
                                                    setEditingPhoto(photo);
                                                    setCommentText(photo.client_comment || "");
                                                }}
                                                className="btn btn-light rounded-circle shadow-sm p-2"
                                            >
                                                <MessageSquare size={20} className="text-muted" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                {/* SIDEBAR SÉLECTION */}
                {isSidebarOpen && (
                    <aside className="bg-white border-start shadow-sm d-flex flex-column" style={{ width: '380px' }}>
                        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                            <h2 className="h6 mb-0 fw-bold d-flex align-items-center">
                                <ShoppingCart size={18} className="me-2 text-purple" /> Ma Sélection
                            </h2>
                            <button onClick={() => setIsSidebarOpen(false)} className="btn btn-link p-0 text-muted"><X size={20}/></button>
                        </div>

                        <div className="p-4 bg-purple-light-soft border-bottom">
                            <div className="d-flex justify-content-between small mb-2">
                                <span>Quota inclus ({quota})</span>
                                <span className={selections.length > quota ? 'text-danger fw-bold' : 'text-success fw-bold'}>
                                    {selections.length} / {quota}
                                </span>
                            </div>
                            
                            {extraCount > 0 && (
                                <div className="mt-2 p-3 bg-white rounded-4 border border-danger-subtle shadow-sm text-center">
                                    <div className="small text-danger fw-bold mb-1">Hors forfait : +{extraCount} photo(s)</div>
                                    <div className="h4 mb-0 text-purple fw-bold">{totalPrice} €</div>
                                    <div className="text-muted" style={{fontSize: '0.7rem'}}>({gallery.extra_photo_price}€ l'unité)</div>
                                </div>
                            )}
                        </div>

                        {/* MINIATURES */}
                        <div className="flex-grow-1 overflow-auto p-3">
                            <div className="row g-2">
                                {selections.map(p => (
                                    <div key={p.id} className="col-4 position-relative mb-2">
                                        <img src={p.full_url} className="img-fluid rounded-3 border" style={{aspectRatio: '1/1', objectFit: 'cover'}} />
                                        <button 
                                            onClick={() => toggleFavorite(p.id)}
                                            className="btn-remove-selection"
                                        >
                                            <X size={10}/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {selections.length === 0 && (
                                <div className="text-center py-5 text-muted opacity-50">
                                    <Heart size={40} className="mb-2" />
                                    <p className="small">Aucune photo sélectionnée</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-top">
                            <button 
                                className="btn btn-purple w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                                disabled={selections.length === 0}
                            >
                                Valider ma commande <Send size={18} />
                            </button>
                        </div>
                    </aside>
                )}
            </div>

            {/* MODALE COMMENTAIRE / RETOUCHE */}
            {editingPhoto && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 overflow-hidden shadow-lg">
                            <div className="row g-0">
                                <div className="col-4">
                                    <img src={editingPhoto.full_url} className="img-fluid h-100 object-fit-cover" />
                                </div>
                                <div className="col-8">
                                    <div className="p-4">
                                        <h5 className="fw-bold mb-1">Notes de retouche</h5>
                                        <p className="text-muted small mb-3">Précisez vos souhaits (Noir & Blanc, recadrage...)</p>
                                        <textarea 
                                            className="form-control admin-input rounded-3 mb-3" 
                                            rows={4}
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Ex: J'aimerais celle-ci en Noir & Blanc pour un agrandissement."
                                        ></textarea>
                                        <div className="d-flex gap-2 justify-content-end">
                                            <button onClick={() => setEditingPhoto(null)} className="btn btn-light px-4 rounded-pill">Annuler</button>
                                            <button onClick={saveComment} className="btn btn-purple px-4 rounded-pill">Enregistrer</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .client-gallery-root { font-family: 'Inter', sans-serif; }
                .bg-purple-light-soft { background-color: #fdfaff; }
                .btn-purple { background-color: #a855f7; color: white; border: none; }
                .btn-purple:hover { background-color: #9333ea; color: white; }
                .selected-ring { outline: 4px solid #a855f7; outline-offset: -4px; }
                .btn-remove-selection {
                    position: absolute; top: -5px; right: -5px;
                    background: #ef4444; color: white; border: none;
                    border-radius: 50%; width: 20px; height: 20px;
                    display: flex; align-items: center; justify-content: center;
                }
                .rotate-90 { transform: rotate(90deg); }
                .transition-all { transition: all 0.3s ease; }
                .photo-card-client img { transition: transform 0.4s ease; }
                .photo-card-client:hover img { transform: scale(1.05); }
            `}</style>
        </div>
    );
}