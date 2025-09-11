import React from 'react';

export default function Carousel({ carousels }) {
    const carouselId = "carouselExampleIndicators";

    // Assurez-vous que les données du carrousel sont un tableau.
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
                        <img src={`/storage/${carousel.image_path}`} className="d-block w-100" alt={carousel.title} />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>{carousel.title}</h5>
                            <p>{carousel.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            
        </div>
    );
}
