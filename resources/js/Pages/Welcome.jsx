import React from 'react';
import Navbar from '@/Components/Custom/Navbar';
import Footer from '@/Components/Custom/Footer';
import Carousel from '@/Components/Custom/Carousel';
import { Head } from '@inertiajs/react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Welcome({ auth, carousels }) {
    console.log('Rendering Welcome page with carousels:', carousels);
    
    // Vérifier si la variable carousels est définie et est un tableau
    const carouselData = Array.isArray(carousels) ? carousels : [];

    return (
        <>
            <Head title="Accueil" />
            <div className="d-flex flex-column min-vh-100">
                <Navbar auth={auth} />
                <main className="flex-grow-1 p-4">
                    <div className="container mt-5">
                        <h1 className="text-center mb-4">Bienvenue sur Rachelle Arts Visuels</h1>
                        <p className="lead text-center">
                            Découvrez la beauté de l'art à travers notre galerie.
                        </p>
                    </div>
                    <div className="container mt-5 carousel-container">
                        {/* Passer les données du carrousel au composant Carousel */}
                        <Carousel carousels={carouselData} />
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
