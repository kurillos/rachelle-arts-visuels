import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import Navbar from '@/Components/Custom/Navbar';
import Footer from '@/Components/Custom/Footer';
import React, { PropsWithChildren } from 'react';

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-vh-100 d-flex flex-column">
            <Navbar />
            <main className="flex-grow-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
