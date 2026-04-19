import React from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
  UploadCloud, 
  Image as ImageIcon,
  Database,
  Trash2,
  ExternalLink,
  FileCheck,
  Clock,
  CheckCircle,
  Mail,
  ArrowRight,
  Camera,
  ChevronRight
} from "lucide-react";

// @ts-ignore
import { route } from 'ziggy-js';

interface DashboardProps {
    auth: any;
    stats: {
        brouillons: number;
        envoyees: number;
        a_traiter: number;
        en_cours: number;
    };
    recentGalleries: any[];
    carouselImages: any[];
}

export default function Dashboard({ auth, stats, recentGalleries, carouselImages = [] }: DashboardProps) {
    // Gestion de l'upload Vitrine
    const { data, setData, post, processing, reset, errors } = useForm({
        images: [] as File[], 
        title: '',
    });

    const submitCarousel = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.carousel.upload'), {
            onSuccess: () => reset(),
        });
    };

    const handleDeleteCarousel = (id: number) => {
        if (confirm('Voulez-vous supprimer cette image de la vitrine ?')) {
            router.delete(route('admin.carousel.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Tableau de Bord - Rachelle Arts" />
            
            <div className="admin-dashboard-wrapper py-4">
                {/* HEADER AVEC INFOS INFRA */}
                <header className="mb-5 d-flex justify-content-between align-items-end">
                    <div>
                        <h1 className="admin-title-cursive display-5 mb-1">Bonjour Rachelle</h1>
                        <p className="text-muted mb-0">Pilotage de votre studio et de votre infrastructure Cloud.</p>
                    </div>
                    <span className="badge-s3 d-none d-md-flex align-items-center px-3 py-2 small opacity-75">
                        <Database size={14} className="me-2" />
                        S3 Node: eu-north-1
                    </span>
                </header>

                {/* --- SECTION 1 : PILOTAGE MÉTIER (STATS) --- */}
                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm p-4 rounded-4 bg-purple text-white position-relative overflow-hidden h-100">
                            <div className="position-relative z-2">
                                <CheckCircle className="mb-3 opacity-75" size={32} />
                                <h3 className="display-5 fw-bold mb-0">{stats.a_traiter}</h3>
                                <p className="small fw-bold text-uppercase mb-0">À Retoucher (Sélections)</p>
                            </div>
                            <CheckCircle size={100} className="position-absolute opacity-10" style={{bottom: -10, right: -10}} />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white border-start border-warning border-5 h-100">
                            <Clock className="text-warning mb-3" size={32} />
                            <h3 className="display-5 fw-bold mb-0 text-dark">{stats.envoyees + stats.en_cours}</h3>
                            <p className="text-muted small fw-bold text-uppercase mb-0">En cours chez les clients</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm p-4 rounded-4 bg-white border-start border-info border-5 h-100">
                            <Mail className="text-info mb-3" size={32} />
                            <h3 className="display-5 fw-bold mb-0 text-dark">{stats.brouillons}</h3>
                            <p className="text-muted small fw-bold text-uppercase mb-0">Brouillons à envoyer</p>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    {/* --- SECTION 2 : ACTIVITÉS RÉCENTES (Tableau) --- */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white">
                            <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
                                <h5 className="mb-0 fw-bold d-flex align-items-center">
                                    <Camera size={20} className="me-2 text-purple" /> Activité des Galeries
                                </h5>
                                <Link href={route('admin.galleries.index', { type: 'mariage' })} className="text-purple small text-decoration-none fw-bold">
                                    Tout voir <ChevronRight size={16} />
                                </Link>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="px-4 py-3 border-0 small text-muted">GALERIE</th>
                                            <th className="py-3 border-0 small text-muted">STATUT</th>
                                            <th className="py-3 border-0 small text-muted text-end px-4">ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentGalleries.map((g: any) => (
                                            <tr key={g.id}>
                                                <td className="px-4 py-3">
                                                    <div className="fw-bold">{g.title}</div>
                                                    <div className="small text-muted">{g.client_name}</div>
                                                </td>
                                                <td>
                                                    <span className={`badge rounded-pill px-3 py-2 ${
                                                        g.status === 'sélectionnée' ? 'bg-purple' : 
                                                        g.status === 'en cours' ? 'bg-info-subtle text-info' : 'bg-light text-muted'
                                                    }`}>
                                                        {g.status}
                                                    </span>
                                                </td>
                                                <td className="text-end px-4">
                                                    <Link href={route('admin.galleries.show', g.id)} className="btn btn-sm btn-light rounded-circle">
                                                        <ArrowRight size={16} className="text-purple"/>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* --- SECTION 3 : GESTION VITRINE (Carousel) --- */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-lg rounded-4 bg-white mb-4">
                            <div className="card-header bg-purple text-white py-3 fw-bold">
                                <UploadCloud size={18} className="me-2" /> PUBLIER EN VITRINE
                            </div>
                            <div className="card-body p-4">
                                <form onSubmit={submitCarousel}>
                                    <label className="upload-zone-styled mb-3 d-block pointer">
                                        <input type="file" multiple className="d-none" onChange={(e) => setData('images', e.target.files ? Array.from(e.target.files) : [])}/>
                                        <div className="p-3 text-center border-2 border-dashed rounded-4 bg-light">
                                            {data.images.length > 0 ? <FileCheck size={30} className="text-success" /> : <ImageIcon size={30} className="text-purple" />}
                                            <div className="small fw-bold mt-2">{data.images.length > 0 ? `${data.images.length} fichiers` : "Ajouter des photos"}</div>
                                        </div>
                                    </label>
                                    <input type="text" className="form-control form-control-sm mb-3" placeholder="Titre de base..." value={data.title} onChange={e => setData('title', e.target.value)} />
                                    <button className="btn btn-purple btn-sm w-100 fw-bold" disabled={processing || data.images.length === 0}>
                                        {processing ? 'ENVOI...' : 'ENVOYER SUR S3'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="card border-0 shadow-lg rounded-4 bg-white">
                            <div className="p-3 border-bottom fw-bold small">DERNIERS AJOUTS VITRINE</div>
                            <div className="p-3">
                                <div className="row g-2">
                                    {carouselImages.slice(0, 6).map((img: any) => (
                                        <div key={img.id} className="col-4 position-relative group">
                                            <img src={img.image_url} className="img-fluid rounded-2 border shadow-sm" style={{ height: '50px', width: '100%', objectFit: 'cover' }} />
                                            <button onClick={() => handleDeleteCarousel(img.id)} className="btn btn-danger btn-xs position-absolute top-0 end-0 m-1 rounded-circle p-1 opacity-0 group-hover-opacity-100" style={{lineHeight: 0}}>
                                                <Trash2 size={10} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .bg-purple { background-color: #a855f7 !important; }
                .text-purple { color: #a855f7 !important; }
                .btn-purple { background-color: #a855f7; color: white; border: none; }
                .btn-purple:hover { background-color: #9333ea; color: white; }
                .badge-s3 { background: #f1f5f9; color: #475569; border-radius: 10px; font-weight: 600; font-size: 0.8rem; }
                .group:hover .opacity-0 { opacity: 1 !important; }
                .bg-info-subtle { background-color: #e0f2fe; }
                .pointer { cursor: pointer; }
            `}</style>
        </AuthenticatedLayout>
    );
}