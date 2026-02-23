import { useQuery } from '@tanstack/react-query';
import { productApi, BASE_URL } from '../services/api';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const ProductList = () => {
    const { data: products, isLoading: productsLoading, isError: productsError } = useQuery({
        queryKey: ['products'],
        queryFn: () => productApi.getAll().then(res => res.data),
    });

    const { data: regularProducts, isLoading: itemsLoading, isError: manukatoError } = useQuery({
        queryKey: ['manukato-items-shop'],
        queryFn: async () => {
            const response = await axios.get(`${BASE_URL} /api/collection / manukato`);
            return response.data;
        }
    });

    const isLoading = productsLoading || itemsLoading;
    const isError = productsError || manukatoError;

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 rounded-full border-2 border-brand-secondary border-t-transparent animate-spin mb-4" />
                <p className="text-stone-400 uppercase tracking-widest text-xs">Unveiling our collection...</p>
            </div>
        </div>
    );

    if (isError) return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center">
            <p className="text-brand-accent">Error loading the collection. Please try again later.</p>
        </div>
    );

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <header className="mb-16 text-center">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-primary mb-4 tracking-tight">The Collection</h1>
                <p className="text-stone-500 italic">Elegance rooted in heritage and faith.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {[...(products || []), ...(regularProducts || [])
                    .filter((m: any) => m.showInShop !== false) // Filter out group shots
                    .map((m: any) => ({
                        id: `m - ${m.id} `,
                        name: m.brandName,
                        price: m.price,
                        images: [{ image_url: m.imagePath, is_primary: true }],
                        category: { name: 'Manukato RTW' },
                        isManukato: true
                    }))].map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
            </div>
        </div>
    );
};

export default ProductList;
