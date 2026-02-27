import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Custom/Navbar';
import Footer from '@/Components/Custom/Footer';
import Carousel from '@/Components/Custom/Carousel';

// Import de Bootstrap si pas déjà fait dans app.tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

interface CarouselItem {
    id: number;
    image_url: string;
    title?: string;
    description?: string;
}

interface WelcomeProps {
    auth: any;
    carousels: CarouselItem[];
}

export default function Welcome({ auth, carousels }: WelcomeProps) {
    // Sécurité pour s'assurer que carousels est toujours un tableau
    const carouselData = Array.isArray(carousels) ? carousels : [];

    return (
        <>
            <Head title="Accueil" />
            
            <div className="d-flex flex-column min-vh-100 bg-white">
                <Navbar auth={auth} />
                
                <main className="flex-grow-1 main-welcome">
                    <div className="container mt-5 text-center">
                        <h2 className="home-hero-title mb-5">
                            Et si vous me faisiez confiance dès le début ?
                        </h2>
                        
                        {/* Carousel */}
                        <div className="carousel-wrapper mx-auto shadow-lg bg-light rounded overflow-hidden">
                            <Carousel carousels={carouselData} />
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}