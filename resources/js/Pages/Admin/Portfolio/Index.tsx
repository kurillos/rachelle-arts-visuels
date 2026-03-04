import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Trash2, Upload, ImageIcon, PlusCircle, Edit } from 'lucide-react';
// @ts-ignore
import { route } from 'ziggy-js';

interface Props {
    images: any[];
    categories: any[];
    tags: any[];
    auth: any;
}

export default function Index({ images, categories, tags, auth }: Props) {
    // --- ÉTATS ---
    const [editingImage, setEditingImage] = useState<any>(null);

    // --- FORMULAIRE D'AJOUT ---
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        category_id: '',
        image: null as File | null,
        tag_ids: [] as number[],
    });

    // --- FORMULAIRE DE MODIFICATION ---
    const { data: editData, setData: setEditData, patch, processing: editProcessing } = useForm({
        title: '',
        category_id: '',
        tag_ids: [] as number[],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.portfolio.store'), {
            onSuccess: () => {
                reset();
                alert('Image publiée avec succès !');
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Supprimer définitivement cette image de S3 ?')) {
            router.delete(route('admin.portfolio.destroy', id));
        }
    };

    const openEdit = (img: any) => {
        setEditingImage(img);
        setEditData({
            title: img.title || '',
            category_id: img.category_id.toString(), // On force en string pour le select
            tag_ids: img.tags.map((t: any) => t.id),
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('admin.portfolio.update', editingImage.id), {
            onSuccess: () => setEditingImage(null),
        });
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Admin | Portfolio Public" />

            <div className="container-fluid">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h1 className="admin-title-cursive display-5 text-purple mb-0">Portfolio Public</h1>
                        <p className="text-muted">Gérez les images visibles sur la galerie principale.</p>
                    </div>
                </div>

                {/* FORMULAIRE D'AJOUT */}
                <div className="card shadow-sm border-0 rounded-4 mb-5">
                    <div className="card-body p-4">
                        <h5 className="card-title fw-bold text-purple mb-4 d-flex align-items-center">
                            <PlusCircle size={20} className="me-2" /> Ajouter une œuvre sur S3
                        </h5>
                        <form onSubmit={submit} className="row g-3">
                            <div className="col-lg-4 col-md-6">
                                <label className="form-label small fw-bold">Image</label>
                                <input type="file" className={`form-control ${errors.image ? 'is-invalid' : ''}`} onChange={e => setData('image', e.target.files?.[0] || null)} />
                                {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <label className="form-label small fw-bold">Catégorie</label>
                                <select className="form-select" value={data.category_id} onChange={e => setData('category_id', e.target.value)}>
                                    <option value="">Sélectionner...</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div className="col-lg-3 col-md-12">
                                <label className="form-label small fw-bold">Titre (Optionnel)</label>
                                <input type="text" className="form-control" value={data.title} onChange={e => setData('title', e.target.value)} />
                            </div>
                            <div className="col-lg-2 col-md-12 d-flex align-items-end">
                                <button type="submit" disabled={processing} className="btn btn-purple w-100 rounded-pill py-2">
                                    {processing ? 'Envoi...' : 'Publier'}
                                </button>
                            </div>
                            <div className="col-12 mt-3">
                                <div className="d-flex flex-wrap gap-2">
                                    {tags.map(tag => (
                                        <button key={tag.id} type="button" onClick={() => {
                                            const id = tag.id;
                                            setData('tag_ids', data.tag_ids.includes(id) ? data.tag_ids.filter(t => t !== id) : [...data.tag_ids, id]);
                                        }} className={`btn btn-sm rounded-pill px-3 ${data.tag_ids.includes(tag.id) ? 'btn-purple' : 'btn-outline-purple'}`}>
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* GRILLE MASONRY */}
                <div className="masonry-container">
                    {images.map((img) => (
                        <div key={img.id} className="masonry-brick">
                            <div className="portfolio-img-card shadow-sm position-relative group">
                                <img src={img.full_url} className="img-fluid" alt={img.title} />
                                <div className="position-absolute top-0 end-0 m-2 d-flex gap-2" style={{ zIndex: 10 }}>
                                    <button type="button" onClick={() => openEdit(img)} className="btn btn-white btn-sm rounded-circle shadow-sm d-flex align-items-center justify-content-center hover-scale" style={{ width: '32px', height: '32px', backgroundColor: 'white', border: 'none' }}>
                                        <Edit size={16} className="text-purple" />
                                    </button>
                                    <button type="button" onClick={() => handleDelete(img.id)} className="btn btn-danger btn-sm rounded-circle shadow-sm d-flex align-items-center justify-content-center hover-scale" style={{ width: '32px', height: '32px', border: 'none' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="p-2 bg-white border-top small">
                                    <div className="fw-bold text-purple truncate">{img.category?.name}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- BLOC MODALE DE MODIFICATION --- */}
            {editingImage && (
                <div className="modal show d-block shadow-lg" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div className="modal-header bg-light border-0 p-4">
                                <h5 className="modal-title fw-bold text-purple">Modifier l'œuvre</h5>
                                <button type="button" className="btn-close" onClick={() => setEditingImage(null)}></button>
                            </div>
                            <form onSubmit={handleUpdate}>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Catégorie (Métier)</label>
                                        <select className="form-select" value={editData.category_id} onChange={e => setEditData('category_id', e.target.value)}>
                                            <option value="">Choisir...</option>
                                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Titre</label>
                                        <input type="text" className="form-control" value={editData.title} onChange={e => setEditData('title', e.target.value)} />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small fw-bold d-block mb-2 text-muted">Univers (Tags)</label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {tags.map(tag => (
                                                <button key={tag.id} type="button" onClick={() => {
                                                    const id = tag.id;
                                                    setEditData('tag_ids', editData.tag_ids.includes(id) ? editData.tag_ids.filter(t => t !== id) : [...editData.tag_ids, id]);
                                                }} className={`btn btn-sm rounded-pill px-3 transition-all ${editData.tag_ids.includes(tag.id) ? 'btn-purple' : 'btn-outline-purple'}`}>
                                                    {tag.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer border-0 p-4">
                                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setEditingImage(null)}>Annuler</button>
                                    <button type="submit" className="btn btn-purple rounded-pill px-4 shadow-sm" disabled={editProcessing}>
                                        {editProcessing ? 'Enregistrement...' : 'Mettre à jour'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}