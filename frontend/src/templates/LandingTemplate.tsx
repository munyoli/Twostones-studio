import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import ResponsiveImage from '../components/ResponsiveImage'; // Path needs specific check, assuming ../components works if templates are in src/templates

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
                        <div key={i} className="relative h-full overflow-hidden">
                            <ResponsiveImage
                                src={`http://localhost:5000${image.imagePath}`}
                                alt="Luxury Heritage"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                        </div>
                    ))}
                    {heroImages.length === 0 && (
                        <div className="absolute inset-0 bg-stone-200 animate-pulse"></div>
                    )}
                </div>

                <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
                    <h2 className="text-xs uppercase tracking-[0.6em] text-brand-secondary mb-6 font-bold animate-fade-in">
                        Twostones Luxury Heritage
                    </h2>
                    <h1 className="text-6xl md:text-9xl font-serif font-bold text-brand-primary mb-8 leading-tight uppercase">
                        Crafted for <br />
                        <span className="text-brand-secondary italic">Wholeness.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                        A luxury experience merging the discipline of African craftsmanship with the pursuit of inner peace and dignity. Explore the Manukato RTW series.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center gap-6">
                        <Link to="/collection/manukato" className="btn-primary flex items-center justify-center gap-2 group">
                            Explore Collection <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/journal" className="px-8 py-4 border border-brand-primary font-medium hover:bg-brand-primary hover:text-white transition-all duration-500 uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                            <BookOpen size={16} /> Read Journal
                        </Link>
                    </div>
                </div>

                {/* Decorative Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
                    <div className="w-px h-12 bg-brand-primary"></div>
                </div>
            </section>

            {/* Featured Section */}
            <section className="py-32 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                    <div className="space-y-8">
                        <h2 className="text-4xl font-serif font-bold text-brand-primary leading-tight">
                            Excellence in <br />
                            Every Stitch
                        </h2>
                        <p className="text-stone-500 font-light leading-loose">
                            Twostones exists to honor the dignity of every woman through refined craftsmanship. We believe fashion is a tool for confidence, clarity, and reflecting the beauty of a purposeful life.
                        </p>
                        <Link to="/stylist" className="inline-flex items-center gap-3 text-brand-secondary uppercase tracking-[0.3em] font-bold text-xs group">
                            <Sparkles size={16} /> Consult AI Stylist <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="aspect-[4/5] bg-stone-100 overflow-hidden shadow-2xl">
                            {heroImages[0] && (
                                <ResponsiveImage
                                    src={`http://localhost:5000${heroImages[0].imagePath}`}
                                    alt="Featured"
                                    className="w-full h-full object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            )}
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-64 h-80 border-8 border-brand-bg bg-stone-200 shadow-xl hidden lg:block overflow-hidden">
                            {heroImages[1] && (
                                <ResponsiveImage
                                    src={`http://localhost:5000${heroImages[1].imagePath}`}
                                    alt="Detail"
                                    className="w-full h-full object-cover"
                                    sizes="300px"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingTemplate;
