import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Custom/Navbar';
import Footer from '@/Components/Custom/Footer';
import Carousel from '@/Components/Custom/Carousel';

interface WelcomeProps {
    auth: any;
    carousels: any[];
}

export default function Welcome({ auth, carousels }: WelcomeProps) {
    const carouselData = Array.isArray(carousels) ? carousels : [];

    return (
        <div className="public-site">
            <Head title="Accueil" />
            
            <Navbar auth={auth} />
            
            <main className="main-container text-center mt-5 flex-grow-1">
                <div className="about-container">
                    
                    <h2 className="title-underline">
                        Et si vous me faisiez confiance dès le début ?
                    </h2>
                    
                    <div id="carouselHome">
                         <Carousel carousels={carouselData} auth={auth} />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}