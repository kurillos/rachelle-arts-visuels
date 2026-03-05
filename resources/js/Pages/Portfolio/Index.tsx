import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
// @ts-ignore
import { route } from 'ziggy-js';

interface Props {
    images: any[];
    categories: any[];
    tags: any[];
    activeCategoryId: string | number;
}

export default function Index({ images, categories, tags, activeCategoryId }: Props) {
    const [selectedCategory, setSelectedCategory] = useState(activeCategoryId);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    // 1. Identification de la catégorie actuelle pour le titre et le SEO
    const currentCategory = useMemo(() => 
        categories.find(c => c.id === Number(selectedCategory)), 
    [categories, selectedCategory]);

    const categoryName = currentCategory?.name || "Portfolio";

    // 2. Détection du mode (Photo ou Graphisme) pour l'affichage des filtres
    const isPhotography = categoryName.toLowerCase().includes('photo');

    const toggleTag = (tagId: number) => {
        setSelectedTags(prev => prev.includes(tagId) ? [] : [tagId]);
    };

    // 3. Filtrage des images selon la catégorie et les tags sélectionnés
    const filteredImages = useMemo(() => {
    return images.filter((img: any) => {
        // 1. FILTRAGE PAR CATÉGORIE (Strict)
        // On convertit les deux côtés en Number pour éviter les erreurs de type (string vs int)
        const matchCategory = Number(img.category_id) === Number(activeCategoryId);

        // 2. FILTRAGE PAR TAGS (Optionnel)
        // On ne filtre par tag que si un tag est sélectionné, sinon on laisse passer
        const matchTags = selectedTags.length === 0 
            ? true 
            : img.tags?.some((t: any) => selectedTags.includes(t.id));

        return matchCategory && matchTags;
    });
}, [activeCategoryId, selectedTags, images]);

    // 4. Extraction des tags disponibles uniquement pour cette catégorie
    const availableTags = useMemo(() => {
        const categoryImages = images.filter(img => 
            !selectedCategory || selectedCategory === 'all' || img.category_id === Number(selectedCategory)
        );
        const uniqueTagsMap = new Map();
        categoryImages.forEach(img => {
            img.tags?.forEach((t: any) => {
                if (!uniqueTagsMap.has(t.id)) uniqueTagsMap.set(t.id, t);
            });
        });
        return Array.from(uniqueTagsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [selectedCategory, images]);

    const slides = filteredImages.map((img) => ({ src: img.full_url, title: img.title }));

    return (
        <GuestLayout>
            <Head title={`${categoryName} | Rachelle Arts Visuels`} />

            <div className="container py-5 mt-5">
                {/* FIL D'ARIANE */}
                <nav className="mb-4 opacity-50 small">
                    <Link href="/" className="text-dark text-decoration-none">Accueil</Link>
                    <ChevronRight size={12} className="mx-2" />
                    <span className="text-purple fw-bold">Portfolio</span>
                    <ChevronRight size={12} className="mx-2" />
                    <span className="text-muted">{categoryName}</span>
                </nav>

                {/* HEADER DYNAMIQUE */}
                <header className="text-center mb-5">
                    <h1 className="admin-title-cursive display-3 text-purple mb-3">
                        {categoryName}
                    </h1>
                    <div className="mx-auto bg-purple opacity-25" style={{ height: '2px', width: '80px' }}></div>
                </header>

                {/* FILTRES (TAGS) - Masqués si pas de photographie */}
                <AnimatePresence>
                    {isPhotography && availableTags.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -10 }} 
                            className="mb-5 text-center"
                        >
                            <div className="d-flex justify-content-center flex-wrap gap-4">
                                <button 
                                    onClick={() => setSelectedTags([])} 
                                    className={`btn-filter-custom ${selectedTags.length === 0 ? 'active' : ''}`}
                                >
                                    Tous les univers
                                </button>
                                {availableTags.map((tag) => (
                                    <button 
                                        key={tag.id} 
                                        onClick={() => toggleTag(tag.id)} 
                                        className={`btn-filter-custom ${selectedTags.includes(tag.id) ? 'active' : ''}`}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* GRILLE MASONRY UNIVERSELLE */}
                <div className="masonry-container">
                    <AnimatePresence mode="popLayout">
                        {filteredImages.length > 0 ? (
                            filteredImages.map((img, i) => (
                                <motion.div 
                                    key={img.id} 
                                    layout 
                                    initial={{ opacity: 0, scale: 0.9 }} 
                                    animate={{ opacity: 1, scale: 1 }} 
                                    exit={{ opacity: 0, scale: 0.9 }} 
                                    transition={{ duration: 0.3 }}
                                    className="masonry-brick"
                                >
                                    <div className="portfolio-img-card shadow-sm position-relative overflow-hidden rounded-3">
                                        <img 
                                            src={img.full_url} 
                                            alt={img.title} 
                                            onClick={() => { setIndex(i); setOpen(true); }} 
                                            className="cursor-zoom-in img-fluid w-100 h-100 object-fit-cover"
                                            style={{ transition: 'transform 0.5s ease' }}
                                        />
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                className="text-center py-5 w-100"
                            >
                                <p className="text-muted italic">Cette galerie est en cours de préparation...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* LIGHTBOX (ZOOM) */}
            <Lightbox 
                open={open} 
                close={() => setOpen(false)} 
                index={index} 
                slides={slides} 
                styles={{ container: { backgroundColor: "rgba(0, 0, 0, .9)" } }}
            />
        </GuestLayout>
    );
}