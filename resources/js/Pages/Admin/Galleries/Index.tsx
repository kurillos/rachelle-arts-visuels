import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Plus, 
    Trash2, 
    Eye, 
    Calendar, 
    User as UserIcon, 
    Lock, 
    UploadCloud,
    Image as ImageIcon,
    CheckCircle2
} from 'lucide-react';
// @ts-ignore
import { route } from 'ziggy-js';

interface Gallery {
    id: number;
    title: string;
    client_name: string;
    slug: string;
    type: string;
    password: string;
    event_date: string;
    photos_count: number;
}

interface Props {
    auth: any;
    galleries: Gallery[];
    currentType: string;
}

export default function Index({ auth, galleries, currentType }: Props) {
    const [showModal, setShowModal] = useState(false);

    // Formulaire Inertia avec gestion de l'upload progressif
    const { data, setData, post, processing, progress, reset, errors } = useForm({
        title: '',
        client_name: '',
        type: currentType,
        password: Math.random().toString(36).slice(-6), // Génère un code auto
        event_date: '',
        images: [] as File[],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.galleries.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`Gestion ${currentType}s`} />

            <div className="admin-galleries-page">
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h1 className="admin-title-cursive h2 text-purple mb-1">
                            Mes {currentType === 'mariage' ? 'Mariages' : 'Shootings'}
                        </h1>
                        <p className="text-muted small">Gérez les accès privés et les sélections clients</p>
                    </div>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="btn btn-admin-action d-flex align-items-center px-4"
                    >
                        <Plus size={20} className="me-2" /> Créer une galerie
                    </button>
                </div>

                {/* GRILLE DES GALERIES */}
                <div className="row g-4">
                    {galleries.map((gallery) => (
                        <div key={gallery.id} className="col-md-6 col-xl-4">
                            <div className="card admin-card border-0 shadow-sm h-100">
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="bg-purple-light p-3 rounded-3">
                                            <ImageIcon className="text-purple" size={24} />
                                        </div>
                                        <div className="dropdown">
                                            <button className="btn btn-link text-muted p-0" type="button" data-bs-toggle="dropdown">
                                                <Trash2 size={18} className="text-danger" />
                                            </button>
                                            <ul className="dropdown-menu shadow border-0">
                                                <li>
                                                    <Link 
                                                        href={route('admin.galleries.destroy', gallery.id)} 
                                                        method="delete" 
                                                        as="button" 
                                                        className="dropdown-item text-danger d-flex align-items-center"
                                                        onClick={() => confirm('Supprimer cette galerie et toutes ses photos sur S3 ?')}
                                                    >
                                                        Confirmer la suppression
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <h5 className="fw-bold mb-1">{gallery.title}</h5>
                                    <p className="text-muted small mb-3">Client: {gallery.client_name || 'Non spécifié'}</p>
                                    
                                    <div className="d-flex gap-3 mb-4">
                                        <div className="small d-flex align-items-center text-muted">
                                            <Calendar size={14} className="me-1" /> {gallery.event_date || 'N/A'}
                                        </div>
                                        <div className="small d-flex align-items-center text-muted">
                                            <ImageIcon size={14} className="me-1" /> {gallery.photos_count} photos
                                        </div>
                                    </div>

                                    <div className="d-grid gap-2">
                                        <Link 
                                            href={route('admin.galleries.show', gallery.id)} 
                                            className="btn btn-outline-purple btn-sm py-2"
                                        >
                                            <Eye size={16} className="me-2" /> Gérer & Voir la sélection
                                        </Link>
                                    </div>
                                </div>
                                <div className="card-footer bg-light border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center text-purple small fw-bold">
                                        <Lock size={14} className="me-1" /> {gallery.password}
                                    </div>
                                    <span className="badge bg-success-light text-success">Active</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* MODAL DE CRÉATION (MODAL BOOTSTRAP MANUEL) */}
                {showModal && (
                    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content border-0 rounded-4 shadow-lg">
                                <form onSubmit={submit}>
                                    <div className="modal-header border-0 p-4">
                                        <h5 className="modal-title fw-bold">Nouvelle Galerie Privée</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                    </div>
                                    <div className="modal-body p-4">
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Nom de la galerie</label>
                                                <input type="text" className="form-control admin-input" value={data.title} onChange={e => setData('title', e.target.value)} placeholder="Ex: Mariage Julie & Tom" required />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Nom du client</label>
                                                <input type="text" className="form-control admin-input" value={data.client_name} onChange={e => setData('client_name', e.target.value)} placeholder="Ex: Julie Martin" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Mot de passe client</label>
                                                <input type="text" className="form-control admin-input" value={data.password} onChange={e => setData('password', e.target.value)} required />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Date de l'événement</label>
                                                <input type="date" className="form-control admin-input" value={data.event_date} onChange={e => setData('event_date', e.target.value)} />
                                            </div>
                                            <div className="col-12 mt-4">
                                                <label className="upload-zone-styled p-5 text-center d-block rounded-4">
                                                    <input 
                                                        type="file" 
                                                        multiple 
                                                        className="d-none" 
                                                        onChange={e => setData('images', e.target.files ? Array.from(e.target.files) : [])} 
                                                    />
                                                    <UploadCloud size={40} className="text-purple mb-2" />
                                                    <h6 className="fw-bold mb-0">
                                                        {data.images.length > 0 ? `${data.images.length} photos sélectionnées` : "Glissez vos photos ici ou cliquez pour parcourir"}
                                                    </h6>
                                                </label>
                                            </div>
                                        </div>

                                        {/* BARRE DE PROGRESSION */}
                                        {progress && (
                                            <div className="mt-4">
                                                <div className="progress" style={{ height: '10px' }}>
                                                    <div className="progress-bar bg-purple" role="progressbar" style={{ width: `${progress.percentage}%` }}></div>
                                                </div>
                                                <p className="text-center small mt-2 text-purple fw-bold">Transfert vers S3 : {progress.percentage}%</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="modal-footer border-0 p-4">
                                        <button type="button" className="btn btn-light px-4" onClick={() => setShowModal(false)}>Annuler</button>
                                        <button type="submit" className="btn btn-admin-action px-5" disabled={processing}>
                                            {processing ? 'Envoi en cours...' : 'Créer et uploader'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}