import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
  Globe, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Layout, 
  Code, 
  Palette,
  Image as ImageIcon,
  CheckCircle
} from "lucide-react";

// @ts-ignore
import { route } from 'ziggy-js';

interface Project {
    id: number;
    title: string;
    url_site: string;
    description: string;
    cover_image: string;
    tech_stack: string;
    role_graphiste: string;
    role_dev: string;
}

interface Props {
    auth: any;
    projects: Project[];
}

export default function Index({ auth, projects }: Props) {
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        url_site: '',
        description: '',
        tech_stack: '',
        role_graphiste: '',
        role_dev: '',
        image: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.web-projects.store'), {
            onSuccess: () => {
                reset();
                setPreview(null);
            },
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Supprimer ce projet du portfolio web ?')) {
            router.delete(route('admin.web-projects.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Gestion Portfolio Web - Rachelle Arts" />
            
            <div className="py-4">
                <header className="mb-5">
                    <h1 className="admin-title-cursive display-5 mb-1">Portfolio Web</h1>
                    <p className="text-muted">Gérez vos créations de sites web et applications réalisées en duo.</p>
                </header>

                <div className="row g-4">
                    {/* FORMULAIRE D'AJOUT */}
                    <div className="col-lg-5">
                        <div className="card border-0 shadow-lg rounded-4 bg-white sticky-top" style={{ top: '20px' }}>
                            <div className="card-header bg-purple text-white py-3 fw-bold d-flex align-items-center">
                                <Plus size={18} className="me-2" /> AJOUTER UN PROJET
                            </div>
                            <div className="card-body p-4">
                                <form onSubmit={submit}>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Nom du site</label>
                                        <input type="text" className="form-control shadow-sm" placeholder="ex: Vite & Gourmand" 
                                            value={data.title} onChange={e => setData('title', e.target.value)} />
                                        {errors.title && <div className="text-danger small mt-1">{errors.title}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">URL du site</label>
                                        <input type="url" className="form-control shadow-sm" placeholder="https://..." 
                                            value={data.url_site} onChange={e => setData('url_site', e.target.value)} />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Technologies (séparées par des virgules)</label>
                                        <input type="text" className="form-control shadow-sm" placeholder="React, Laravel, Tailwind..." 
                                            value={data.tech_stack} onChange={e => setData('tech_stack', e.target.value)} />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Image de couverture (Mockup)</label>
                                        <label className="upload-zone-styled d-block pointer">
                                            <input type="file" className="d-none" onChange={handleFileChange} />
                                            <div className="p-4 text-center border-2 border-dashed rounded-4 bg-light">
                                                {preview ? (
                                                    <img src={preview} className="img-fluid rounded shadow-sm mb-2" style={{maxHeight: '150px'}} />
                                                ) : (
                                                    <ImageIcon size={40} className="text-purple opacity-50" />
                                                )}
                                                <div className="small fw-bold text-muted mt-2">Cliquez pour uploader</div>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Description globale</label>
                                        <textarea className="form-control shadow-sm" rows={3} 
                                            value={data.description} onChange={e => setData('description', e.target.value)}></textarea>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label small fw-bold text-purple"><Palette size={14} className="me-1"/> Rôle Graphiste</label>
                                            <textarea className="form-control shadow-sm small" rows={4} placeholder="UX/UI, Logo..."
                                                value={data.role_graphiste} onChange={e => setData('role_graphiste', e.target.value)}></textarea>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label small fw-bold text-info"><Code size={14} className="me-1"/> Rôle Dev</label>
                                            <textarea className="form-control shadow-sm small" rows={4} placeholder="API, Frontend..."
                                                value={data.role_dev} onChange={e => setData('role_dev', e.target.value)}></textarea>
                                        </div>
                                    </div>

                                    <button className="btn btn-purple w-100 fw-bold py-2 mt-2" disabled={processing}>
                                        {processing ? 'CREATION EN COURS...' : 'PUBLIER LE PROJET'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* LISTE DES PROJETS */}
                    <div className="col-lg-7">
                        <div className="row g-4">
                            {projects.map((project) => (
                                <div key={project.id} className="col-12">
                                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                                        <div className="row g-0">
                                            <div className="col-md-4">
                                                <img src={project.cover_image} className="h-100 w-100" style={{objectFit: 'cover'}} />
                                            </div>
                                            <div className="col-md-8">
                                                <div className="card-body p-4">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <h5 className="fw-bold mb-1">{project.title}</h5>
                                                        <button onClick={() => handleDelete(project.id)} className="btn btn-link text-danger p-0">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                    <a href={project.url_site} target="_blank" className="text-purple small text-decoration-none d-flex align-items-center mb-3">
                                                        <ExternalLink size={14} className="me-1" /> {project.url_site}
                                                    </a>
                                                    
                                                    <div className="d-flex gap-2 mb-3 flex-wrap">
                                                        {project.tech_stack.split(',').map((tag, i) => (
                                                            <span key={i} className="badge bg-light text-muted border px-2 py-1">
                                                                {tag.trim()}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <div className="bg-light p-3 rounded-3 small">
                                                        <div className="mb-2"><strong>Graphisme :</strong> {project.role_graphiste.substring(0, 100)}...</div>
                                                        <div><strong>Dev :</strong> {project.role_dev.substring(0, 100)}...</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {projects.length === 0 && (
                                <div className="text-center py-5 text-muted">
                                    <Globe size={48} className="mb-3 opacity-20" />
                                    <p>Aucun projet web pour le moment.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .bg-purple { background-color: #a855f7 !important; }
                .text-purple { color: #a855f7 !important; }
                .btn-purple { background-color: #a855f7; color: white; border: none; transition: 0.3s; }
                .btn-purple:hover { background-color: #9333ea; transform: translateY(-2px); }
                .upload-zone-styled { cursor: pointer; }
                .upload-zone-styled:hover .bg-light { background-color: #f3e8ff !important; border-color: #a855f7 !important; }
            `}</style>
        </AuthenticatedLayout>
    );
}