import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Custom/Navbar'; 
import Footer from '@/Components/Custom/Footer';
import React from 'react';

interface CarouselItem {
    id: number;
    image_url: string; 
    title: string;
}

export default function Welcome({ auth, carousels = [] }: { auth: any, carousels: CarouselItem[] }) {
    return (
        <>
            <Head title="Artiste Photographe HD" />
            <Navbar auth={auth} />

        <main>
            <div id="mainCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
                <div className="carousel-inner">
                    {carousels.map((img, index) => (
                        <div key={img.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                            <div className="vh-100 w-100 bg-white d-flex align-items-center justify-content-center">
                            <img 
                                src={img.image_url} 
                                className="d-block mw-100 mh-100" 
                                style={{ 
                                    objectFit: 'contain',
                                    maxHeight: '100vh' 
                                }}
                                alt={img.title} 
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Boutons Carousel */}
            <button className="carousel-control-prev custom-carousel-btn" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Précédent</span>
            </button>
            <button className="carousel-control-next custom-carousel-btn" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Suivant</span>
            </button>
        </div>
    </main>

            <Footer />
        </>
    );
}