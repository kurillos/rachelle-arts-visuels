import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
  UploadCloud, 
  Image as ImageIcon,
  Database,
  Trash2,
  ExternalLink,
  FileCheck
} from "lucide-react";

// @ts-ignore
import { route } from 'ziggy-js';

interface DashboardProps {
    auth: any;
    images?: any[];
}

export default function Dashboard({ auth, images = [] }: DashboardProps) {
    // État pour l'envoi en bloc
    const { data, setData, post, processing, reset, errors } = useForm({
        images: [] as File[], 
        title: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.carousel.upload'), {
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Voulez-vous vraiment supprimer cette image du Cloud S3 ?')) {
            router.delete(route('admin.carousel.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Administration - Portfolio" />
            
            <div className="admin-dashboard-wrapper py-5">
                <main className="container">
                    <header className="mb-5 text-center text-lg-start">
                        <h1 className="admin-title-cursive display-4 mb-2">Gestion du Portfolio HD</h1>
                        <div className="d-flex align-items-center justify-content-center justify-content-lg-start mt-3">
                            <span className="badge-s3 d-flex align-items-center px-3 py-2">
                                <Database size={16} className="me-2" />
                                Infrastructure S3 : eu-north-1
                            </span>
                        </div>
                    </header>

                    <div className="row g-4">
                        {/* FORMULAIRE D'UPLOAD */}
                        <div className="col-lg-5">
                            <div className="card admin-card border-0 shadow-lg overflow-hidden">
                                <div className="admin-card-header py-3 bg-purple text-white text-center fw-bold">
                                    <UploadCloud className="me-2" /> PUBLIER EN BLOC
                                </div>
                                <div className="card-body p-4">
                                    <form onSubmit={submit}>
                                        <label className="upload-zone-styled mb-4 d-block">
                                            <input 
                                                type="file" 
                                                multiple 
                                                className="d-none" 
                                                onChange={(e) => setData('images', e.target.files ? Array.from(e.target.files) : [])}
                                            />
                                            <div className="zone-content p-4 text-center border-2 rounded-4">
                                                {data.images.length > 0 ? (
                                                    <FileCheck size={40} className="text-success mb-2" />
                                                ) : (
                                                    <ImageIcon size={40} className="text-info mb-2" />
                                                )}
                                                <h6 className="fw-bold mb-1">
                                                    {data.images.length > 0 ? `${data.images.length} fichiers` : "Cliquez pour ajouter"}
                                                </h6>
                                            </div>
                                        </label>

                                        <div className="mb-4">
                                            <label className="form-label fw-bold mb-1">Titre de base (ex: Mariage)</label>
                                            <input 
                                                type="text" 
                                                className="form-control admin-input" 
                                                value={data.title}
                                                onChange={e => setData('title', e.target.value)}
                                                placeholder="Laisse vide pour 'image-1'..." 
                                            />
                                        </div>

                                        <button className="btn btn-admin-action w-100 py-3 fw-bold" disabled={processing || data.images.length === 0}>
                                            {processing ? 'TRANSFERT EN COURS...' : 'ENVOYER VERS LE NUAGE'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* LISTE DES IMAGES S3 */}
                        <div className="col-lg-7">
                            <div className="card admin-card border-0 shadow-lg h-100">
                                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0 fw-bold">Ma Galerie Cloud</h5>
                                    <span className="badge rounded-pill bg-info text-dark">{images.length}</span>
                                </div>
                                <div className="card-body p-4">
                                    <div className="row g-3">
                                        {images.map((img: any) => (
                                            <div key={img.id} className="col-md-4">
                                                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                                    <img src={img.image_url} className="card-img-top" style={{ height: '120px', objectFit: 'cover' }} alt={img.title} />
                                                    <div className="card-body p-2 d-flex justify-content-between">
                                                        <a href={img.image_url} target="_blank" className="btn btn-sm btn-light text-info"><ExternalLink size={14} /></a>
                                                        <button onClick={() => handleDelete(img.id)} className="btn btn-sm btn-light text-danger"><Trash2 size={14} /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </AuthenticatedLayout>
    );
}