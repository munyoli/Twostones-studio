import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import ResponsiveImage from '../components/ResponsiveImage';

interface ManukatoItem {
    id: number;
    brandName: string;
    imagePath: string;
    description: string;
    price: string;
}

const Portfolio = () => {
    const { data: rtws, isLoading } = useQuery({
        queryKey: ['manukato-collection-portfolio'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:5000/api/collection/manukato');
            return response.data as ManukatoItem[];
        }
    });

    return (
        <div className="min-h-screen bg-brand-bg pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="mb-24 text-center animate-fade-in">
                    <h2 className="text-xs uppercase tracking-[0.6em] text-brand-secondary mb-4 font-bold">The Twostones Gallery</h2>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-primary mb-6">Identity in Thread</h1>
                    <p className="max-w-2xl mx-auto text-stone-500 font-light leading-relaxed italic">
                        "Becoming what was always intended." — A curated display of purposeful luxury and bespoke craftsmanship.
                    </p>
                    <div className="mt-12 h-px w-24 bg-brand-secondary/30 mx-auto"></div>
                </header>

                {/* Ready-to-Wear Section */}
                <section className="mb-32">
                    <div className="flex items-end justify-between mb-12 border-b border-stone-100 pb-8">
                        <div>
                            <h3 className="text-3xl font-serif font-bold text-brand-primary mb-2">Ready-to-Wear</h3>
                            <p className="text-stone-400 uppercase tracking-widest text-[10px] font-bold">The Manukato Series</p>
                        </div>
                        <Link to="/collection/manukato" className="text-brand-secondary text-xs uppercase tracking-widest font-bold flex items-center gap-2 hover:translate-x-1 transition-transform">
                            View Collection <ArrowRight size={14} />
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="aspect-[3/4] bg-stone-100 animate-pulse rounded-sm"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {rtws?.slice(0, 6).map((item, idx) => (
                                <div
                                    key={item.id}
                                    className="group animate-fade-in"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <div className="aspect-[3/4] overflow-hidden mb-6 luxury-card cursor-pointer relative">
                                        <ResponsiveImage
                                            src={`http://localhost:5000${item.imagePath}`}
                                            alt={item.brandName}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </div>
                                    <h4 className="text-sm uppercase tracking-[0.2em] font-bold text-brand-primary text-center">
                                        {item.brandName}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Custom Creations Section */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-brand-primary pointer-events-none opacity-[0.02]"></div>

                    <div className="bg-white border border-stone-100 rounded-3xl p-12 md:p-24 relative overflow-hidden transition-all duration-700 hover:shadow-2xl hover:border-brand-secondary/20">
                        {/* Abstract Background pattern decoration */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-2xl -ml-32 -mb-32"></div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8 relative z-10">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-bg border border-brand-secondary/20 rounded-full text-brand-secondary text-[10px] uppercase tracking-widest font-bold">
                                    <Sparkles size={14} /> Bespoke Experience
                                </div>

                                <h3 className="text-4xl md:text-6xl font-serif font-bold text-brand-primary leading-tight">
                                    Custom <br /> Creations
                                </h3>

                                <p className="text-stone-500 text-lg leading-loose font-light">
                                    "Your story, uniquely tailored." We believe every individual carries a divine blueprint. Our custom service is an invitation to translate that blueprint into fabric. From choice of material to the precision of fit, we co-create with you.
                                </p>

                                <div className="space-y-4 pt-4 text-sm text-stone-600 font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary"></div>
                                        <span>Personalized Design Consultations</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary"></div>
                                        <span>Curated Fabric Selection</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary"></div>
                                        <span>Precision African Tailoring</span>
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <Link
                                        to="/contact"
                                        className="btn-primary flex items-center justify-center gap-3 w-full md:w-auto md:px-12 group"
                                    >
                                        Request Your Custom Outfit
                                        <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 relative">
                                {/* Abstract Luxury Placeholders */}
                                <div className="aspect-[3/4] rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center p-8 overflow-hidden group/item relative">
                                    <div className="absolute inset-0 opacity-10 group-hover/item:opacity-20 transition-opacity">
                                        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            <defs>
                                                <pattern id="pattern1" width="10" height="10" patternUnits="userSpaceOnUse">
                                                    <path d="M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9" stroke="#c5a059" strokeWidth="0.5" />
                                                </pattern>
                                            </defs>
                                            <rect width="100%" height="100%" fill="url(#pattern1)" />
                                        </svg>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-secondary border-b border-brand-secondary/30 pb-2">Bespoke Fit</span>
                                </div>

                                <div className="aspect-[3/4] rounded-2xl bg-brand-primary text-white flex items-center justify-center p-8 overflow-hidden group/item relative mt-12">
                                    <div className="absolute inset-0 opacity-10 group-hover/item:opacity-20 transition-opacity">
                                        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            <path d="M0,50 Q25,25 50,50 T100,50" fill="none" stroke="white" strokeWidth="2" />
                                            <path d="M0,60 Q25,35 50,60 T100,60" fill="none" stroke="white" strokeWidth="1" opacity="0.5" />
                                        </svg>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-secondary border-b border-brand-secondary/30 pb-2 text-center">Faith-Inspired <br />Silhouettes</span>
                                </div>

                                <div className="aspect-[3/4] rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center p-8 overflow-hidden group/item relative -mt-6">
                                    <div className="absolute inset-0 opacity-20 group-hover/item:opacity-30 transition-opacity">
                                        <svg width="100%" height="100%" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="40" fill="none" stroke="#2d2926" strokeWidth="0.5" strokeDasharray="4 4" />
                                            <circle cx="50" cy="50" r="30" fill="none" stroke="#2d2926" strokeWidth="0.5" />
                                        </svg>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-stone-500 border-b border-stone-300 pb-2">Unique Selection</span>
                                </div>

                                <div className="aspect-[3/4] rounded-2xl bg-brand-bg border border-brand-secondary/20 flex items-center justify-center p-8 overflow-hidden shadow-sm group/item relative mt-6 hover:scale-105 transition-transform duration-500">
                                    <div className="absolute inset-0 opacity-10 group-hover/item:opacity-20 transition-opacity">
                                        <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-secondary/40 via-transparent to-transparent"></div>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-secondary border-b border-brand-secondary/30 pb-2">African Artisanal</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Portfolio;
