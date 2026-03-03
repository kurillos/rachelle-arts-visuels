import React from 'react';
import Navbar from '@/Components/Custom/Navbar';
import Footer from '@/Components/Custom/Footer';

export interface AuthenticatedLayoutProps {
    auth: any;
    children: React.ReactNode;
}

export default function AuthenticatedLayout({ auth, children }: AuthenticatedLayoutProps) {
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