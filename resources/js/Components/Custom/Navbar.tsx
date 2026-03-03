import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

interface NavbarProps {
    auth?: any;
}

const Navbar: React.FC<NavbarProps> = ({ auth }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="header-container">
            <nav className="navbar navbar-expand-lg w-100">
                <div className="container-fluid">
                    {/* LOGO */}
                    <Link className="navbar-brand logo" href="/">
                        <img src="/images/logo.svg" alt="Rachelle Arts Visuels" />
                    </Link>

                    {/* BOUTON MOBILE (Hamburger) */}
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-controls="navbarNav" 
                        aria-expanded={isMenuOpen} 
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* LIENS DU MENU */}
                    <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" href="/about">Mon Histoire</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/services">Accompagnements</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/reviews">Avis clients</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/contact">Contact</Link>
                            </li>
                            
                            {/* Optionnel : Lien Admin si connecté */}
                            {auth?.user && (
                                <li className="nav-item">
                                    <Link className="nav-link font-bold" href="/dashboard">Admin</Link>
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