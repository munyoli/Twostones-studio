import { Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Portfolio = () => {
    const categories = [
        {
            id: 'rtw',
            title: 'Ready-to-Wear',
            description: 'Casual and luxury collections designed for everyday confidence. Pieces that move with you, honoring the rhythm of your life.',
            image: 'https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/Aria%20Jumpsuit.webp',
            link: '/collection/manukato'
        },
        {
            id: 'mens',
            title: 'Men\'s Bespoke',
            description: 'Tailored pieces crafted for elegance, confidence, and individuality. A tribute to the strength and distinct character of the modern man.',
            image: 'https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/portfolio/mens.png',
            link: '/contact'
        },
        {
            id: 'bridal',
            title: 'Bridal',
            description: 'Intentionally designed garments celebrating love, identity, and beauty. Weaving your unique story into every stitch of your most sacred day.',
            image: 'https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/portfolio/bridal.png',
            link: '/contact'
        },
        {
            id: 'custom',
            title: 'Custom Outfits',
            description: 'Fully personalized creations, honoring each client\'s story, body, and confidence. A collaborative journey to manifest your truest self in fabric.',
            image: 'https://qsljrajbpktbfkrfzlxf.supabase.co/storage/v1/object/public/manukato/Favour%20Dress.webp',
            link: '/contact'
        }
    ];

    return (
        <div className="min-h-screen bg-brand-bg pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-24 text-center animate-fade-in">
                    <h2 className="text-xs uppercase tracking-[0.6em] text-brand-secondary mb-4 font-bold">The Twostones Gallery</h2>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-primary mb-6">Wholeness in Motion.</h1>
                    <p className="max-w-2xl mx-auto text-stone-500 font-light leading-relaxed italic">
                        "Becoming what was always intended." — A curated display of purposeful luxury and bespoke craftsmanship.
                    </p>
                    <div className="mt-12 h-px w-24 bg-brand-secondary/30 mx-auto"></div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                    {categories.map((category) => (
                        <div key={category.id} className="group cursor-pointer">
                            <div className="aspect-[3/4] overflow-hidden mb-8 relative bg-stone-100">
                                {category.image ? (
                                    <img
                                        src={category.image}
                                        alt={category.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-stone-200 flex items-center justify-center text-stone-400 font-serif text-xl italic group-hover:bg-stone-300 transition-colors duration-700">
                                        {category.title} Image
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700"></div>
                            </div>

                            <div className="text-center max-w-md mx-auto">
                                <h3 className="text-2xl font-serif font-bold text-brand-primary mb-4 group-hover:text-brand-secondary transition-colors">
                                    {category.title}
                                </h3>
                                <p className="text-stone-500 font-light leading-relaxed mb-6">
                                    {category.description}
                                </p>
                                <Link
                                    to={category.link}
                                    className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-primary group-hover:gap-4 transition-all"
                                >
                                    Explore <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-32 bg-stone-50 p-12 md:p-24 text-center rounded-sm">
                    <Sparkles size={32} className="text-brand-secondary mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary mb-6">
                        Your Story, Tailored.
                    </h2>
                    <p className="text-stone-500 max-w-2xl mx-auto mb-12 leading-relaxed text-lg font-light">
                        Every garment is an invitation to wholeness. Whether it is a ready-to-wear piece or a custom creation, we are honored to be part of your journey.
                    </p>
                    <Link to="/contact" className="btn-primary inline-flex items-center gap-3">
                        Start Your Consultation <MessageCircle size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
