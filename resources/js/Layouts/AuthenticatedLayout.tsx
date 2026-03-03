import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Image as ImageIcon, 
    Heart, 
    Camera, 
    LogOut,
    User,
    ExternalLink
} from 'lucide-react';

declare var route: any;

interface Props {
    auth: any;
    children: React.ReactNode;
}

export default function AuthenticatedLayout({ auth, children }: Props) {
    const { url } = usePage();

    return (
        <div className="admin-layout d-flex">
            {/* SIDEBAR GAUCHE */}
            <aside className="admin-sidebar shadow-sm bg-white" style={{ width: '280px', minHeight: '100vh', position: 'fixed' }}>
                <div className="p-4 mb-4 border-bottom">
                    <h5 className="font-charmonman text-purple fw-bold mb-0">Rachelle Art Visuels</h5>
                    <div className="px-4 pt-4">
                    <Link href="/" className="btn btn-sm btn-outline-secondary w-100 d-flex align-items-center justify-content-center mb-3">
                        <ExternalLink size={14} className="me-2" /> Voir le site
                    </Link>
                    </div>
                    <small className="text-muted">Studio Administration</small>
                </div>

                <nav className="px-3 flex-grow-1">
                    <ul className="list-unstyled">
                        <li className="mb-2">
                            <Link href={route('admin.dashboard')} 
                                className={`nav-link-custom ${url === '/admin/dashboard' ? 'active' : ''}`}>
                                <LayoutDashboard size={20} /> Dashboard
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link href={route('admin.carousel.index')} 
                                className={`nav-link-custom ${url.startsWith('/admin/carousel') ? 'active' : ''}`}>
                                <ImageIcon size={20} /> Vitrine Accueil
                            </Link>
                        </li>
                        <hr className="my-3 text-muted opacity-25" />
                        <li className="mb-2">
                            <Link href={route('admin.galleries.index', { type: 'mariage' })} 
                                className={`nav-link-custom ${url.includes('type=mariage') ? 'active' : ''}`}>
                                <Heart size={20} /> Mariages
                            </Link>
                        </li>
                        <li className="mb-2">
                            <Link href={route('admin.galleries.index', { type: 'shooting' })} 
                                className={`nav-link-custom ${url.includes('type=shooting') ? 'active' : ''}`}>
                                <Camera size={20} /> Shootings
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="p-3 border-top mt-auto">
                    <div className="d-flex align-items-center p-2 mb-3">
                        <div className="bg-purple-light rounded-circle p-2 me-2">
                            <User size={18} className="text-purple" />
                        </div>
                        <span className="small fw-bold">{auth.user.name}</span>
                    </div>
                    <Link href={route('logout')} method="post" as="button" className="btn btn-outline-danger w-100 btn-sm d-flex align-items-center justify-content-center">
                        <LogOut size={16} className="me-2" /> Déconnexion
                    </Link>
                </div>
            </aside>

            {/* CONTENU DROITE */}
            <main className="admin-main-content w-100" style={{ marginLeft: '280px', backgroundColor: '#FBFBFF', minHeight: '100vh' }}>
                <div className="p-4 p-md-5">
                    {children}
                </div>
            </main>
        </div>
    );
}