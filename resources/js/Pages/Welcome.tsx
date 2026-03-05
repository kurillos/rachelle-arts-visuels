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
                <div id="mainCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        {carousels.map((img, index) => (
                            <div key={img.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                <div style={{ height: 'calc(100vh - 130px)' }} className="w-100 d-flex align-items-center justify-content-center bg-white">
                                    <img 
                                        src={img.image_url} 
                                        className="d-block mw-100 mh-100 p-4" 
                                        style={{ objectFit: 'contain' }}
                                        alt={img.title} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Les contrôles sont là mais tu peux les styliser en .custom-carousel-btn dans le scss si besoin */}
                    <button className="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    </button>
                </div>
            </main>

            <Footer />
        </>
    );
}