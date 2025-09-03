import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Custom/Navbar';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Rachelle Arts Visuels" />
            <Navbar auth={auth} />
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
                <div className="container text-center">
                    <h1 className="display-4 font-weight-bolder text-primary font-family-charm">Et si vous me faisiez confiance dès le début ?</h1>
                </div>
            </div>
        </>
    );
}
