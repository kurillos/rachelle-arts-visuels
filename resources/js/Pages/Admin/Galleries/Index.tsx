import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Plus, 
    Trash2, 
    Eye, 
    Calendar, 
    Lock, 
    UploadCloud,
    Image as ImageIcon,
    Mail,
    Tag,
    Clock
} from 'lucide-react';
// @ts-ignore
import { route } from 'ziggy-js';

interface Offer {
    id: number;
    name: string;
    quota: number;
}

interface Gallery {
    id: number;
    title: string;
    client_name: string;
    client_email: string;
    slug: string;
    type: string;
    password: string;
    event_date: string;
    photos_count: number;
    status: string;
    offer?: Offer;
}

interface Props {
    auth: any;
    galleries: Gallery[];
    offers: Offer[];
    currentType: string;
}

export default function Index({ auth, galleries, offers, currentType }: Props) {
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, progress, reset, errors } = useForm({
        title: '',
        client_name: '',
        client_email: '',
        offer_id: '',
        quota: 0,
        type: currentType,
        password: Math.random().toString(36).slice(-6), 
        event_date: '',
        images: [] as File[],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.galleries.store'), {
            onBefore: () => { data.type = currentType },
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    // Helper pour les badges de status
    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            'brouillon': 'bg-secondary-light text-secondary',
            'envoyé': 'bg-info-light text-info',
            'ouvert': 'bg-warning-light text-warning',
            'sélectionnée': 'bg-purple-light text-purple',
            'terminée': 'bg-success-light text-success',
        };
        return styles[status] || 'bg-light text-dark';
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`Gestion ${currentType}s`} />

            <div className="admin-galleries-page">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h1 className="admin-title-cursive h2 text-purple mb-1">
                            Mes {currentType === 'mariage' ? 'Mariages' : 'Shootings'}
                        </h1>
                        <p className="text-muted small">Gérez les accès privés et les sélections clients</p>
                    </div>
                    <button onClick={() => setShowModal(true)} className="btn btn-admin-action d-flex align-items-center px-4">
                        <Plus size={20} className="me-2" /> Créer une galerie
                    </button>
                </div>

                <div className="row g-4">
                    {galleries.map((gallery) => (
                        <div key={gallery.id} className="col-md-6 col-xl-4">
                            <div className="card admin-card border-0 shadow-sm h-100">
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="bg-purple-light p-3 rounded-3 text-purple d-flex align-items-center gap-2">
                                            <ImageIcon size={24} />
                                            {gallery.offer && <span className="small fw-bold">[{gallery.offer.name}]</span>}
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                             <span className={`badge ${getStatusBadge(gallery.status || 'brouillon')} text-uppercase`} style={{fontSize: '10px'}}>
                                                {gallery.status || 'Brouillon'}
                                            </span>
                                            <div className="dropdown">
                                                <button className="btn btn-link text-muted p-0" type="button" data-bs-toggle="dropdown">
                                                    <Trash2 size={18} className="text-danger" />
                                                </button>
                                                <ul className="dropdown-menu shadow border-0">
                                                    <li>
                                                        <Link href={route('admin.galleries.destroy', gallery.id)} method="delete" as="button" className="dropdown-item text-danger" onClick={(e) => !confirm('Supprimer cette galerie ?') && e.preventDefault()}>
                                                            Confirmer la suppression
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <h5 className="fw-bold mb-1">{gallery.title}</h5>
                                    <p className="text-muted small mb-0">Client: {gallery.client_name || 'Non spécifié'}</p>
                                    <p className="small mb-3">
                                        <Mail size={12} className="me-1 text-purple" />
                                        <span className="text-purple fw-medium italic">{gallery.client_email || 'Email non renseigné'}</span>
                                    </p>
                                    
                                    <div className="d-flex gap-3 mb-4">
                                        <div className="small d-flex align-items-center text-muted text-nowrap">
                                            <Calendar size={14} className="me-1" /> {gallery.event_date || 'N/A'}
                                        </div>
                                        <div className="small d-flex align-items-center text-muted">
                                            <ImageIcon size={14} className="me-1" /> {gallery.photos_count} photos
                                        </div>
                                        <div className="small d-flex align-items-center text-purple fw-bold">
                                            <Tag size={14} className="me-1" /> Quota: {gallery.offer?.quota || '0'}
                                        </div>
                                    </div>

                                    <div className="d-grid gap-2 mb-2">
                                        <button 
                                            onClick={() => confirm(`Envoyer l'invitation à ${gallery.client_email} ?`) && router.post(route('admin.galleries.send', gallery.id))}
                                            disabled={!gallery.client_email}
                                            className="btn btn-purple btn-sm py-2"
                                        >
                                            <Mail size={16} className="me-2" /> Envoyer l'accès
                                        </button>
                                    </div>

                                    <div className="d-grid gap-2">
                                        <Link href={route('admin.galleries.show', gallery.id)} className="btn btn-outline-purple btn-sm py-2">
                                            <Eye size={16} className="me-2" /> Gérer & Voir la sélection
                                        </Link>
                                    </div>
                                </div>
                                <div className="card-footer bg-light border-0 py-3 px-4 d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center text-purple small fw-bold">
                                        <Lock size={14} className="me-1" /> {gallery.password}
                                    </div>
                                    <div className="small text-muted d-flex align-items-center">
                                        <Clock size={12} className="me-1" /> Expire le: 15/04/26
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* MODAL DE CRÉATION */}
                {showModal && (
                    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content border-0 rounded-4 shadow-lg">
                                <form onSubmit={submit}>
                                    <div className="modal-header border-0 p-4 pb-0">
                                        <h5 className="modal-title fw-bold">Nouvelle Galerie Privée ({currentType})</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                    </div>
                                    <div className="modal-body p-4">
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Nom de la galerie</label>
                                                <input type="text" className="form-control admin-input" value={data.title} onChange={e => setData('title', e.target.value)} required />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-purple">Choisir l'offre / forfait</label>
                                                <select 
                                                    className="form-control admin-input border-purple"
                                                    value={data.offer_id}
                                                    onChange={(e) => {
                                                        const offer = offers.find(o => o.id === parseInt(e.target.value));
                                                        setData({
                                                            ...data,
                                                            offer_id: e.target.value,
                                                            quota: offer ? offer.quota : 0
                                                        });
                                                    }}
                                                    required
                                                >
                                                    <option value="">-- Sélectionner --</option>
                                                    {offers.map(o => <option key={o.id} value={o.id}>{o.name} ({o.quota} photos)</option>)}
                                                </select>
                                                {errors.offer_id && <div className="text-danger small">{errors.offer_id}</div>}
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Nom du client</label>
                                                <input type="text" className="form-control admin-input" value={data.client_name} onChange={e => setData('client_name', e.target.value)} />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Email du client</label>
                                                <input type="email" className="form-control admin-input" value={data.client_email} onChange={e => setData('client_email', e.target.value)} />
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
                                                <label className="upload-zone-styled p-5 text-center d-block rounded-4 pointer">
                                                    <input type="file" multiple className="d-none" onChange={e => setData('images', Array.from(e.target.files || []))} />
                                                    <UploadCloud size={40} className="text-purple mb-2" />
                                                    <h6 className="fw-bold mb-0">
                                                        {data.images.length > 0 ? `${data.images.length} photos sélectionnées` : "Uploader les photos"}
                                                    </h6>
                                                </label>
                                            </div>
                                        </div>

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
                                            {processing ? 'Envoi...' : 'Créer la galerie'}
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