import { useCart } from '../context/CartContext';
import { useAuth } from '../../auth/context/AuthContext';
import { Trash2 } from 'lucide-react';
import { API_BASE_URL } from '../../../services/api';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const navigate = useNavigate();
    const { items, total, removeFromCart } = useCart();
    const { user } = useAuth();

    console.log('[Cart Page] Items:', items);
    console.log('[Cart Page] Total:', total);

    const handleCheckout = () => {
        if (!user) {
            alert('Please login to checkout');
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    if (items.length === 0) return (
        <div className="min-h-screen pt-40 px-6 flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-serif font-bold mb-4 text-stone-300 uppercase tracking-widest">Your Bag is Empty</h1>
            <p className="text-stone-500 mb-8 max-w-md">Discover pieces that speak your truth in our collection.</p>
            <button onClick={() => window.location.href = '/shop'} className="btn-primary">Explore Shop</button>
        </div>
    );

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
            <header className="mb-12 border-b border-stone-100 pb-8">
                <h1 className="text-4xl font-serif font-bold text-brand-primary tracking-tight">Your Bag</h1>
            </header>

            <div className="space-y-8">
                {items.map((item) => {
                    // Defensive checks
                    if (!item || !item.product) {
                        console.error('[Cart] Invalid item:', item);
                        return null;
                    }

                    const imageUrl = item.product.images?.[0]?.image_url || 'https://via.placeholder.com/400x600';
                    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`;

                    return (
                        <div key={item.id} className="flex gap-6 items-center">
                            <div className="w-24 h-32 flex-shrink-0 bg-stone-100 overflow-hidden">
                                <img src={fullImageUrl} alt={item.product.name || 'Product'} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-serif font-medium text-lg">{item.product.name || 'Unknown Product'}</h3>
                                <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">Quantity: {item.quantity || 1}</p>
                                <p className="font-medium mt-2">KES {Number(item.product.price || 0).toLocaleString()}</p>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-2 text-stone-400 hover:text-brand-accent transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="mt-16 bg-stone-50 p-8 flex flex-col items-center md:items-end">
                <div className="flex justify-between w-full max-w-md mb-8 pb-4 border-b border-stone-200">
                    <span className="text-stone-500 uppercase tracking-widest text-sm font-medium">Total</span>
                    <span className="text-2xl font-serif font-bold text-brand-primary">KES {total.toLocaleString()}</span>
                </div>

                <button
                    onClick={handleCheckout}
                    className="w-full max-w-md btn-primary"
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;
