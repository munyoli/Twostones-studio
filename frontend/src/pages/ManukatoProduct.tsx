import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ChevronLeft, ShoppingBag, Sparkles } from 'lucide-react';
import ResponsiveImage from '../components/ResponsiveImage';
import { useCart } from '../features/cart/context/CartContext';
import { API_BASE_URL } from '../services/api';

interface ManukatoItem {
    id: number;
    brandName: string;
    imagePath: string;
    description: string;
    stylingTips: string;
    price: string;
}

// Handle both absolute Supabase URLs and legacy relative paths
const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
};

const ManukatoProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const { data: item, isLoading } = useQuery({
        queryKey: ['manukato-item', id],
        queryFn: async () => {
            const response = await axios.get(`${API_BASE_URL}/api/collection/manukato/${id}`);
            return response.data as ManukatoItem;
        }
    });

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg">
            <div className="animate-pulse text-brand-secondary font-serif text-2xl tracking-widest uppercase">
                Revealing...
            </div>
        </div>
    );

    if (!item) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg">
            <h1 className="text-2xl font-serif text-brand-primary mb-4">Garment Not Found</h1>
            <Link to="/collection/manukato" className="text-brand-secondary underline">Return to Collection</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-brand-bg pb-20">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <Link to="/collection/manukato" className="flex items-center gap-2 text-stone-400 hover:text-brand-secondary transition-colors uppercase tracking-widest text-xs font-bold mb-12">
                    <ChevronLeft size={16} /> Back to Collection
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
                    {/* Image Section */}
                    <div className="relative group">
                        <div className="aspect-[3/4] overflow-hidden bg-white shadow-2xl">
                            <ResponsiveImage
                                src={getImageUrl(item.imagePath)}
                                alt={item.brandName}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col justify-center">
                        <h2 className="text-xs uppercase tracking-[0.4em] text-brand-secondary mb-4 font-bold">The Manukato Series</h2>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-brand-primary mb-6 leading-tight uppercase">
                            {item.brandName}
                        </h1>

                        <p className="text-2xl font-serif text-brand-primary mb-8 tracking-widest">
                            KES {parseFloat(item.price).toLocaleString()}
                        </p>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-3">Spirit of Excellence</h3>
                                <p className="text-stone-600 font-light leading-loose text-lg italic">
                                    "{item.description}"
                                </p>
                            </div>

                            <div className="bg-white p-8 border-l-4 border-brand-secondary shadow-sm">
                                <h3 className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-brand-primary mb-4">
                                    <Sparkles size={16} className="text-brand-secondary" /> Styling Suggestions
                                </h3>
                                <p className="text-stone-600 font-light leading-relaxed">
                                    {item.stylingTips}
                                </p>
                            </div>

                            <button
                                onClick={async () => {
                                    const productToAdd = {
                                        id: `m-${id}`,
                                        name: item.brandName,
                                        price: parseFloat(item.price),
                                        images: [{ image_url: item.imagePath, is_primary: true }]
                                    };
                                    await addToCart(productToAdd);
                                    navigate('/cart');
                                }}
                                className="w-full py-5 bg-brand-primary text-white uppercase tracking-[0.3em] font-bold text-xs hover:bg-brand-accent transition-all duration-500 shadow-lg flex items-center justify-center gap-3 group"
                            >
                                <ShoppingBag size={18} className="group-hover:rotate-12 transition-transform" />
                                Add to Bag
                            </button>
                        </div>

                        <div className="mt-16 pt-12 border-t border-stone-100 grid grid-cols-2 gap-8 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400">
                            <div>
                                <p className="text-brand-primary mb-1">Purposeful Design</p>
                                <p>Refined & Modest</p>
                            </div>
                            <div>
                                <p className="text-brand-primary mb-1">Biblical Identity</p>
                                <p>Rooted in Wholeness</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManukatoProduct;
