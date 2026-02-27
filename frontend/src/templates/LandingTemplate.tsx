import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../services/api';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import ResponsiveImage from '../components/ResponsiveImage';

interface ManukatoItem {
    id: number;
    brandName: string;
    imagePath: string;
}

interface LandingTemplateProps {
    heroImages: ManukatoItem[];
}

const LandingTemplate: React.FC<LandingTemplateProps> = ({ heroImages }) => {
    return (
        <div className="min-h-screen bg-brand-bg">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center overflow-hidden">
                {/* Background Image Grid */}
                <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-3 opacity-40">
                    {heroImages.map((image, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 2, delay: i * 0.4 }}
                            className="relative h-full overflow-hidden"
                        >
                            <ResponsiveImage
                                src={image.imagePath.startsWith('http') ? image.imagePath : `${API_BASE_URL}${image.imagePath}`}
                                alt="Luxury Heritage"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                        </motion.div>
                    ))}
                    {heroImages.length === 0 && (
                        <div className="absolute inset-0 bg-stone-200 animate-pulse"></div>
                    )}
                </div>

                <div className="relative max-w-7xl mx-auto px-6 text-center z-10 w-full">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-[10px] md:text-xs uppercase tracking-[0.8em] text-brand-secondary mb-6 font-bold"
                    >
                        Twostones Luxury Heritage
                    </motion.h2>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-5xl md:text-9xl font-serif font-bold text-brand-primary mb-8 leading-tight uppercase"
                    >
                        Crafted for <br />
                        <span className="text-brand-secondary italic">Wholeness.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-base md:text-xl text-stone-600 max-w-2xl mx-auto mb-12 font-light leading-relaxed px-4"
                    >
                        A luxury experience merging the discipline of African craftsmanship with the pursuit of inner peace and dignity. Explore the Manukato RTW series.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 px-10 sm:px-0"
                    >
                        <Link to="/collection/manukato" className="btn-primary flex items-center justify-center gap-2 group text-xs md:text-sm">
                            Explore Collection <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/journal" className="px-8 py-4 border border-brand-primary font-medium hover:bg-brand-primary hover:text-white transition-all duration-500 uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-2">
                            <BookOpen size={16} /> Read Journal
                        </Link>
                    </motion.div>
                </div>

                {/* Decorative Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ delay: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
                >
                    <div className="w-px h-12 bg-brand-primary"></div>
                </motion.div>
            </section>

            {/* Featured Section */}
            <section className="py-24 md:py-40 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="space-y-8"
                    >
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-primary leading-tight">
                            Excellence in <br />
                            Every Stitch
                        </h2>
                        <p className="text-stone-500 font-light leading-loose text-base md:text-lg">
                            Twostones exists to honor the dignity of every woman through refined craftsmanship. We believe fashion is a tool for confidence, clarity, and reflecting the beauty of a purposeful life.
                        </p>
                        <Link to="/stylist" className="inline-flex items-center gap-3 text-brand-secondary uppercase tracking-[0.3em] font-bold text-[10px] md:text-xs group">
                            <Sparkles size={16} /> Consult AI Stylist <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="relative"
                    >
                        <div className="aspect-[4/5] bg-stone-100 overflow-hidden shadow-2xl">
                            {heroImages[0] && (
                                <ResponsiveImage
                                    src={heroImages[0].imagePath.startsWith('http') ? heroImages[0].imagePath : `${API_BASE_URL}${heroImages[0].imagePath}`}
                                    alt="Featured"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            )}
                        </div>
                        <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 w-48 h-60 md:w-64 md:h-80 border-4 md:border-8 border-brand-bg bg-stone-200 shadow-xl hidden sm:block overflow-hidden">
                            {heroImages[1] && (
                                <ResponsiveImage
                                    src={heroImages[1].imagePath.startsWith('http') ? heroImages[1].imagePath : `${API_BASE_URL}${heroImages[1].imagePath}`}
                                    alt="Detail"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                    sizes="300px"
                                />
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default LandingTemplate;
