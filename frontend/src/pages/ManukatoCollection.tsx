import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../services/api';
import ResponsiveImage from '../components/ResponsiveImage';

interface ManukatoItem {
    id: number;
    brandName: string;
    imagePath: string;
    description: string;
    price: string;
}

const ManukatoCollection = () => {
    const { data: items, isLoading } = useQuery({
        queryKey: ['manukato-items'],
        queryFn: async () => {
            const response = await axios.get(`${BASE_URL}/api/collection/manukato`);
            return response.data;
        },
        refetchInterval: 5000 // Refetch every 5 seconds for live updates
    });

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg">
            <div className="animate-pulse text-brand-secondary font-serif text-2xl tracking-widest">
                Loading The Collection...
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-brand-bg py-20 px-6">
            <section className="max-w-7xl mx-auto mb-20 text-center">
                <h2 className="text-xs uppercase tracking-[0.5em] text-brand-secondary mb-4 font-bold">Crafted For Wholeness</h2>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-primary mb-6">Manukato Collection</h1>
                <p className="max-w-2xl mx-auto text-stone-500 font-light leading-relaxed">
                    A refined expression of biblical identity and African artisanal discipline. Every garment is designed with purpose, modesty, and the pursuit of excellence.
                </p>
                <div className="mt-12 h-px w-24 bg-brand-secondary mx-auto"></div>
            </section>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {items?.map((item: any, index: number) => (
                    <Link
                        key={item.id}
                        to={`/collection/manukato/${item.id}`}
                        className="group relative overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-700 block animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <div className="aspect-[3/4] overflow-hidden">
                            <ResponsiveImage
                                src={`${BASE_URL}${item.imagePath}`}
                                alt={item.brandName}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                        <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="p-8 text-center bg-white relative">
                            <h3 className="text-xl font-serif font-bold text-brand-primary mb-2 tracking-wide uppercase">
                                {item.brandName}
                            </h3>
                            <p className="text-brand-secondary font-serif italic text-sm mb-4">
                                Luxury Ready-To-Wear
                            </p>
                            <div className="h-px w-10 bg-brand-secondary/30 mx-auto group-hover:w-20 transition-all duration-500"></div>
                        </div>
                    </Link>
                ))}
            </div>

            {items?.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-stone-400 font-light italic">The collection is currently being sanctified. Check back soon.</p>
                </div>
            )}
        </div>
    );
};

export default ManukatoCollection;
