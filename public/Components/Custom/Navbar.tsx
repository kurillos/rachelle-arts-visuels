import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
// @ts-ignore
import { route } from 'ziggy-js';


interface NavbarProps {
    auth?: any;
}

const Navbar: React.FC<NavbarProps> = ({ auth }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { url } = usePage();

    const isActive = (path: string) => url === path ? 'active fw-bold' : '';

    return (
        <header className="header-container fixed-top shadow-sm bg-white">
            <nav className="navbar navbar-expand-lg h-100">
                <div className="container-fluid">
                    <Link className="navbar-brand" href="/">
                        <img src="/images/logo.svg" alt="Logo" />
                    </Link>

                    <button className="navbar-toggler" type="button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item"><Link className={`nav-link ${isActive('/about')}`} href="/about">Mon Histoire</Link></li>
                            <li className="nav-item"><Link className={`nav-link ${isActive('/services')}`} href="/services">Accompagnements</Link></li>
                            <li className="nav-item"><Link className={`nav-link ${isActive('/contact')}`} href="/contact">Contact</Link></li>
                            
                            {/* --- SECTION AUTHENTIFICATION --- */}
                            {auth?.user ? (
                                <li className="nav-item dropdown ms-lg-3">
                                    <button 
                                        className="btn btn-purple-light rounded-pill px-4 dropdown-toggle border-0" 
                                        type="button" 
                                        data-bs-toggle="dropdown" 
                                        aria-expanded="false"
                                    >
                                        <span className="small fw-bold">{auth.user.name}</span>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-2">
                                        {/* Si c'est l'admin, on l'envoie vers le dashboard admin */}
                                        {auth.user.is_admin ? (
                                            <li><Link className="dropdown-item" href="/admin/dashboard">Administration</Link></li>
                                        ) : (
                                            /* Si c'est un client, on l'envoie vers son espace */
                                            <li><span className="dropdown-item-text text-muted small italic">Espace Client</span></li>
                                        )}
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <Link 
                                                href={route('logout')} 
                                                method="post" 
                                                as="button" 
                                                className="dropdown-item text-danger w-100 text-start"
                                            >
                                                Déconnexion
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            ) : (
                                /* Bouton connexion si personne n'est connecté */
                                <li className="nav-item ms-lg-2">
                                    <Link className="nav-link small text-muted" href="/login">Connexion</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;