import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/Custom/Navbar';
import Footer from '@/Components/Custom/Footer';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// @ts-ignore
import { route } from 'ziggy-js';

const servicesData = [
    {
        title: "Photographie",
        slug: "photographie",
        description: "Réalisation et capture de vos moments magiques. Pour un mariage, un anniversaire ou tout simplement capturer vos amis à quatre pattes, immortalisons ensemble ce moment.",
        image: "/images/services/photographie.jpeg"
    },
    {
        title: "Faire-part",
        slug: "faire-part",
        description: "Pour un évenement qui vous correspond et qui vous ressemble. Je vous aide à confectionner vos faire-part.",
        image: "/images/services/faire_part.jpeg"
    },
    {
        title: "Logo & Graphisme",
        slug: "logo-graphisme",
        description: "Création de votre logo d'entreprise décliné sur les supports de votre choix.",
        image: "/images/services/service_logo.jpeg"
    },
    {
        title: "Mise en page",
        slug: "mise-en-page",
        description: "Pour embellir vos impressions par une mise en page qui vous correspond. Je vous propose des trames et documents sur-mesure afin de refléter vos valeurs.",
        image: "/images/services/mise_en_page.jpeg"
    },
    {
        title: "Packaging",
        slug: "packaging",
        description: "Une personnalisation de vos emballages en lien avec votre évenement, soit personnel ou professionel, vous ferez forte impression !",
        image: "/images/services/service_packaging.jpeg"
    },
];

const Accompagnements: React.FC = () => {
    return (
        <div className="public-site d-flex flex-column min-vh-100">
            <Head title="Accompagnements" />
            <Navbar />
            
            <main className="flex-grow-1 py-5">
                <div className="services-hero text-center mb-5">
                    <h1 className="title-underline">Accompagnements</h1>
                </div>

                <div className="container">
                    <div className="row g-5 justify-content-center">
                        {servicesData.map((service, index) => (
                            <div key={index} className="col-12 col-md-6 col-lg-4">
                                <div className="card-service shadow-sm h-100">
                                    <div className="image-wrapper p-3">
                                        <img 
                                            src={service.image} 
                                            alt={service.title} 
                                            className="img-fluid rounded-4 shadow-sm" 
                                            style={{ height: '250px', width: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    
                                    <div className="card-body d-flex flex-column align-items-center text-center px-4 pb-4">
                                        <h5 className="card-title-service fw-bold mb-3" style={{ letterSpacing: '1px' }}>
                                            {service.title}
                                        </h5>
                                        <p className="card-text italic mb-4">
                                            {service.description}
                                        </p>
                                        
                                        <Link 
                                            href={route('portfolio.show', { slug: service.slug })} 
                                            className="btn btn-purple rounded-pill px-4 mt-auto"
                                        >
                                            Voir la galerie
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Accompagnements;