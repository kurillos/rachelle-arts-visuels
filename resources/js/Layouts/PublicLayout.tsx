import React from 'react';
import Navbar from '@/Components/Custom/Navbar';
import Footer from '@/Components/Custom/Footer';

interface Props {
    children: React.ReactNode;
    auth?: any;
}

export default function PublicLayout({ children, auth }: Props) {
    return (
        <div className="public-site">
            <Navbar auth={auth} />
            <main className="main-container">
                {children}
            </main>
            <Footer />
        </div>
    );
}