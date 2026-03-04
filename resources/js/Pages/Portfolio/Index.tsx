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

    const toggleTag = (tagId: number) => {
        setSelectedTags(prev => prev.includes(tagId) ? [] : [tagId]);
    };

    const filteredImages = useMemo(() => {
        return images.filter((img: any) => {
            const matchCategory = !selectedCategory || selectedCategory === 'all' || img.category_id === Number(selectedCategory);
            const matchTags = selectedTags.length === 0 || img.tags.some((t: any) => t.id === selectedTags[0]);
            return matchCategory && matchTags;
        });
    }, [selectedCategory, selectedTags, images]);

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
    const isPhotography = categories.find(c => c.id === Number(selectedCategory))?.name.toLowerCase().includes('photo');

    return (
        <GuestLayout>
            <Head title="Portfolio | Rachelle Arts Visuels" />

            <div className="container py-5 mt-5">
                <nav className="mb-4 opacity-50 small">
                    <Link href="/" className="text-dark text-decoration-none">Accueil</Link>
                    <ChevronRight size={12} className="mx-2" />
                    <span className="text-purple fw-bold">Portfolio</span>
                </nav>

                <header className="text-center mb-5">
                    <h1 className="admin-title-cursive display-3 text-purple mb-3">Mise en lumière</h1>
                </header>

                <AnimatePresence>
                    {isPhotography && availableTags.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-5 text-center">
                            <div className="d-flex justify-content-center flex-wrap gap-4">
                                <button onClick={() => setSelectedTags([])} className={`btn-filter-custom ${selectedTags.length === 0 ? 'active' : ''}`}>Tous</button>
                                {availableTags.map((tag) => (
                                    <button key={tag.id} onClick={() => toggleTag(tag.id)} className={`btn-filter-custom ${selectedTags.includes(tag.id) ? 'active' : ''}`}>{tag.name}</button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="masonry-container">
                    <AnimatePresence mode="popLayout">
                        {filteredImages.map((img, i) => (
                            <motion.div key={img.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="masonry-brick">
                                <div className="portfolio-img-card shadow-sm position-relative">
                                    <img src={img.full_url} alt={img.title} onClick={() => { setIndex(i); setOpen(true); }} className="cursor-zoom-in" />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <Lightbox open={open} close={() => setOpen(false)} index={index} slides={slides} />
        </GuestLayout>
    );
}