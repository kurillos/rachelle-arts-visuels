import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import Navbar from '@/Components/Custom/Navbar';
import Footer from '@/Components/Custom/Footer';
import React, { PropsWithChildren, useEffect } from 'react';

export default function GuestLayout({ children }: PropsWithChildren) {
    
    useEffect(() => {
        // 1. Bloquer le clic droit (Mode capture 'true' pour être prioritaire)
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();

        // 2. Bloquer les raccourcis d'inspection et de capture
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === "F12" || 
                (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
                (e.ctrlKey && (e.key === "u" || e.key === "s" || e.key === "p")) ||
                (e.metaKey && (e.key === "p" || e.key === "s")) // Raccourcis Mac (Cmd+P / Cmd+S)
            ) {
                e.preventDefault();
                console.warn("🔒 Protection Rachelle Arts active.");
                return false;
            }
        };

        // On attache au document global
        document.addEventListener("contextmenu", handleContextMenu, true);
        document.addEventListener("keydown", handleKeyDown, true);

        return () => {
            // Nettoyage si on change de page (bonne pratique React)
            document.removeEventListener("contextmenu", handleContextMenu, true);
            document.removeEventListener("keydown", handleKeyDown, true);
        };
    }, []);

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