import { Link } from 'react-router-dom';
import { useCart } from '../features/cart/context/CartContext';
import ResponsiveImage from './ResponsiveImage';
import { API_BASE_URL } from '../services/api';

interface Product {
    id: number | string; // Allow both number and string for Manukato items
    name: string;
    price: number;
    images?: { image_url: string; is_primary: boolean }[];
    category?: { name: string };
}

const ProductCard = ({ product }: { product: Product }) => {
    const { addToCart } = useCart();

    // Check if image_url starts with /uploads (from Manukato) or is a primary image from Product
    let primaryImage = 'https://via.placeholder.com/400x600';

    if (product.images && product.images.length > 0) {
        const primary = product.images.find(img => img.is_primary) || product.images[0];
        const imageUrl = primary.image_url;
        primaryImage = imageUrl.startsWith('http')
            ? imageUrl
            : `${API_BASE_URL}${imageUrl}`;
    }

    // Determine the correct link path
    const isManukato = typeof product.id === 'string' && product.id.startsWith('m-');
    const linkPath = isManukato
        ? `/collection/manukato/${String(product.id).substring(2)}`
        : `/product/${product.id}`;

    return (
        <div className="luxury-card group">
            <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                <ResponsiveImage
                    src={primaryImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                <button
                    onClick={() => addToCart(product)}
                    className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm text-brand-primary py-3 text-sm font-medium uppercase tracking-widest opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                >
                    Add to Bag
                </button>
            </div>

            <div className="p-5 text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-1">
                    {product.category?.name || 'Collection'}
                </p>
                <Link to={linkPath}>
                    <h3 className="text-lg font-serif font-medium text-brand-primary hover:text-brand-secondary transition-colors">
                        {product.name}
                    </h3>
                </Link>
                <p className="mt-2 text-stone-600 font-medium">
                    KES {Number(product.price).toLocaleString()}
                </p>
            </div>
        </div>
    );
};

export default ProductCard;
