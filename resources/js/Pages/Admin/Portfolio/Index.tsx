import React, { useState, useMemo } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Trash2, Upload, Edit, Loader2, CheckCircle, Filter, Tag as TagIcon } from 'lucide-react';
import axios from 'axios';
// @ts-ignore
import { route } from 'ziggy-js';

interface Props {
    images: any[];
    categories: any[];
    tags: any[];
    auth: any;
}

export default function Index({ images, categories, tags, auth }: Props) {
    // ÉTATS UI
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
    const [filterTagId, setFilterTagId] = useState<number | null>(null);
    const [editingImage, setEditingImage] = useState<any>(null);

    // FORMULAIRE UPLOAD
    const { data, setData, reset } = useForm({
        category_id: '',
        images: [] as File[],
        tag_ids: [] as number[],
    });

    // FORMULAIRE ÉDITION
    const { data: editData, setData: setEditData, patch, processing: editProcessing } = useForm({
        title: '',
        category_id: '',
        tag_ids: [] as number[],
    });

    // LOGIQUE MÉTIER : Est-ce de la photographie ?
    const selectedCat = categories.find(c => c.id.toString() === data.category_id);
    const isPhotography = selectedCat?.name.toLowerCase().includes('photographie');

    // LOGIQUE DE FILTRAGE DYNAMIQUE
    const filteredImages = useMemo(() => {
        if (!filterTagId) return images;
        return images.filter(img => img.tags?.some((t: any) => t.id === filterTagId));
    }, [images, filterTagId]);

    // UPLOAD
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (data.images.length === 0 || !data.category_id) return;

        setUploadStatus('uploading');
        const filesToProcess = [...data.images];

        for (const file of filesToProcess) {
            const formData = new FormData();
            formData.append('images[]', file);
            formData.append('category_id', data.category_id);
            
            // On ajoute les tags sélectionnés à l'envoi
            data.tag_ids.forEach(id => formData.append('tag_ids[]', id.toString()));

            try {
                await axios.post(route('admin.portfolio.store'), formData, {
                    headers: { 'Accept': 'application/json' }
                });
            } catch (err) {
                console.error("Erreur sur :", file.name, err);
            }
        }

        setUploadStatus('success');

        setTimeout(() => {
            setUploadStatus('idle');
            reset('images', 'tag_ids');
            router.reload({ only: ['images'], preserveScroll: true });
        }, 2000);
    };

    const toggleTag = (id: number) => {
        setData('tag_ids', data.tag_ids.includes(id) 
            ? data.tag_ids.filter(t => t !== id) 
            : [...data.tag_ids, id]
        );
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Admin | Portfolio" />

            <div className="container py-5">
                <h1 className="admin-title-cursive display-5 text-center mb-5">Gestion Portfolio</h1>

                <div className="row g-4 mb-5">
                    {/* DROPZONE */}
                    <div className="col-lg-7">
                        <div className="card h-100 upload-zone-styled border-2 border-dashed">
                            <div className="card-body zone-content d-flex flex-column align-items-center justify-content-center py-5 position-relative">
                                <input 
                                    type="file" multiple className="position-absolute w-100 h-100 opacity-0 cursor-pointer" 
                                    onChange={e => setData('images', Array.from(e.target.files || []))}
                                    disabled={uploadStatus !== 'idle'}
                                />
                                <Upload size={48} className="text-purple mb-3" />
                                <h5 className="text-muted">Ajouter des visuels ({data.images.length})</h5>
                            </div>
                        </div>
                    </div>

                    {/* ACTIONS & ANIMATION */}
                    <div className="col-lg-5">
                        <div className="card h-100 admin-card shadow-sm p-4 border-0">
                            {uploadStatus === 'idle' ? (
                                <>
                                    <select className="form-select mb-3 admin-input" value={data.category_id} onChange={e => setData('category_id', e.target.value)}>
                                        <option value="">Sélectionner le métier...</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>

                                    {/* LOGIQUE DES TAGS LORS DE L'UPLOAD */}
                                    {isPhotography && (
                                        <div className="mb-3">
                                            <p className="small fw-bold text-muted mb-2 text-uppercase text-center">Appliquer des Univers</p>
                                            <div className="d-flex flex-wrap justify-content-center gap-1">
                                                {tags.map(tag => (
                                                    <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}
                                                        className={`btn btn-sm ${data.tag_ids.includes(tag.id) ? 'btn-purple' : 'btn-outline-purple'}`}>
                                                        {tag.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <button onClick={submit} disabled={data.images.length === 0 || !data.category_id} className="btn btn-admin-action w-100 py-3 fw-bold">
                                        LANCER LA PUBLICATION
                                    </button>
                                </>
                            ) : (
                                <div className="h-100 d-flex flex-column align-items-center justify-content-center py-4">
                                    {uploadStatus === 'uploading' ? (
                                        <>
                                            <Loader2 size={60} className="text-purple animate-spin mb-3" />
                                            <p className="fw-bold text-purple">Traitement et filigrane...</p>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={60} className="text-success mb-3" />
                                            <p className="fw-bold text-success">Publication réussie !</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* LOGIQUE DE FILTRAGE (AU-DESSUS DE LA GRILLE) */}
                <div className="d-flex flex-wrap justify-content-center mb-5 gap-2 border-top border-bottom py-3">
                    <button onClick={() => setFilterTagId(null)} className={`btn-filter-custom ${!filterTagId ? 'active' : ''}`}>Tout voir</button>
                    {tags.map(tag => (
                        <button key={tag.id} onClick={() => setFilterTagId(tag.id)} className={`btn-filter-custom ${filterTagId === tag.id ? 'active' : ''}`}>
                            {tag.name}
                        </button>
                    ))}
                </div>

                {/* GRILLE MASONRY */}
                <div className="masonry-container">
                    {filteredImages.map((img: any) => (
                        <div key={img.id} className="masonry-brick">
                            <div className="portfolio-img-card rounded-4 position-relative overflow-hidden shadow-sm">
                                <img src={img.full_url} className="w-100 h-auto" alt="" />
                                <div className="photo-overlay d-flex align-items-center justify-content-center gap-2">
                                    <button onClick={() => {
                                        setEditingImage(img);
                                        setEditData({ title: img.title || '', category_id: img.category_id.toString(), tag_ids: img.tags?.map((t:any) => t.id) || [] });
                                    }} className="btn btn-light btn-sm rounded-circle p-2">
                                        <Edit size={18} className="text-purple" />
                                    </button>
                                    <button onClick={() => router.delete(route('admin.portfolio.destroy', img.id), { preserveScroll: true })} className="btn btn-danger btn-sm rounded-circle p-2">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2 text-center p-2">
                                <span className="small italic text-purple fw-bold">{img.category?.name}</span>
                                <div className="d-flex flex-wrap justify-content-center gap-1 mt-1">
                                    {img.tags?.map((t: any) => (
                                        <span key={t.id} className="text-muted" style={{ fontSize: '10px' }}>#{t.name}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODALE ÉDITION */}
            {editingImage && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 p-4 shadow-lg">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold text-purple">Modifier l'œuvre</h5>
                                <button type="button" className="btn-close" onClick={() => setEditingImage(null)}></button>
                            </div>
                            <div className="modal-body pt-4">
                                <input type="text" className="form-control admin-input mb-3" value={editData.title} onChange={e => setEditData('title', e.target.value)} placeholder="Titre..." />
                                <select className="form-select admin-input mb-3" value={editData.category_id} onChange={e => setEditData('category_id', e.target.value)}>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                                
                                <p className="small fw-bold text-muted mb-2 text-uppercase">Univers</p>
                                <div className="d-flex flex-wrap gap-1 mb-4">
                                    {tags.map(tag => (
                                        <button key={tag.id} type="button" 
                                            onClick={() => setEditData('tag_ids', editData.tag_ids.includes(tag.id) ? editData.tag_ids.filter(t => t !== tag.id) : [...editData.tag_ids, tag.id])}
                                            className={`btn btn-sm ${editData.tag_ids.includes(tag.id) ? 'btn-purple' : 'btn-outline-purple'}`}>
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>

                                <button onClick={(e) => { e.preventDefault(); patch(route('admin.portfolio.update', editingImage.id), { onSuccess: () => setEditingImage(null), preserveScroll: true }); }} className="btn btn-admin-action w-100 py-3 fw-bold">
                                    {editProcessing ? 'ENREGISTREMENT...' : 'SAUVEGARDER'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}