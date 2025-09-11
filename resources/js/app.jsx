import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

// Importation des fichiers CSS de Bootstrap et Sass
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../sass/app.scss';

// Le nom de l'application est utilisé pour le titre de la page par défaut
const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

// Initialise l'application Inertia.js
createInertiaApp({
    // Détermine le nom de l'application
    title: (title) => `${title} - ${appName}`,
    
    // Découvre les pages automatiquement dans le dossier 'Pages'
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    
    // Crée le composant racine et le rend dans la page
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    
    // Spécifie l'ID de l'élément HTML où l'application doit être rendue
    progress: {
        color: '#4B5563',
    },
});
