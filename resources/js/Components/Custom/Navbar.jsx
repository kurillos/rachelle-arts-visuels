import React from 'react';
import { Link, Head } from '@inertiajs/react';

export default function Navbar({ auth }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid d-flex justify-content-between align-items-center">
                <Link className="navbar-brand d-flex align-items-center" href="/">
                    <img src="/images/final_Logo_moi.png" alt="Logo Rachelle Arts Visuels" className="logo" />
                    <span className="ms-2"></span>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav mb-2 mb-lg-0 ms-auto">
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
                            <Link className="nav-link" href={route('reviews')}>Avis clients</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" href={route('contact')}>Contact</Link>
                        </li>
                        {auth.user ? (
                            <li className="nav-item ms-lg-auto">
                                <Link href={route('dashboard')} className="nav-link">
                                    Tableau de bord
                                </Link>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item ms-lg-auto">
                                    <Link href={route('login')} className="nav-link">Connexion</Link>
                                </li>
                                <li className="nav-item">
                                    <Link href={route('register')} className="nav-link">Inscription</Link>
                                </li>  
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
