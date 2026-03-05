import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Heart, X, ShoppingCart, Info, CheckCircle } from 'lucide-react';
// @ts-ignore
import { route } from 'ziggy-js';

interface Photo {
    id: number;
    title: string;
    is_selected: boolean;
    full_url: string;
}

interface Gallery {
    id: number;
    title: string;
    photo_quota: number;
    extra_photo_price: number;
    photos: Photo[];
}

interface Props {
    gallery: Gallery;
}

export default function Show({ gallery }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const selections = gallery.photos.filter(p => p.is_selected);
    const quota = gallery.photo_quota || 15;
    const extraCount = Math.max(0, selections.length - quota);
    const totalPrice = extraCount * (gallery.extra_photo_price || 10);
    
    const toggleFavorite = (photoId: number) => {
        router.post(route('client.gallery.favorite', photoId), {}, {
            preserveScroll: true
        });
    };

    return (
        <div className="bg-light min-vh-100 d-flex flex-column">
            <Head title={gallery.title} />

            {/* HEADER MINIMALISTE */}
            <header className="bg-white py-3 px-4 shadow-sm d-flex justify-content-between align-items-center sticky-top">
                <h1 className="admin-title-cursive h4 text-purple mb-0">{gallery.title}</h1>
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="btn btn-outline-purple btn-sm rounded-pill"
                >
                    {selections.length} Sélectionnée(s)
                </button>
            </header>

            <div className="d-flex flex-grow-1 overflow-hidden">
                {/* GRILLE PRINCIPALE */}
                <main className="flex-grow-1 p-4 overflow-auto">
                    <div className="row g-3">
                        {gallery.photos.map((photo) => (
                            <div key={photo.id} className="col-6 col-md-4 col-xl-3">
                                <div className={`card border-0 rounded-4 shadow-sm overflow-hidden position-relative ${photo.is_selected ? 'ring-purple' : ''}`}>
                                    <img 
                                        src={photo.full_url} 
                                        className="img-fluid object-fit-cover w-100" 
                                        style={{ aspectRatio: '3/4' }}
                                    />
                                    <button 
                                        onClick={() => toggleFavorite(photo.id)}
                                        className="position-absolute top-0 end-0 m-2 btn btn-light btn-sm rounded-circle shadow"
                                    >
                                        <Heart size={18} className={photo.is_selected ? 'fill-danger text-danger' : 'text-muted'} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                {/* BANDEAU LATÉRAL (DYNAMIQUE) */}
                {isSidebarOpen && (
                    <aside className="bg-white border-start shadow-sm d-flex flex-column" style={{ width: '350px' }}>
                        <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                            <h2 className="h6 mb-0 fw-bold">Ma Sélection</h2>
                            <button onClick={() => setIsSidebarOpen(false)} className="btn btn-link p-0 text-muted"><X size={20}/></button>
                        </div>

                        {/* COMPTEUR ET PRIX */}
                        <div className="p-4 bg-purple-light">
                            <div className="d-flex justify-content-between mb-2">
                                <span>Incluses :</span>
                                <span className="fw-bold">{quota} photos</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Sélectionnées :</span>
                                <span className={`fw-bold ${selections.length > quota ? 'text-danger' : 'text-success'}`}>
                                    {selections.length} / {quota}
                                </span>
                            </div>
                            
                            {extraCount > 0 && (
                                <div className="mt-3 p-3 bg-white rounded-3 border border-danger">
                                    <p className="small text-danger mb-1 fw-bold">Suppléments : +{extraCount} photos</p>
                                    <h4 className="mb-0 text-purple">{totalPrice} €</h4>
                                </div>
                            )}
                        </div>

                        {/* MINIATURES SÉLECTIONNÉES */}
                        <div className="flex-grow-1 overflow-auto p-3">
                            <div className="row g-2">
                                {selections.map(p => (
                                    <div key={p.id} className="col-4 position-relative">
                                        <img src={p.full_url} className="img-fluid rounded-2 border" />
                                        <button 
                                            onClick={() => toggleFavorite(p.id)}
                                            className="position-absolute top-0 end-0 p-0 border-0 bg-danger text-white rounded-circle"
                                            style={{width: '18px', height: '18px', marginTop: '-5px'}}
                                        >
                                            <X size={12}/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* VALIDATION FINALE */}
                        <div className="p-4 border-top">
                            <button 
                                className="btn btn-purple w-100 py-3 rounded-pill fw-bold shadow-sm"
                                data-bs-toggle="modal" 
                                data-bs-target="#confirmModal"
                            >
                                Valider ma sélection
                            </button>
                        </div>
                    </aside>
                )}
            </div>

            {/* MODALE DE CONFIRMATION */}
            <div className="modal fade" id="confirmModal" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 rounded-4 shadow">
                        <div className="modal-body p-5 text-center">
                            <CheckCircle size={60} className="text-success mb-4" />
                            <h3 className="h4 mb-3">Prêt à valider ?</h3>
                            <p className="text-muted">
                                Vous avez sélectionné <strong>{selections.length} photos</strong>.
                                {extraCount > 0 ? (
                                    <span className="d-block mt-2 text-danger fw-bold">
                                        Un supplément de {totalPrice} € sera appliqué sur votre facture finale.
                                    </span>
                                ) : (
                                    " Cette sélection est incluse dans votre forfait initial."
                                )}
                            </p>
                            <div className="d-flex gap-3 mt-4">
                                <button className="btn btn-light w-100 py-2 rounded-pill" data-bs-dismiss="modal">Continuer</button>
                                <button className="btn btn-purple w-100 py-2 rounded-pill shadow-sm">Confirmer</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}