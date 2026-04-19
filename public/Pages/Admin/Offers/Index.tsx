import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Plus, Trash2, Tag, Hash, AlignLeft, Euro } from 'lucide-react';
// @ts-ignore
import { route } from 'ziggy-js';

interface Offer {
    id: number;
    name: string;
    quota: number;
    description: string;
    price: number;
}

interface Props {
    auth: any;
    offers: Offer[];
}

export default function Index({ auth, offers }: Props) {
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, reset, processing, errors } = useForm({
        name: '',
        quota: 10,
        description: '',
        price: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.offers.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const deleteOffer = (id: number) => {
        if (confirm('Supprimer cette offre ? Cela ne supprimera pas les galeries liées.')) {
            router.delete(route('admin.offers.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Gestion des Offres" />

            <div className="admin-offers-page py-4">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h1 className="admin-title-cursive h2 text-purple mb-1">Mes Offres & Tarifs</h1>
                        <p className="text-muted small">Définissez vos packs et quotas de photos incluses</p>
                    </div>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="btn btn-admin-action d-flex align-items-center px-4"
                    >
                        <Plus size={20} className="me-2" /> Créer une offre
                    </button>
                </div>

                <div className="row g-4">
                    {offers.map((offer) => (
                        <div key={offer.id} className="col-md-6 col-lg-4">
                            <div className="card admin-card border-0 shadow-sm h-100 overflow-hidden">
                                <div className="card-header bg-purple text-white p-3 border-0 d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0 fw-bold">{offer.name}</h5>
                                    <button onClick={() => deleteOffer(offer.id)} className="btn btn-link text-white p-0 opacity-75 hover-opacity-100">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-purple-light p-2 rounded me-3 text-purple">
                                            <Hash size={20} />
                                        </div>
                                        <div>
                                            <div className="small text-muted">Quota inclus</div>
                                            <div className="fw-bold">{offer.quota} photos</div>
                                        </div>
                                    </div>
                                    {offer.price && (
                                        <div className="d-flex align-items-center mb-3">
                                            <div className="bg-purple-light p-2 rounded me-3 text-purple">
                                                <Euro size={20} />
                                            </div>
                                            <div>
                                                <div className="small text-muted">Tarif indicatif</div>
                                                <div className="fw-bold">{offer.price} €</div>
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-muted small mt-3 mb-0 border-top pt-3">
                                        {offer.description || 'Aucune description.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {offers.length === 0 && (
                        <div className="text-center py-5 text-muted">
                            <Tag size={48} className="mb-3 opacity-25" />
                            <p>Vous n'avez pas encore créé d'offres.</p>
                        </div>
                    )}
                </div>

                {/* MODAL DE CRÉATION */}
                {showModal && (
                    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 rounded-4">
                                <form onSubmit={submit}>
                                    <div className="modal-header border-0 p-4">
                                        <h5 className="modal-title fw-bold">Nouvelle Offre</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                                    </div>
                                    <div className="modal-body p-4 pt-0">
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold">Nom de l'offre</label>
                                            <input 
                                                type="text" 
                                                className="form-control admin-input" 
                                                value={data.name} 
                                                onChange={e => setData('name', e.target.value)} 
                                                placeholder="Ex: Pack Mariage Prestige"
                                                required 
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="col-6 mb-3">
                                                <label className="form-label small fw-bold">Quota photos</label>
                                                <input 
                                                    type="number" 
                                                    className="form-control admin-input" 
                                                    value={data.quota} 
                                                    onChange={e => setData('quota', parseInt(e.target.value))} 
                                                    required 
                                                />
                                            </div>
                                            <div className="col-6 mb-3">
                                                <label className="form-label small fw-bold">Prix (€)</label>
                                                <input 
                                                    type="number" 
                                                    className="form-control admin-input" 
                                                    value={data.price} 
                                                    onChange={e => setData('price', e.target.value)} 
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold">Description</label>
                                            <textarea 
                                                className="form-control admin-input" 
                                                rows={3}
                                                value={data.description} 
                                                onChange={e => setData('description', e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="modal-footer border-0 p-4">
                                        <button type="button" className="btn btn-light px-4" onClick={() => setShowModal(false)}>Annuler</button>
                                        <button type="submit" className="btn btn-admin-action px-5" disabled={processing}>
                                            Enregistrer
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