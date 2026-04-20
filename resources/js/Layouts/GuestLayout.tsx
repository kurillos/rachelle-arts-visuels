import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import Navbar from '@/Components/Custom/Navbar';
import Footer from '@/Components/Custom/Footer';
import React, { PropsWithChildren, useEffect } from 'react';

export default function GuestLayout({ children }: PropsWithChildren) {

    // ⚠️ PROTECTION DÉSACTIVÉE POUR TEST
    // useEffect(() => {
    //     const handleContextMenu = (e: MouseEvent) => {
    //         if (e.button === 2 || e.type === 'contextmenu') {
    //             e.preventDefault();
    //         }
    //     };
    //     const handleKeyDown = (e: KeyboardEvent) => {
    //         if (
    //             e.key === "F12" ||
    //             (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
    //             (e.ctrlKey && (e.key === "u" || e.key === "s" || e.key === "p")) ||
    //             (e.metaKey && (e.key === "p" || e.key === "s"))
    //         ) {
    //             e.preventDefault();
    //             console.warn("🔒 Protection Rachelle Arts active.");
    //             return false;
    //         }
    //     };
    //     document.addEventListener("contextmenu", handleContextMenu, false);
    //     document.addEventListener("keydown", handleKeyDown, false);
    //     return () => {
    //         document.removeEventListener("contextmenu", handleContextMenu, false);
    //         document.removeEventListener("keydown", handleKeyDown, false);
    //     };
    // }, []);

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