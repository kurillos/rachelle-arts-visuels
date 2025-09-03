import React from 'react';
import Navbar from '@/Components/Custom/Navbar';
import Footer from '@/Components/Custom/Footer';
import { usePage } from '@inertiajs/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;
    const LogoUrl = '/get-image/final_logo_moi.png';
    const InstagramUrl = '/get-image/instagram.png';

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Navbar logoUrl={logoUrl} />

            {/* Contenu de la page */}
            <main className="flex-grow">
                {children}
            </main>

            <Footer instagramUrl={InstagramUrl} />
        </div>
    );
}