import { useLocation, Link } from 'react-router-dom';

import logo from '../../assets/logo.png';

const Footer = () => {
    const location = useLocation();
    if (location.pathname.startsWith('/admin')) return null;

    return (
        <footer className="bg-brand-primary text-stone-300 py-16 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-white p-1 rounded-full overflow-hidden w-12 h-12 flex items-center justify-center">
                            <img
                                src={logo}
                                alt="Twostones"
                                className="w-full h-full object-contain mix-blend-multiply"
                            />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-white tracking-widest">TWOSTONES</h2>
                    </div>
                    <p className="max-w-sm text-stone-400 mb-6">
                        Crafted for wholeness. A luxury experience grounded in integrity, values, and the discipline of African craftsmanship.
                    </p>
                </div>

                <div>
                    <h3 className="text-white font-medium mb-6 uppercase tracking-wider">Explore</h3>
                    <ul className="space-y-4 text-sm">
                        <li><Link to="/collection/manukato" className="hover:text-white transition-colors">Manukato Collection</Link></li>
                        <li><Link to="/shop" className="hover:text-white transition-colors">The Shop</Link></li>
                        <li><Link to="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
                        <li><Link to="/faq" className="hover:text-white transition-colors">FAQ & Support</Link></li>
                        <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
                        <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-white font-medium mb-6 uppercase tracking-wider">Connect</h3>
                    <ul className="space-y-4 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                        <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        <li><a href="#" className="hover:text-white transition-colors">Newsletter</a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-stone-800 text-xs flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-stone-500">
                <p>&copy; {new Date().getFullYear()} Twostones Platform. All rights reserved.</p>
                <div className="flex space-x-6">
                    <p>Buruburu Shopping Complex, Suite E5 - Nairobi</p>
                </div>
                <div className="flex space-x-6">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
