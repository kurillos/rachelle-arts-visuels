import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Custom/Navbar';
import Footer from '@/Components/Custom/Footer';
import { useEffect, useRef } from 'react';

export default function Welcome({ auth, carousels = [] }: { auth: any, carousels: any[] }) {
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    if (carouselRef.current && carousels.length > 0) {
        import('bootstrap').then(({ Carousel }) => {
            const carousel = new Carousel(carouselRef.current!, {
                interval: 2000,
                ride: 'carousel',
                wrap: true,
            });
            carousel.cycle();
        });
    }
}, [carousels]);

    return (
        <>
            <Head title="Rachelle Conception Visuelle et Photographie" />
            <Navbar auth={auth} />
            <main className="flex-grow-1">
                <div
                    id="mainCarousel"
                    ref={carouselRef}
                    className="carousel slide carousel-fade"
                >
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
                                        style={{ objectFit: 'contain', cursor: 'default' }}
                                        alt={img.title}
                                        draggable="false"
                                        fetchPriority={index === 0 ? 'high' : 'low'}
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                        onContextMenu={(e) => e.preventDefault()}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
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