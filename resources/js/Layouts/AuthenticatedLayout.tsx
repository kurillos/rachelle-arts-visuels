import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Image as ImageIcon, 
    Heart, 
    Camera, 
    LogOut,
    User,
    ExternalLink,
    Settings,
    Tag
} from 'lucide-react';

declare var route: any;

interface Props {
    auth: any;
    header?: React.ReactNode;
    children: React.ReactNode;
}

export default function AuthenticatedLayout({ auth, children }: Props) {
    const { url } = usePage();

    return (
        <div className="admin-layout d-flex">
            {/* SIDEBAR GAUCHE - FIXE */}
            <aside className="admin-sidebar shadow-sm bg-white d-flex flex-column" 
                   style={{ width: '280px', height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 1050 }}>
                
                <div className="p-4 mb-2 border-bottom text-center">
                    <h5 className="font-charmonman text-purple fw-bold mb-1">Rachelle Arts</h5>
                    <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                        Studio Administration
                    </small>
                </div>

                <div className="px-4 py-3">
                    <Link href="/" className="btn btn-sm btn-outline-purple w-100 d-flex align-items-center justify-content-center">
                        <ExternalLink size={14} className="me-2" /> Voir le site
                    </Link>
                </div>

                <nav className="px-3 flex-grow-1 overflow-auto">
                    <ul className="list-unstyled">
                        <li className="mb-2">
                            <Link href={route('admin.dashboard')} 
                                className={`nav-link-admin ${url === '/admin/dashboard' ? 'active' : ''}`}>
                                <LayoutDashboard size={18} className="me-3" /> Dashboard
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link href={route('admin.carousel.index')} 
                                className={`nav-link-admin ${url.startsWith('/admin/carousel') ? 'active' : ''}`}>
                                <ImageIcon size={18} className="me-3" /> Vitrine Accueil
                            </Link>
                        </li>
                        
                        <div className="admin-nav-separator text-muted small fw-bold mt-4 mb-2 px-3">PORTFOLIO</div>
                        
                        <li className="mb-2">
                            <Link href={route('admin.portfolio.index')} 
                                className={`nav-link-admin ${url.startsWith('/admin/portfolio') ? 'active' : ''}`}>
                                <ImageIcon size={18} className="me-3" /> Portfolio Public
                            </Link>
                        </li>

                        <div className="admin-nav-separator text-muted small fw-bold mt-4 mb-2 px-3">GALERIES PRIVÉES</div>
                        
                        <li className="mb-2">
                            <Link href={route('admin.galleries.index', { type: 'mariage' })} 
                                className={`nav-link-admin ${url.includes('type=mariage') ? 'active' : ''}`}>
                                <Heart size={18} className="me-3" /> Mariages
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link href={route('admin.galleries.index', { type: 'shooting' })} 
                                className={`nav-link-admin ${url.includes('type=shooting') ? 'active' : ''}`}>
                                <Camera size={18} className="me-3" /> Shootings
                            </Link>
                        </li>
                        <div className="admin-nav-separator text-muted small fw-bold mt-4 mb-2 px-3">GESTION MÉTIER</div>

                        <li className="mb-2">
                            <Link href={route('admin.offers.index')} 
                                className={`nav-link-admin ${url.startsWith('/admin/offers') ? 'active' : ''}`}>
                                <Tag size={18} className="me-3" /> Mes Offres & Quotas
                            </Link>
                        </li>

                        <li className="mt-4 border-top pt-4">
                            <Link href={route('admin.settings.index')} 
                                className={`nav-link-admin ${url.startsWith('/admin/settings') ? 'active' : ''}`}>
                                <Settings size={18} className="me-3" /> Configuration
                            </Link>
                        </li>
                        <li className="mt-4">
                            <Link href={route('admin.settings.index')} 
                                className={`nav-link-admin ${url.startsWith('/admin/settings') ? 'active' : ''}`}>
                                <Settings size={18} className="me-3" /> Configuration
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="p-3 border-top bg-light">
                    <div className="d-flex align-items-center p-2 mb-3">
                        <div className="bg-purple text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '35px', height: '35px' }}>
                            <User size={18} />
                        </div>
                        <div className="overflow-hidden">
                            <p className="small fw-bold mb-0 text-truncate">{auth.user.name}</p>
                            <p className="text-muted mb-0" style={{ fontSize: '0.7rem' }}>Administratrice</p>
                        </div>
                    </div>
                    <Link href={route('logout')} method="post" as="button" className="btn btn-light text-danger w-100 btn-sm d-flex align-items-center justify-content-center border">
                        <LogOut size={16} className="me-2" /> Déconnexion
                    </Link>
                </div>
            </aside>

            {/* CONTENU DROITE - PREND TOUT LE RESTE */}
            <main className="flex-grow-1" style={{ marginLeft: '280px', backgroundColor: '#F8F9FC', minHeight: '100vh' }}>
                <div className="container-fluid p-4 p-md-5">
                    {children}
                </div>
            </main>
        </div>
    );
}