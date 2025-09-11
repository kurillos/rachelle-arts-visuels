import React from 'react';

export default function Carousel({ carousels, auth }) {
    const carouselId = "carouselHomepage";

    const carouselData = Array.isArray(carousels) ? carousels : [];

    return (
        <div id={carouselId} className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
                {carouselData.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        data-bs-target={`#${carouselId}`}
                        data-bs-slide-to={index}
                        className={index === 0 ? 'active' : ''}
                        aria-current={index === 0 ? 'true' : 'false'}
                        aria-label={`Slide ${index + 1}`}
                    ></button>
                ))}
            </div>
            <div className="carousel-inner">
                {carouselData.map((carousel, index) => (
                    <div key={carousel.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                        <div className="carousel-image-container">
                            <img src={`/storage/${carousel.image_path}`} className="d-block w-100" alt={carousel.title} />
                            {auth.user && (
                                <div className="carousel-overlay">
                                    <button className="btn" title="Ajouter une slide">
                                        <i className="bi bi-plus-circle"></i>
                                    </button>
                                    <button className="btn" title="Supprimer la slide">
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
