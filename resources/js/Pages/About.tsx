import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Typage pour le composant About
interface AuthUser {
    id: number;
    name: string;
    email: string;
}

interface AboutProps {
    auth: {
        user: AuthUser;
    };
}

export default function About({ auth }: AboutProps) {
    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="À Propos" />
            <main className="main-container-about justify-content">
                <img src="/images/moi.jpg" alt="Rachelle" className="about-img"></img>

                <div className="about-container">
                    <h1 className="title-underline">Qui je suis ?</h1>
                    <p className="about-title">Avant tout, une passionnée de photos et de créations, diplômée de photos et de grapisme.<br />
                        j'ai élargi mes services afin de donner naissance à votre projet.
                    </p>
                    <div className="hero-about">
                        <div className="about-presentation">
                            <p className="slogan">Je serai à l'écoute de vos besoins afin que votre projet soit le plus proche de vos attentes.</p>
                            <h2 className="h2-about">Présentation...</h2>
                            <p>Un projet ? Et si vous me faisiez confiance dès le début ?<br />
                                Nous pouvons le réaliser ensemble : un mariage de prévu ? Nous pouvons vous photographier pour des invitations inoubliables.<br />
                                un projet professionnel ? un packaging, un logo, une charte graphique; etc...<br />
                                Je serai à votre écoute, afin de mener à bien ce projet qui vous tient à coeur.<br />
                                Alors n'hésitez plus et contactez-moi pour pouvoir échanger ensemble !
                            </p>
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-12 text-center">
                            <Link href={route('contact')} className="btn-contact-link">Prendre contact dès maintenant</Link>
                        </div>
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
