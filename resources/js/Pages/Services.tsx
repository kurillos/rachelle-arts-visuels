import React from 'react';
import { Head, Link } from '@inertiajs/react';
import Navbar from '@/Components/custom/Navbar';
import Footer from '@/Components/custom/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

interface Service {
    title: string;
    description: string;
    image: string;
}

const servicesData = [
    {
        title: "Photographie",
        description: "Réalisation et capture de vos moments magiques. Pour un mariage, un anniversaire ou tout simplement capturer vos amis à quatre pattes, immortalisons ensemble ce moment.",
        image: "/images/services/photographie.jpeg"
    },
    {
        title: "faire-part",
        description: "Pour un évenement qui vous correspond et qui vous ressemble. Je vous aide à confectionner vos faire-part.",
        image: "/images/services/faire_part.jpeg"
    },
    {
        title: "Logo et graphisme",
        description: "Création de votre logo d'entreprise décliné sur les supports de votre choix.",
        image: "/images/services/service_logo.jpeg"
    },
    {
        title: "Mise en page",
        description: "Pour embellir vos impressions par une mise en page qui vous correspond. Je vous propose des trames et documents sur-mesure afin de refléter vos valeurs.",
        image: "/images/services/mise_en_page.jpeg"
    },
    {
        title: "Packaging",
        description: "Une personnalisation de vos emballages en lien avec votre évenement, soit personnel ou professionel, vous ferez forte impression !",
        image: "/images/services/service_packaging.jpeg"
    },
];

const Services: React.FC = () => {
    return (
    <div className="page-container">
        <Head title="Services" />
        <Navbar />
        <main className="main-container-services">
            <div className="services-hero text-center">
                <h1 className="title-underline-services">Services</h1>
            </div>
            <div className="container container-card-services">
                <div className="row">
                    {servicesData.map((service, index) => (
                        <div key={index} className="col-12 col-md-4">
                            <div className="card">
                                <img src={service.image} alt={`service_${service.title.toLowerCase().replace(/\s+/g, '_')}`} className="card-img-top" />
                                <div className="card-body">
                                    <h5 className="card-title card-title-services"><b>{service.title}</b></h5>
                                    <p className="card-text" dangerouslySetInnerHTML={{__html: service.description }}></p>
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

export default Services;