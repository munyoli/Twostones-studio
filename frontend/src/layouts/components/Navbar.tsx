import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, BookOpen, Sparkles } from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useCart } from '../../features/cart/context/CartContext';

import logo from '../../assets/logo.png';

const Navbar = () => {
    const { user } = useAuth();
    const { items } = useCart();
    const location = useLocation();

    if (location.pathname.startsWith('/admin')) return null;

    return (
        <nav className="sticky top-0 z-50 bg-brand-bg/80 backdrop-blur-md border-b border-stone-200 py-3 px-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    <img
                        src={logo}
                        alt="Twostones"
                        className="h-12 w-auto object-contain mix-blend-multiply"
                    />
                </Link>

                <div className="hidden md:flex items-center space-x-8 uppercase text-sm tracking-widest font-medium">
                    <Link to="/collection/manukato" className="hover:text-brand-secondary transition-colors">Collection</Link>
                    <Link to="/portfolio" className="hover:text-brand-secondary transition-colors">Portfolio</Link>
                    <Link to="/shop" className="hover:text-brand-secondary transition-colors">Shop</Link>
                    <Link to="/journal" className="hover:text-brand-secondary transition-colors flex items-center gap-2">
                        <BookOpen size={16} /> Journal
                    </Link>
                    <Link to="/stylist" className="hover:text-brand-secondary transition-colors flex items-center gap-2">
                        <Sparkles size={16} /> Stylist
                    </Link>
                </div>

                <div className="flex items-center space-x-6">
                    <Link to="/cart" className="relative hover:text-brand-secondary transition-colors">
                        <ShoppingBag size={22} />
                        {items.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                {items.length}
                            </span>
                        )}
                    </Link>
                    <Link
                        to={user ? (user.role === 'admin' ? "/admin" : "/profile") : "/login"}
                        className="hover:text-brand-secondary transition-colors"
                    >
                        <User size={22} />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
