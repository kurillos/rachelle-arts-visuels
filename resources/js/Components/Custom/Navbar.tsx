import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

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
                {/* container-fluid permet au logo de sortir du cadre centré */}
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
                            {auth?.user && <li className="nav-item"><Link className="nav-link" href="/dashboard">Mon Espace</Link></li>}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;