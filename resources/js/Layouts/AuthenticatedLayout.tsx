import React from 'react';
import Navbar from '@/Components/Custom/Navbar';
import Footer from '@/Components/Custom/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function AuthenticatedLayout({ auth, children }) {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar auth={auth} />
            <main className="flex-grow-1">
                {children}
            </main>
            <Footer />
        </div>
    );
}
