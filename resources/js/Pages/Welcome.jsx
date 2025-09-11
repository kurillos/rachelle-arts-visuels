import React from 'react';
import Navbar from '@/Components/Custom/Navbar';
import Footer from '@/Components/Custom/Footer';
import Carousel from '@/Components/Custom/Carousel';
import { Head } from '@inertiajs/react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Welcome({ auth, carousels }) {
    console.log('Rendering Welcome page with carousels:', carousels);
    
    const carouselData = Array.isArray(carousels) ? carousels : [];

    return (
        <>
            <Head title="Accueil" />
            <div className="d-flex flex-column min-vh-100">
                <Navbar auth={auth} />
                <main className="flex-grow-1 p-4">
                    <div className="container mt-5">
                        <h2 className="text-center mb-4 text-primary-home">Et si vous me faisiez confiance dès le début ?</h2>
                    </div>
                    <div className="container mt-5 carousel-container">
                        <Carousel carousels={carouselData} auth={auth} />
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
