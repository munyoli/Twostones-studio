import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { cartApi } from '../../../services/api';
import { useAuth } from '../../auth/context/AuthContext';

interface CartItem {
    id: number;
    productId: number;
    product: any;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (itemId: number) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const { user } = useAuth();

    const total = items.reduce((sum, item) => {
        if (!item?.product?.price || !item?.quantity) {
            console.warn('[CartContext] Invalid item for total calc:', item);
            return sum;
        }
        const price = parseFloat(String(item.product.price));
        const quantity = parseInt(String(item.quantity));
        if (isNaN(price) || isNaN(quantity)) {
            console.warn('[CartContext] Invalid price/quantity:', { price: item.product.price, quantity: item.quantity });
            return sum;
        }
        return sum + (price * quantity);
    }, 0);

    // Load cart from backend when user logs in
    useEffect(() => {
        if (user) {
            cartApi.getCart()
                .then(res => {
                    const cartItems = res.data.items || [];
                    console.log('[CartContext] Loaded cart items:', cartItems);
                    setItems(cartItems);
                })
                .catch(err => {
                    console.error('Failed to load cart:', err);
                    setItems([]);
                });
        } else {
            setItems([]);
        }
    }, [user]);

    const addToCart = async (product: any) => {
        if (!user) {
            alert('Please login to add items to cart');
            return;
        }

        try {
            await cartApi.addToCart({ productId: product.id, quantity: 1 });
            // Reload cart from backend
            const res = await cartApi.getCart();
            console.log('[CartContext] Cart reloaded:', res.data);
            setItems(res.data.items || []);
            console.log('[CartContext] Items set:', res.data.items);
        } catch (error) {
            console.error('Failed to add to cart:', error);
            alert('Failed to add item to cart');
        }
    };

    const removeFromCart = async (itemId: number) => {
        try {
            await cartApi.removeFromCart(itemId);
            setItems(prev => prev.filter(i => i.id !== itemId));
        } catch (error) {
            console.error('Failed to remove from cart:', error);
        }
    };

    const clearCart = () => setItems([]);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
