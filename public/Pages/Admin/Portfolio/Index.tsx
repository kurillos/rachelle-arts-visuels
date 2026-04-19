import React, { useState, useMemo } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Trash2, Upload, Edit, Loader2, CheckCircle, Filter, Tag as TagIcon, LayoutGrid } from 'lucide-react';
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
    // --- ÉTATS UI & FILTRAGE ---
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
    const [filterCatId, setFilterCatId] = useState<number | null>(null);
    const [filterTagId, setFilterTagId] = useState<number | null>(null);
    const [editingImage, setEditingImage] = useState<any>(null);

    // --- FORMULAIRES ---
    const { data, setData, reset } = useForm({
        category_id: '',
        images: [] as File[],
        tag_ids: [] as number[],
    });

    const { data: editData, setData: setEditData, patch, processing: editProcessing } = useForm({
        title: '',
        category_id: '',
        tag_ids: [] as number[],
    });

    // --- LOGIQUE MÉTIER ---
    const isPhotography = categories.find(c => c.id.toString() === data.category_id)?.name.toLowerCase().includes('photographie');
    const isFilteringPhotography = categories.find(c => c.id === filterCatId)?.name.toLowerCase().includes('photographie');

    // --- DOUBLE FILTRAGE DYNAMIQUE (MÉTIER + UNIVERS) ---
    const filteredImages = useMemo(() => {
        return images.filter(img => {
            const matchCat = filterCatId ? img.category_id === filterCatId : true;
            const matchTag = filterTagId ? img.tags?.some((t: any) => t.id === filterTagId) : true;
            return matchCat && matchTag;
        });
    }, [images, filterCatId, filterTagId]);

    // --- UPLOAD ATOMIQUE ---
    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (data.images.length === 0 || !data.category_id) return;

        setUploadStatus('uploading');
        const filesToProcess = [...data.images];

        for (const file of filesToProcess) {
            const formData = new FormData();
            formData.append('images[]', file);
            formData.append('category_id', data.category_id);
            data.tag_ids.forEach(id => formData.append('tag_ids[]', id.toString()));

            try {
                await axios.post(route('admin.portfolio.store'), formData, {
                    headers: { 'Accept': 'application/json' }
                });
            } catch (err) {
                console.error("Erreur upload:", file.name, err);
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

            <div className="container py-5 admin-portfolio-container">
                <h1 className="admin-title-cursive display-5 text-center mb-5">Console de Modération</h1>

                {/* --- SECTION UPLOAD --- */}
                <div className="row g-4 mb-5">
                    <div className="col-lg-7">
                        <div className="card h-100 upload-zone-styled border-2 border-dashed rounded-4">
                            <div className="card-body d-flex flex-column align-items-center justify-content-center py-5 position-relative">
                                <input 
                                    type="file" multiple className="position-absolute w-100 h-100 opacity-0 cursor-pointer" 
                                    onChange={e => setData('images', Array.from(e.target.files || []))}
                                    disabled={uploadStatus !== 'idle'}
                                    style={{ zIndex: 10 }}
                                />
                                <Upload size={48} className="text-purple mb-3" />
                                <h5 className="text-muted fw-bold">Ajouter des fichiers ({data.images.length})</h5>
                                <p className="small text-muted italic">Glissez-déposez vos visuels haute définition</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-5">
                        <div className="card h-100 admin-card shadow-sm p-4 border-0 rounded-4 d-flex flex-column justify-content-center">
                            {uploadStatus === 'idle' ? (
                                <>
                                    <label className="small fw-bold text-muted mb-2 uppercase">Destination</label>
                                    <select className="form-select mb-3 admin-input" value={data.category_id} onChange={e => setData('category_id', e.target.value)}>
                                        <option value="">Choisir la galerie...</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>

                                    {isPhotography && (
                                        <div className="mb-3 text-center">
                                            <label className="small fw-bold text-muted mb-2 d-block">Appliquer des Univers</label>
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
                                        PUBLIER SUR LE SITE
                                    </button>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    {uploadStatus === 'uploading' ? (
                                        <>
                                            <Loader2 size={60} className="text-purple animate-spin mb-3" />
                                            <p className="fw-bold text-purple mb-0">Traitement & Filigrane...</p>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={60} className="text-success mb-3" />
                                            <p className="fw-bold text-success mb-0">C'est en ligne !</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- DOUBLE FILTRAGE DE NAVIGATION --- */}
                <div className="bg-white p-4 rounded-4 shadow-sm mb-5 border border-light">
                    <div className="row align-items-center">
                        <div className="col-md-6 border-end text-center">
                            <span className="small fw-bold text-muted text-uppercase d-block mb-3">Filtrer par Métier</span>
                            <div className="d-flex flex-wrap justify-content-center gap-2">
                                <button onClick={() => { setFilterCatId(null); setFilterTagId(null); }} 
                                    className={`btn btn-sm px-3 ${!filterCatId ? 'btn-purple' : 'btn-outline-purple'}`}>
                                    Toutes les galeries
                                </button>
                                {categories.map(cat => (
                                    <button key={cat.id} onClick={() => { setFilterCatId(cat.id); setFilterTagId(null); }}
                                        className={`btn btn-sm px-3 ${filterCatId === cat.id ? 'btn-purple' : 'btn-outline-purple'}`}>
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="col-md-6 text-center mt-3 mt-md-0">
                            <span className="small fw-bold text-muted text-uppercase d-block mb-3">Affiner par Univers</span>
                            <div className="d-flex flex-wrap justify-content-center gap-2">
                                <button onClick={() => setFilterTagId(null)} 
                                    className={`btn btn-sm px-3 ${!filterTagId ? 'btn-purple' : 'btn-outline-secondary'}`}>
                                    Tous les univers
                                </button>
                                {(isFilteringPhotography || !filterCatId) ? tags.map(tag => (
                                    <button key={tag.id} onClick={() => setFilterTagId(tag.id)}
                                        className={`btn btn-sm px-3 ${filterTagId === tag.id ? 'btn-purple' : 'btn-outline-secondary'}`}>
                                        {tag.name}
                                    </button>
                                )) : <span className="text-muted italic small">Non applicable à cette galerie</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- GRILLE MASONRY CRUD --- */}
                <div className="masonry-container">
                    {filteredImages.length > 0 ? filteredImages.map((img: any) => (
                        <div key={img.id} className="masonry-brick">
                            <div className="portfolio-img-card rounded-4 position-relative overflow-hidden shadow-sm bg-white">
                                <img src={img.full_url} className="w-100 h-auto" alt="" />
                                <div className="photo-overlay d-flex align-items-center justify-content-center gap-2">
                                    <button onClick={() => {
                                        setEditingImage(img);
                                        setEditData({ title: img.title || '', category_id: img.category_id.toString(), tag_ids: img.tags?.map((t:any) => t.id) || [] });
                                    }} className="btn btn-light btn-sm rounded-circle p-2 shadow">
                                        <Edit size={18} className="text-purple" />
                                    </button>
                                    <button onClick={() => {
                                        if(confirm('Supprimer définitivement ce visuel ?')) 
                                            router.delete(route('admin.portfolio.destroy', img.id), { preserveScroll: true });
                                    }} className="btn btn-danger btn-sm rounded-circle p-2 shadow">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2 text-center p-2">
                                <span className="badge bg-purple-light text-purple mb-1 px-3 py-2 rounded-pill" style={{ fontSize: '11px' }}>
                                    {img.category?.name}
                                </span>
                                <div className="d-flex flex-wrap justify-content-center gap-1 mt-1">
                                    {img.tags?.map((t: any) => (
                                        <span key={t.id} className="text-muted fw-light" style={{ fontSize: '10px' }}>#{t.name}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-12 text-center py-5">
                            <LayoutGrid size={48} className="text-muted mb-3 opacity-25" />
                            <p className="text-muted italic">Aucun visuel ne correspond à ces critères dans la galerie.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODALE D'ÉDITION --- */}
            {editingImage && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1055 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow-lg p-3">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold text-purple">Édition Rapide</h5>
                                <button type="button" className="btn-close" onClick={() => setEditingImage(null)}></button>
                            </div>
                            <div className="modal-body">
                                <label className="small fw-bold text-muted mb-1">Titre de l'image</label>
                                <input type="text" className="form-control admin-input mb-3" value={editData.title} onChange={e => setEditData('title', e.target.value)} />
                                
                                <label className="small fw-bold text-muted mb-1">Galerie de destination</label>
                                <select className="form-select admin-input mb-3" value={editData.category_id} onChange={e => setEditData('category_id', e.target.value)}>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                                
                                <label className="small fw-bold text-muted mb-2 d-block">Univers associés</label>
                                <div className="d-flex flex-wrap gap-1 mb-4">
                                    {tags.map(tag => (
                                        <button key={tag.id} type="button" 
                                            onClick={() => setEditData('tag_ids', editData.tag_ids.includes(tag.id) ? editData.tag_ids.filter(t => t !== tag.id) : [...editData.tag_ids, tag.id])}
                                            className={`btn btn-sm ${editData.tag_ids.includes(tag.id) ? 'btn-purple' : 'btn-outline-purple'}`}>
                                            {tag.name}
                                        </button>
                                    ))}
                                </div>

                                <button onClick={(e) => { 
                                    e.preventDefault(); 
                                    patch(route('admin.portfolio.update', editingImage.id), { 
                                        onSuccess: () => setEditingImage(null),
                                        preserveScroll: true 
                                    }); 
                                }} className="btn btn-admin-action w-100 py-3 fw-bold">
                                    {editProcessing ? 'MISE À JOUR...' : 'ENREGISTRER LES MODIFICATIONS'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}