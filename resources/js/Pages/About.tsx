import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';

export default function About() {
    return (
        <PublicLayout>
            <Head title="Mon Histoire" />
            
            <div className="container main-container-about my-5">
                <div className="row align-items-center justify-content-center">
                    
                    {/* COLONNE GAUCHE : LA PHOTO */}
                    <div className="col-md-5 d-flex justify-content-center mb-5 mb-md-0">
                        <div className="about-img-container shadow-lg">
                            <img src="../images/moi.jpg" alt="Rachelle" className="about-img" />
                        </div>
                    </div>

                    {/* COLONNE DROITE : LE BLOC DE TEXTE GLOBAL */}
                    <div className="col-md-7">
                        <div className="about-content-wrapper text-center">
                            
                            {/* 1. SECTION : QUI JE SUIS */}
                            <div className="mb-4">
                                <h2 className="title-underline">Qui je suis ?</h2>
                                <p className="about-intro-text mt-3">
                                    Avant tout, une passionnée de photos et de créations, diplômée de photos et de graphisme. 
                                    J'ai élargi mes services afin de donner naissance à votre projet.
                                </p>
                            </div>

                            {/* 2. LE HERO (SLOGAN CYAN) */}
                            <div className="slogan p-3 mb-4">
                                <strong>Je serai à l'écoute de vos besoins afin que votre projet soit le plus proche de vos attentes.</strong>
                            </div>

                            {/* 3. SECTION : PRÉSENTATION */}
                            <div className="presentation-block">
                                <h3 className="mb-3" style={{ fontFamily: 'Charm', fontWeight: 'bold' }}>Présentation...</h3>
                                <p>Un projet ? Et si vous me faisiez confiance dès le début ?</p>
                                <p>Nous pouvons le réaliser ensemble : un mariage de prévu ? Nous pouvons vous photographier pour des invitations inoubliables.</p>
                                <p>Un projet professionnel ? Un packaging, un logo, une charte graphique, etc...</p>
                                <p className="mt-3"><em>Alors n'hésitez plus et contactez-moi pour pouvoir échanger ensemble !</em></p>
                            </div>

                            {/* 4. LE BOUTON */}
                            <div className="mt-5">
                                <a href="/contact" className="btn-contact-container text-decoration-none">
                                    Prendre contact dès maintenant
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}