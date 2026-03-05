import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Custom/Navbar'; 
import Footer from '@/Components/Custom/Footer';
import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Welcome({ auth, carousels = [] }: { auth: any, carousels: any[] }) {
    return (
        <>
            <Head title="Artiste Photographe" />
            <Navbar auth={auth} />

<main className="flex-grow-1">
    <div id="mainCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="5000">
        <div className="carousel-inner">
            {carousels.map((img, index) => (
                <div key={img.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                    <div 
                        style={{ height: 'calc(100vh - 130px)' }} 
                        className="w-100 d-flex align-items-center justify-content-center bg-white"
                    >
                        <img 
                            src={img.image_url} 
                            className="d-block mw-100 mh-100 p-4" 
                            style={{ 
                                objectFit: 'contain',
                                cursor: 'default' 
                            }}
                            alt={img.title}
                            draggable="false"
                            // Bloque le clic droit sur l'image sans bloquer le carousel
                            onContextMenu={(e) => e.preventDefault()}
                        />
                    </div>
                </div>
            ))}
        </div>

        {/* Optionnel : Ajoute les boutons si tu veux que l'utilisateur puisse cliquer */}
        <button className="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Précédent</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Suivant</span>
        </button>
    </div>

    <Footer />
</main>
        </>
    );
}