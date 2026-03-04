import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Trash2, Upload, ImageIcon } from 'lucide-react';
// @ts-ignore
import { route } from 'ziggy-js';

interface Props {
    images: any[];
    categories: any[];
    tags: any[];
    auth: any;
}

export default function Index({ images, categories, tags, auth }: Props) {
    // --- FORMULAIRE D'UPLOAD S3 ---
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        category_id: '',
        image: null as File | null,
        tag_ids: [] as number[], // IDs des tags sélectionnés
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.portfolio.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Supprimer définitivement cette image de S3 ?')) {
            router.delete(route('admin.portfolio.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            auth={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestion du Portfolio (S3)</h2>}
        >
            <Head title="Admin | Portfolio" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* --- SECTION UPLOAD --- */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-medium mb-4 flex align-items-center gap-2">
                            <Upload size={20} /> Ajouter une nouvelle œuvre
                        </h3>
                        
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fichier Image</label>
                                    <input 
                                        type="file" 
                                        onChange={e => setData('image', e.target.files?.[0] || null)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    />
                                    {errors.image && <div className="text-red-500 text-xs mt-1">{errors.image}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Métier / Catégorie</label>
                                    <select 
                                        value={data.category_id}
                                        onChange={e => setData('category_id', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    >
                                        <option value="">Sélectionner...</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Univers / Tags</label>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map(tag => (
                                        <label key={tag.id} className="inline-flex items-center bg-gray-100 px-3 py-1 rounded-full cursor-pointer hover:bg-purple-100 transition-colors">
                                            <input 
                                                type="checkbox"
                                                className="rounded border-gray-300 text-purple-600 shadow-sm focus:ring-purple-500 mr-2"
                                                checked={data.tag_ids.includes(tag.id)}
                                                onChange={e => {
                                                    const id = tag.id;
                                                    setData('tag_ids', e.target.checked 
                                                        ? [...data.tag_ids, id] 
                                                        : data.tag_ids.filter(t => t !== id)
                                                    );
                                                }}
                                            />
                                            <span className="text-sm">{tag.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none disabled:opacity-50"
                            >
                                {processing ? 'Téléchargement vers S3...' : 'Publier sur le Portfolio'}
                            </button>
                        </form>
                    </div>

                    {/* --- GRILLE DE GESTION --- */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map((img) => (
                            <div key={img.id} className="relative bg-white rounded-lg shadow group overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all">
                                <img 
                                    src={img.full_url} 
                                    alt="" 
                                    className="h-48 w-full object-cover"
                                />
                                <div className="p-2">
                                    <p className="text-xs font-bold truncate">{img.category?.name || 'Sans catégorie'}</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {img.tags?.map((t: any) => (
                                            <span key={t.id} className="text-[9px] bg-gray-200 px-1 rounded">#{t.name}</span>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Overlay de suppression */}
                                <button 
                                    onClick={() => handleDelete(img.id)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    title="Supprimer"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {images.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">Aucune photo dans votre bibliothèque S3.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}