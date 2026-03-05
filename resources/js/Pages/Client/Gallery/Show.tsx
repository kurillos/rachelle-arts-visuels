import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
    Heart, X, ShoppingCart, Info, CheckCircle, 
    Clock, MessageSquare, Send, ChevronRight, ShieldCheck 
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 992);
    const [timeLeft, setTimeLeft] = useState("");
    const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
    const [commentText, setCommentText] = useState("");

    const selections = gallery.photos.filter(p => p.is_selected);
    const quota = gallery.quota || 0;
    const extraCount = Math.max(0, selections.length - quota);
    const totalPrice = extraCount * (gallery.extra_photo_price || 0);

    // --- SÉCURITÉ BLINDÉE (CLIC DROIT + CLAVIER) ---
    useEffect(() => {
        // Bloque le clic droit
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        
        // Bloque les touches sensibles (Inspection, Impression, Enregistrement)
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === "F12" || 
                (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
                (e.ctrlKey && (e.key === "u" || e.key === "s" || e.key === "p")) ||
                (e.metaKey && (e.key === "p" || e.key === "s"))
            ) {
                e.preventDefault();
                alert("🔒 Protection Rachelle Arts : Le téléchargement et les captures sont désactivés pour protéger les droits d'auteur.");
                return false;
            }
        };

        // Utilisation de 'true' pour capturer l'événement avant tout le monde
        document.addEventListener("contextmenu", handleContextMenu, true);
        document.addEventListener("keydown", handleKeyDown, true);
        
        return () => {
            document.removeEventListener("contextmenu", handleContextMenu, true);
            document.removeEventListener("keydown", handleKeyDown, true);
        };
    }, []);

    // --- LOGIQUE DU TIMER ---
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

    const validateSelection = () => {
        if(confirm(`Voulez-vous valider votre sélection de ${selections.length} photos ?`)) {
            router.post(route('client.gallery.validate', gallery.slug));
        }
    };

    return (
        <div className="bg-light min-vh-100 d-flex flex-column client-gallery-root no-select">
            <Head title={gallery.title} />

            <header className="bg-white py-2 px-4 shadow-sm d-flex justify-content-between align-items-center sticky-top z-3">
                <div className="d-flex align-items-center gap-3">
                    <img 
                        src="https://rachelle-art-visuels-storage.s3.eu-north-1.amazonaws.com/public/logo.png" 
                        height="45" 
                        alt="Logo Rachelle Arts" 
                        className="no-drag"
                    />
                    <div className="vr d-none d-md-block mx-2"></div>
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
                            <div className="progress-bar bg-purple" style={{ width: `${Math.min(100, (selections.length / (quota || 1)) * 100)}%` }}></div>
                        </div>
                    </div>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="btn btn-purple rounded-pill px-4 py-2 shadow-sm fw-bold d-flex align-items-center">
                        Ma Sélection <ChevronRight size={18} className={`ms-1 transition-all ${isSidebarOpen ? 'rotate-90' : ''}`} />
                    </button>
                </div>
            </header>

            <div className="d-flex flex-grow-1 overflow-hidden">
                <main className="flex-grow-1 p-3 p-md-4 overflow-auto">
                    <div className="row g-3 g-md-4">
                        {gallery.photos.map((photo) => (
                            <div key={photo.id} className="col-6 col-md-4 col-xl-3">
                                <div className={`card border-0 rounded-4 shadow-sm overflow-hidden photo-card-client ${photo.is_selected ? 'selected-ring' : ''}`}>
                                    <div className="position-relative">
                                        <img src={photo.full_url} className="img-fluid object-fit-cover w-100 no-drag" style={{ aspectRatio: '3/4', cursor: 'pointer' }} onClick={() => toggleFavorite(photo.id)} />
                                        <div className="position-absolute top-0 end-0 m-2 d-flex flex-column gap-2">
                                            <button onClick={() => toggleFavorite(photo.id)} className={`btn rounded-circle shadow-sm p-2 ${photo.is_selected ? 'btn-purple' : 'btn-light'}`}>
                                                <Heart size={20} fill={photo.is_selected ? "white" : "none"} />
                                            </button>
                                            <button onClick={() => { setEditingPhoto(photo); setCommentText(photo.client_comment || ""); }} className="btn btn-light rounded-circle shadow-sm p-2">
                                                <MessageSquare size={20} className="text-muted" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                {isSidebarOpen && (
                    <aside className="bg-white border-start shadow-sm d-flex flex-column" style={{ width: '380px' }}>
                        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                            <h2 className="h6 mb-0 fw-bold d-flex align-items-center">
                                <ShoppingCart size={18} className="me-2 text-purple" /> Ma Sélection
                            </h2>
                            <button onClick={() => setIsSidebarOpen(false)} className="btn btn-link p-0 text-muted"><X size={20}/></button>
                        </div>
                        <div className="p-4 bg-purple-light-soft border-bottom text-center">
                            <div className="d-flex justify-content-between small mb-2">
                                <span>Quota inclus</span>
                                <span className={selections.length > quota ? 'text-danger fw-bold' : 'text-success fw-bold'}>{selections.length} / {quota}</span>
                            </div>
                            {extraCount > 0 && (
                                <div className="mt-2 p-3 bg-white rounded-4 border border-danger-subtle shadow-sm">
                                    <div className="small text-danger fw-bold mb-1">Hors forfait : +{extraCount} photo(s)</div>
                                    <div className="h4 mb-0 text-purple fw-bold">{totalPrice} €</div>
                                </div>
                            )}
                        </div>
                        <div className="flex-grow-1 overflow-auto p-3">
                            <div className="row g-2">
                                {selections.map(p => (
                                    <div key={p.id} className="col-4 position-relative mb-2">
                                        <img src={p.full_url} className="img-fluid rounded-3 border no-drag" style={{aspectRatio: '1/1', objectFit: 'cover'}} />
                                        <button onClick={() => toggleFavorite(p.id)} className="btn-remove-selection"><X size={10}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 border-top">
                            <button onClick={validateSelection} className="btn btn-purple w-100 py-3 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2" disabled={selections.length === 0}>
                                Valider ma commande <Send size={18} />
                            </button>
                        </div>
                    </aside>
                )}
            </div>

            {/* MODALE RETOUCHE */}
            {editingPhoto && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 overflow-hidden shadow-lg">
                            <div className="row g-0">
                                <div className="col-4"><img src={editingPhoto.full_url} className="img-fluid h-100 object-fit-cover no-drag" /></div>
                                <div className="col-8">
                                    <div className="p-4">
                                        <h5 className="fw-bold mb-1">Notes de retouche</h5>
                                        <textarea className="form-control admin-input rounded-3 mb-3" rows={4} value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Ex: Noir & Blanc..."></textarea>
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
                /* PROTECTION ANTI-VOL */
                .no-select { 
                    -webkit-user-select: none; 
                    -moz-user-select: none; 
                    -ms-user-select: none; 
                    user-select: none; 
                    -webkit-touch-callout: none;
                }
                .no-drag { 
                    -webkit-user-drag: none; 
                    user-drag: none;
                    pointer-events: none !important; 
                }
                @media print { body { display: none !important; } }
                
                .bg-purple-light-soft { background-color: #fdfaff; }
                .btn-purple { background-color: #a855f7; color: white; border: none; }
                .btn-purple:hover { background-color: #9333ea; color: white; }
                .selected-ring { outline: 4px solid #a855f7; outline-offset: -4px; }
                .btn-remove-selection { position: absolute; top: -5px; right: -5px; background: #ef4444; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; }
                .rotate-90 { transform: rotate(90deg); }
                .transition-all { transition: all 0.3s ease; }
            `}</style>
        </div>
    );
}