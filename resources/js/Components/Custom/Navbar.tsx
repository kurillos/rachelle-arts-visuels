import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="header-container">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link className="navbar-brand logo" href="/">
                    <img src="/images/final_logo_moi.png" alt="logo" />
                </Link>
                <div className="container-fluid">
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-controls="navbarNav"
                        aria-expanded={isMenuOpen}
                        aria-label="Basculer la navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" href="/about">A propos</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/services">Services</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/portfolio">Portfolio</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/contact">Contact</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/reviews">Avis clients</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
