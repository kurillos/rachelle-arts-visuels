import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function Dashboard({ auth, images = [] }: any) {
    // Utilisation de useForm pour gérer l'envoi vers S3
    const { data, setData, post, processing, errors, reset } = useForm({
        image: null as File | null,
        title: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.carousel.upload'), {
            onSuccess: () => reset(),
        });
    };

    if (!auth?.user) return <div className="p-5 text-center">Chargement...</div>;

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Administration - Portfolio" />

            <div className="container py-5">
                <div className="text-center mb-5">
                    <h1 className="font-charm text-purple display-4">Gestion du Portfolio HD</h1>
                    <span className="badge rounded-pill bg-light text-cyan border border-cyan py-2 px-3">
                        ☁️ Infrastructure Amazon S3 Connectée
                    </span>
                </div>

                <div className="row g-5">
                    {/* COLONNE GAUCHE : FORMULAIRE D'UPLOAD */}
                    <div className="col-lg-5">
                        <form onSubmit={submit} className="card border-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="bg-purple text-white p-3 text-center fw-bold">
                                📤 Publier une nouvelle pépite
                            </div>
                            <div className="card-body p-4 text-center">
                                {/* Zone de Drop / Input File */}
                                <div className="upload-zone mb-4 py-5 border-2 border-dashed border-cyan rounded-4 bg-light">
                                    <input 
                                        type="file" 
                                        id="file-upload" 
                                        className="d-none"
                                        onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                                    />
                                    <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                                        <div className="fs-1 text-cyan mb-2">🖼️</div>
                                        <p className="mb-0 fw-bold">Glissez votre œuvre ici</p>
                                        <small className="text-muted text-uppercase">HD autorisée (JPEG, PNG, WebP)</small>
                                    </label>
                                    {data.image && <div className="mt-2 text-success small">Fichier sélectionné : {(data.image as File).name}</div>}
                                </div>

                                <div className="mb-4 text-start">
                                    <label className="form-label font-charm">Titre de l'œuvre</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Ex: Reflets d'Émeraude"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn-envoyez w-100 py-3" 
                                    disabled={processing}
                                >
                                    {processing ? 'TRANSFERT EN COURS...' : 'ENVOYER VERS LE NUAGE'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* COLONNE DROITE : LISTE DES IMAGES */}
                    <div className="col-lg-7">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="font-charm">Ma Galerie Cloud</h3>
                            <span className="badge bg-cyan rounded-pill">{images.length} Œuvres</span>
                        </div>

                        <div className="row g-3">
                            {images.length > 0 ? (
                                images.map((img: any) => (
                                    <div key={img.id} className="col-md-4">
                                        <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                            <img src={img.url} className="card-img-top" style={{ height: '120px', objectFit: 'cover' }} />
                                            <div className="card-body p-2 text-center">
                                                <button className="btn btn-link text-danger p-0 small">Supprimer</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-5">
                                    <div className="fs-1 mb-3">🖼️</div>
                                    <h5>Votre galerie est vide</h5>
                                    <p className="text-muted">Donnez vie à votre site en envoyant votre première création.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}