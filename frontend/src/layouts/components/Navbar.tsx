import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, User, BookOpen, Sparkles, Menu, X } from 'lucide-react';
import { useAuth } from '../../features/auth/context/AuthContext';
import { useCart } from '../../features/cart/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

import logo from '../../assets/logo.png';

const Navbar = () => {
    const { user } = useAuth();
    const { items } = useCart();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (location.pathname.startsWith('/admin')) return null;

    const navLinks = [
        { path: '/collection/manukato', label: 'Collection' },
        { path: '/about', label: 'About' },
        { path: '/portfolio', label: 'Portfolio' },
        { path: '/shop', label: 'Shop' },
        { path: '/journal', label: 'Journal', icon: <BookOpen size={16} /> },
        { path: '/stylist', label: 'Stylist', icon: <Sparkles size={16} /> },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-brand-bg/90 backdrop-blur-md border-b border-stone-200 py-4 px-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                    <img
                        src={logo}
                        alt="Twostones"
                        className="h-10 md:h-12 w-auto object-contain mix-blend-multiply"
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8 uppercase text-[11px] tracking-[0.2em] font-bold text-brand-primary/80">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`hover:text-brand-secondary transition-colors flex items-center gap-2 ${location.pathname === link.path ? 'text-brand-secondary' : ''
                                }`}
                        >
                            {link.icon} {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center space-x-5 md:space-x-6">
                    <Link to="/cart" className="relative hover:text-brand-secondary transition-colors" onClick={() => setIsMenuOpen(false)}>
                        <ShoppingBag size={20} />
                        {items.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-brand-secondary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                {items.length}
                            </span>
                        )}
                    </Link>
                    <Link
                        to={user ? (user.role === 'admin' ? "/admin" : "/profile") : "/login"}
                        className="hover:text-brand-secondary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <User size={20} />
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-brand-primary"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-brand-bg border-t border-stone-100 overflow-hidden"
                    >
                        <div className="flex flex-col py-8 space-y-6 px-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-lg font-serif font-bold text-brand-primary hover:text-brand-secondary transition-colors flex items-center gap-4 border-b border-stone-50 pb-4"
                                >
                                    {link.icon} {link.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
