import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Tag, FolderTree, Plus, Trash2, Info, Pencil, X, Check } from 'lucide-react';
// @ts-ignore
import { route } from 'ziggy-js';

interface Item {
    id: number;
    name: string;
}

interface Props {
    auth: any;
    categories: Item[];
    tags: Item[];
}

export default function CategoriesTags({ auth, categories, tags }: Props) {
    const catForm = useForm({ name: '' });
    const tagForm = useForm({ name: '' });
    const editForm = useForm({ name: '' });

    const [editingItem, setEditingItem] = React.useState<{id: number, name: string, type: 'category' | 'tag'} | null>(null);

    // --- ACTIONS CLASSIQUES ---
    const submitCategory = (e: React.FormEvent) => {
        e.preventDefault();
        catForm.post(route('admin.categories.store'), { onSuccess: () => catForm.reset() });
    };

    const submitTag = (e: React.FormEvent) => {
        e.preventDefault();
        tagForm.post(route('admin.tags.store'), { onSuccess: () => tagForm.reset() });
    };

    const deleteCategory = (id: number) => {
        if (confirm('Supprimer cette catégorie ?')) router.delete(route('admin.categories.destroy', id));
    };

    const deleteTag = (id: number) => {
        if (confirm('Supprimer ce filtre ?')) router.delete(route('admin.tags.destroy', id));
    };

    // --- ACTIONS EDITION ---
    const startEdit = (item: Item, type: 'category' | 'tag') => {
        setEditingItem({ ...item, type });
        editForm.setData('name', item.name);
    };

    const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Si editingItem est null, on ne fait rien (sécurité TypeScript)
    if (!editingItem) return;

    const url = editingItem.type === 'category' 
        ? route('admin.categories.update', editingItem.id)
        : route('admin.tags.update', editingItem.id);

        editForm.patch(url, {
            onSuccess: () => setEditingItem(null),
        });
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Configuration des Galeries" />

            <div className="mb-5">
                <h1 className="admin-title-cursive display-5 text-purple">Configuration</h1>
                <p className="text-muted">Gérez vos métiers et vos univers artistiques pour les filtres publics.</p>
            </div>

            <div className="row g-4">
                {/* COLONNE CATÉGORIES */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-header bg-white border-0 pt-4 px-4 d-flex align-items-center">
                            <FolderTree className="text-purple me-2" size={24} />
                            <h3 className="h5 mb-0 fw-bold">Catégories (Métiers)</h3>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={submitCategory} className="d-flex gap-2 mb-4">
                                <input type="text" className="form-control admin-input" placeholder="ex: Graphisme..."
                                    value={catForm.data.name} onChange={e => catForm.setData('name', e.target.value)} />
                                <button className="btn btn-purple shadow-sm" disabled={catForm.processing}><Plus size={18} /></button>
                            </form>

                            <div className="list-group list-group-flush">
                                {categories.map(cat => (
                                    <div key={cat.id} className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2 border-bottom-dashed">
                                        {editingItem?.type === 'category' && editingItem.id === cat.id ? (
                                            <form onSubmit={submitEdit} className="d-flex gap-2 w-100 py-1">
                                                <input className="form-control form-control-sm" value={editForm.data.name} 
                                                    onChange={e => editForm.setData('name', e.target.value)} autoFocus />
                                                <button type="submit" className="btn btn-sm btn-success"><Check size={14}/></button>
                                                <button type="button" className="btn btn-sm btn-light" onClick={() => setEditingItem(null)}><X size={14}/></button>
                                            </form>
                                        ) : (
                                            <>
                                                <span className="fw-medium text-dark">{cat.name}</span>
                                                <div className="d-flex gap-2">
                                                    <button onClick={() => startEdit(cat, 'category')} className="btn btn-link p-0 text-muted hover-purple"><Pencil size={15}/></button>
                                                    <button onClick={() => deleteCategory(cat.id)} className="btn btn-link p-0 text-danger opacity-50 hover-opacity-100"><Trash2 size={15}/></button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLONNE TAGS */}
                <div className="col-md-6">
                    <div className="card shadow-sm rounded-4 h-100 border-start border-purple border-4">
                        <div className="card-header bg-white border-0 pt-4 px-4 d-flex align-items-center">
                            <Tag className="text-purple me-2" size={24} />
                            <h3 className="h5 mb-0 fw-bold">Filtres (Univers)</h3>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={submitTag} className="d-flex gap-2 mb-4">
                                <input type="text" className="form-control admin-input" placeholder="ex: Lueurs Sauvages..."
                                    value={tagForm.data.name} onChange={e => tagForm.setData('name', e.target.value)} />
                                <button className="btn btn-purple shadow-sm" disabled={tagForm.processing}><Plus size={18} /></button>
                            </form>

                            <div className="d-flex flex-wrap gap-2">
                                {tags.map(tag => (
                                    <div key={tag.id} className="badge bg-purple-light text-purple px-3 py-2 rounded-pill d-flex align-items-center border border-purple-subtle">
                                        {editingItem?.type === 'tag' && editingItem.id === tag.id ? (
                                            <form onSubmit={submitEdit} className="d-flex gap-1">
                                                <input className="form-control form-control-xs py-0" style={{ width: '100px', fontSize: '12px' }} 
                                                    value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} autoFocus />
                                                <button type="submit" className="btn btn-link p-0 text-success"><Check size={12}/></button>
                                                <button type="button" className="btn btn-link p-0 text-danger" onClick={() => setEditingItem(null)}><X size={12}/></button>
                                            </form>
                                        ) : (
                                            <>
                                                {tag.name}
                                                <button onClick={() => startEdit(tag, 'tag')} className="btn btn-link text-purple ms-2 p-0"><Pencil size={11}/></button>
                                                <button onClick={() => deleteTag(tag.id)} className="btn btn-link text-danger ms-1 p-0 opacity-50"><X size={12}/></button>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-4 p-3 bg-light rounded-3 d-flex align-items-start gap-3">
                <Info size={20} className="text-purple mt-1" />
                <small className="text-muted">
                    <strong>Conseil :</strong> Les catégories servent à organiser vos menus principaux, tandis que les filtres permettent à vos visiteurs d'affiner leur recherche.
                </small>
            </div>
        </AuthenticatedLayout>
    );
}