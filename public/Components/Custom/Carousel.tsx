import React, { useEffect } from 'react';

let Link: any = ({ children, href, className, ...props }: any) => <a href={href} className={className} {...props}>{children}</a>;

try {
    // Tentative d'import de Link depuis Inertia.js
} catch (e) {
    // Fallback déjà défini
}

// --- Interfaces ---
interface CarouselItem {
    id: number;
    image_url: string;
    title?: string;
    description?: string;
}

interface CarouselProps {
    carousels: CarouselItem[];
    auth: {
        user: any;
    };
}

/**
 * Composant Carousel avec gestion du mode Administrateur (hover)
 */
const Carousel: React.FC<CarouselProps> = ({ carousels, auth }) => {
    // Vérification de l'Admin
    const isAdmin = auth?.user !== null && auth?.user !== undefined;

    // Injection du CSS Bootstrap pour la prévisualisation
    useEffect(() => {
        if (!document.getElementById('bootstrap-cdn')) {
            const link = document.createElement('link');
            link.id = 'bootstrap-cdn';
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
            document.head.appendChild(link);

            const icons = document.createElement('link');
            icons.id = 'bootstrap-icons';
            icons.rel = 'stylesheet';
            icons.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css';
            document.head.appendChild(icons);
        }
    }, []);

    // Rendu si aucune image n'est présente
    if (!carousels || carousels.length === 0) {
        return (
            <div className="d-flex align-items-center justify-content-center bg-dark text-white rounded-4 shadow-inner" style={{ height: '500px' }}>
                <div className="text-center p-4">
                    <i className="bi bi-images display-1 opacity-25 mb-3 d-block"></i>
                    <p className="lead mb-4" style={{ fontFamily: 'Charm, sans-serif' }}>
                        Aucune image n'a encore été ajoutée au carrousel.
                    </p>
                    {isAdmin && (
                        <Link 
                            href="/admin/carousels/create" 
                            className="btn btn-outline-info rounded-pill px-4"
                        >
                            <i className="bi bi-plus-circle me-2"></i>
                            Ajouter ma première œuvre
                        </Link>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div id="homeCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
            {/* Indicateurs */}
            <div className="carousel-indicators">
                {carousels.map((_, index) => (
                    <button 
                        key={index}
                        type="button" 
                        data-bs-target="#homeCarousel" 
                        data-bs-slide-to={index} 
                        className={index === 0 ? 'active' : ''} 
                        aria-current={index === 0 ? 'true' : 'false'}
                    ></button>
                ))}
            </div>

            {/* Liste des images */}
            <div className="carousel-inner rounded-4 shadow-lg border border-white border-4">
                {carousels.map((slide, index) => (
                    <div 
                        className={`carousel-item ${index === 0 ? 'active' : ''} position-relative admin-hover-container`} 
                        key={slide.id || index}
                    >
                        {/* Conteneur d'image avec hauteur fixe et fond neutre */}
                        <div className="carousel-img-wrapper bg-black d-flex align-items-center justify-content-center" style={{ height: '600px' }}>
                            <img 
                                src={slide.image_url} 
                                className="d-block w-100 h-100" 
                                alt={slide.title || "Projet artistique"} 
                                style={{ objectFit: 'contain' }}
                                onError={(e: any) => {
                                    e.target.src = `https://via.placeholder.com/1200x600/1a1c20/13D4F5?text=${encodeURIComponent(slide.title || 'Image non trouvée')}`;
                                }}
                            />
                        </div>

                        {/* OVERLAY ADMIN : Uniquement pour Rachelle en mode connecté */}
                        {isAdmin && (
                            <div className="admin-overlay d-flex justify-content-center align-items-center">
                                <div className="btn-group bg-white p-2 rounded-pill shadow-lg">
                                    <Link 
                                        href={`/admin/carousels/${slide.id}/edit`}
                                        className="btn btn-link text-primary border-end"
                                        title="Modifier cette slide"
                                    >
                                        <i className="bi bi-pencil-square fs-4"></i>
                                    </Link>
                                    <button 
                                        className="btn btn-link text-danger" 
                                        title="Supprimer cette slide"
                                        onClick={() => {
                                            if(confirm('Supprimer cette image du carrousel ?')) {
                                                console.log('Suppression demandée pour ID:', slide.id);
                                            }
                                        }}
                                    >
                                        <i className="bi bi-trash fs-4"></i>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Légendes artistiques (Captions) */}
                        {(slide.title || slide.description) && (
                            <div className="carousel-caption d-none d-md-block p-4 rounded-4" style={{ background: 'rgba(26, 28, 32, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(153, 51, 255, 0.3)' }}>
                                <h5 className="fw-bold text-info mb-2" style={{ fontFamily: 'Charmonman, cursive', fontSize: '1.8rem' }}>
                                    {slide.title}
                                </h5>
                                <p className="mb-0 text-white" style={{ fontFamily: 'Charm, sans-serif', fontSize: '1.2rem' }}>
                                    {slide.description}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Boutons de navigation (Design personnalisé) */}
            <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
                <span className="bg-dark rounded-circle p-3 d-flex align-items-center justify-content-center shadow" style={{ width: '50px', height: '50px' }}>
                    <i className="bi bi-chevron-left text-info fs-3"></i>
                </span>
                <span className="visually-hidden">Précédent</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
                <span className="bg-dark rounded-circle p-3 d-flex align-items-center justify-content-center shadow" style={{ width: '50px', height: '50px' }}>
                    <i className="bi bi-chevron-right text-info fs-3"></i>
                </span>
                <span className="visually-hidden">Suivant</span>
            </button>
        </div>
    );
};

export default Carousel;