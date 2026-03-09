import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Trash2, Upload, ImageIcon, PlusCircle, Edit, XCircle, CheckCircle } from 'lucide-react';
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

    // --- FORMULAIRE D'AJOUT MASSIF (Le nouveau style) ---
    const { data, setData, post, processing, reset, errors, progress } = useForm({
        category_id: '',
        images: [] as File[], // On passe en tableau pour l'upload groupé
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
                alert('Toutes les images ont été traitées et publiées !');
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Supprimer définitivement cette œuvre de S3 et de la base ?')) {
            router.delete(route('admin.portfolio.destroy', id));
        }
    };

    const openEdit = (img: any) => {
        setEditingImage(img);
        setEditData({
            title: img.title || '',
            category_id: img.category_id.toString(),
            tag_ids: img.tags.map((t: any) => t.id),
        });
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('admin.portfolio.update', editingImage.id), {
            onSuccess: () => setEditingImage(null),
        });
    };

    // Pour afficher le nom de la galerie choisie dans la file d'attente
    const selectedCategory = categories.find(c => c.id.toString() === data.category_id);

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Admin | Portfolio Public" />

            <div className="container-fluid py-4">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h1 className="admin-title-cursive display-5 text-purple mb-0">Portfolio Public</h1>
                        <p className="text-muted italic">Gestion des galeries et protection par filigrane automatique.</p>
                    </div>
                </div>

                {/* --- ZONE D'UPLOAD MASSIF --- */}
                <div className="row g-4 mb-5">
                    
                    {/* BOITE D'UPLOAD (DROPZONE) */}
                    <div className="col-lg-7">
                        <div className="card border-dashed border-2 rounded-4 h-100 position-relative group transition-all" 
                             style={{ minHeight: '320px', backgroundColor: '#fcfcfd', borderColor: '#d1d5db' }}>
                            
                            <input 
                                type="file" 
                                multiple 
                                className="position-absolute w-100 h-100 top-0 start-0 opacity-0 cursor-pointer"
                                style={{ zIndex: 10 }}
                                onChange={e => setData('images', Array.from(e.target.files || []))}
                            />

                            <div className="card-body d-flex flex-column align-items-center justify-content-center text-center py-5">
                                <div className="bg-purple-light rounded-circle p-4 mb-4 group-hover-scale transition-all">
                                    <Upload size={48} className="text-purple" />
                                </div>
                                
                                <button type="button" className="btn btn-purple rounded-pill px-5 py-3 fw-bold shadow-sm d-flex align-items-center gap-2 mb-3">
                                    <PlusCircle size={20} />
                                    Uploadez les photos
                                </button>
                                
                                <p className="text-muted small mb-0">Glissez-déposez vos fichiers ici</p>
                                <p className="text-xs text-muted mt-1">(JPG, PNG max 10Mo par photo)</p>

                                {progress && (
                                    <div className="position-absolute bottom-0 start-0 w-100 p-3">
                                        <div className="progress rounded-pill shadow-sm" style={{ height: '8px' }}>
                                            <div className="progress-bar bg-purple progress-bar-striped progress-bar-animated" 
                                                 style={{ width: `${progress.percentage}%` }}></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* CONFIGURATION & FILE D'ATTENTE */}
                    <div className="col-lg-5">
                        <div className="card border-0 shadow-sm rounded-4 h-100 bg-white p-4 d-flex flex-column">
                            <h6 className="fw-bold text-purple mb-3 d-flex align-items-center justify-content-between">
                                <span><ImageIcon size={18} className="me-2" /> File d'attente ({data.images.length})</span>
                                {selectedCategory && (
                                    <span className="badge bg-purple-soft text-purple rounded-pill px-2 py-1">
                                        {selectedCategory.name}
                                    </span>
                                )}
                            </h6>
                            
                            <div className="flex-grow-1 overflow-auto mb-4 custom-scrollbar" style={{ maxHeight: '160px' }}>
                                {data.images.length > 0 ? (
                                    data.images.map((file, idx) => (
                                        <div key={idx} className="d-flex align-items-center justify-content-between p-2 mb-2 bg-light rounded-3 border-start border-purple border-3">
                                            <span className="small text-truncate w-75">{file.name}</span>
                                            <XCircle size={14} className="text-danger cursor-pointer" onClick={() => setData('images', data.images.filter((_, i) => i !== idx))} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-muted small italic border rounded-3 bg-light">
                                        Aucun fichier sélectionné...
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted">Galerie de destination</label>
                                <select 
                                    className={`form-select border-0 bg-light rounded-3 py-2 shadow-sm ${errors.category_id ? 'is-invalid' : ''}`} 
                                    value={data.category_id} 
                                    onChange={e => setData('category_id', e.target.value)}
                                >
                                    <option value="">Sélectionner une galerie...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <div className="invalid-feedback">{errors.category_id}</div>}
                            </div>

                            <button 
                                onClick={submit} 
                                disabled={processing || data.images.length === 0 || !data.category_id} 
                                className="btn btn-purple w-100 rounded-pill py-3 fw-bold shadow-sm hover-scale transition-all d-flex align-items-center justify-content-center gap-2"
                            >
                                {processing ? (
                                    <>Envoi en cours...</>
                                ) : (
                                    <><CheckCircle size={18} /> PUBLIER SUR LE PORTFOLIO</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- SELECTION DES TAGS (SOUS LES BLOCS) --- */}
                <div className="card border-0 shadow-sm rounded-4 mb-5 bg-white">
                    <div className="card-body p-4 text-center">
                        <label className="form-label d-block small fw-bold text-muted mb-3 text-uppercase tracking-widest">Appliquer des Univers (Tags)</label>
                        <div className="d-flex flex-wrap justify-content-center gap-2">
                            {tags.map(tag => (
                                <button 
                                    key={tag.id} 
                                    type="button" 
                                    onClick={() => {
                                        const id = tag.id;
                                        setData('tag_ids', data.tag_ids.includes(id) ? data.tag_ids.filter(t => t !== id) : [...data.tag_ids, id]);
                                    }} 
                                    className={`btn btn-sm rounded-pill px-4 py-2 transition-all ${data.tag_ids.includes(tag.id) ? 'btn-purple scale-105 shadow' : 'btn-outline-purple'}`}
                                >
                                    {tag.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- GRILLE MASONRY --- */}
                <h5 className="fw-bold text-purple mb-4 d-flex align-items-center">
                    <ImageIcon size={22} className="me-2" /> Galerie Publique Actuelle
                </h5>
                <div className="masonry-container">
                    {images.map((img) => (
                        <div key={img.id} className="masonry-brick">
                            <div className="portfolio-img-card shadow-sm position-relative overflow-hidden rounded-4 group">
                                <img src={img.full_url} className="img-fluid" alt={img.title} />
                                <div className="position-absolute top-0 end-0 m-2 d-flex gap-2" style={{ zIndex: 10 }}>
                                    <button type="button" onClick={() => openEdit(img)} className="btn btn-white btn-sm rounded-circle shadow-sm d-flex align-items-center justify-content-center hover-scale" style={{ width: '35px', height: '35px', border: 'none' }}>
                                        <Edit size={16} className="text-purple" />
                                    </button>
                                    <button type="button" onClick={() => handleDelete(img.id)} className="btn btn-danger btn-sm rounded-circle shadow-sm d-flex align-items-center justify-content-center hover-scale" style={{ width: '35px', height: '35px', border: 'none' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="p-3 bg-white border-top small">
                                    <div className="fw-bold text-purple truncate mb-1">{img.category?.name}</div>
                                    <div className="d-flex flex-wrap gap-1">
                                        {img.tags.map((t: any) => (
                                            <span key={t.id} className="badge bg-light text-muted fw-normal rounded-pill">#{t.name}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- MODALE DE MODIFICATION --- */}
            {editingImage && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="modal-header bg-light border-0 p-4">
                                <h5 className="modal-title fw-bold text-purple">Modifier l'œuvre</h5>
                                <button type="button" className="btn-close" onClick={() => setEditingImage(null)}></button>
                            </div>
                            <form onSubmit={handleUpdate}>
                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Titre de l'image</label>
                                        <input type="text" className="form-control border-0 bg-light" value={editData.title} onChange={e => setEditData('title', e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Changer la Catégorie</label>
                                        <select className="form-select border-0 bg-light" value={editData.category_id} onChange={e => setEditData('category_id', e.target.value)}>
                                            <option value="">Choisir...</option>
                                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label small fw-bold d-block mb-3 text-muted">Ajuster les Tags</label>
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
                                <div className="modal-footer border-0 p-4 bg-light">
                                    <button type="button" className="btn btn-white rounded-pill px-4" onClick={() => setEditingImage(null)}>Annuler</button>
                                    <button type="submit" className="btn btn-purple rounded-pill px-4 shadow-sm" disabled={editProcessing}>
                                        {editProcessing ? 'Enregistrement...' : 'Sauvegarder'}
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