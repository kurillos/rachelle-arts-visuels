import React from 'react';
import { Link } from '@inertiajs/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Navbar = ({ auth }) => {
    const isAuthenticated = auth && auth.user;

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand logo" href="/">
                    <img src="/images/final_logo_moi.png" alt="Logo de Rachelle" className="h-200"/>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" href={route('welcome')}>Accueil</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href={route('about')}>À propos</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href={route('services')}>Services</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href={route('portfolio')}>Portfolio</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href={route('contact')}>Contact</Link>
                        </li>
                        {/* Affiche le lien de connexion si l'utilisateur n'est pas connecté */}
                        {!isAuthenticated && (
                            <li className="nav-item">
                                <Link className="nav-link" href={route('login')}>Connexion</Link>
                            </li>
                        )}
                        {/* Affiche le lien du tableau de bord si l'utilisateur est connecté */}
                        {isAuthenticated && (
                            <li className="nav-item">
                                <Link className="nav-link" href={route('dashboard')}>Tableau de bord</Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
