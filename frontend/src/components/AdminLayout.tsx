import { useNavigate, Link, Outlet } from 'react-router-dom';
import { Users, ShoppingCart, Book, LogOut, LayoutDashboard, BarChart } from 'lucide-react';
import { useAuth } from '../features/auth/context/AuthContext';
import { useEffect } from 'react';

import logo from '../assets/logo.png';

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="flex min-h-screen bg-stone-50">
            {/* Sidebar */}
            <aside className="w-64 bg-brand-primary text-white flex flex-col fixed inset-y-0 left-0">
                <div className="p-6">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="bg-white p-1 rounded-full overflow-hidden w-10 h-10 flex items-center justify-center">
                            <img
                                src={logo}
                                alt="Twostones"
                                className="w-full h-full object-contain mix-blend-multiply"
                            />
                        </div>
                        <span className="text-xl font-serif font-bold tracking-widest text-white">
                            TWOSTONES
                        </span>
                    </Link>
                    <div className="mt-2 text-xs uppercase tracking-widest text-white bg-brand-primary inline-block px-2 py-1 rounded">
                        Admin Console
                    </div>
                </div>

                <nav className="flex-grow p-6 space-y-2">
                    <Link to="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors uppercase tracking-widest text-xs font-medium">
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link to="/admin/analytics" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors uppercase tracking-widest text-xs font-medium">
                        <BarChart size={18} /> Analytics
                    </Link>
                    <Link to="/admin/clients" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors uppercase tracking-widest text-xs font-medium">
                        <Users size={18} /> Clients
                    </Link>
                    <Link to="/admin/orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors uppercase tracking-widest text-xs font-medium">
                        <ShoppingCart size={18} /> Orders
                    </Link>
                    <Link to="/admin/journals" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors uppercase tracking-widest text-xs font-medium">
                        <Book size={18} /> Journals
                    </Link>
                </nav>

                <div className="p-6 mt-auto border-t border-white/10">
                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="flex items-center gap-3 p-3 w-full text-stone-400 hover:text-white transition-colors uppercase tracking-widest text-xs font-medium"
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow ml-64 p-12">
                <header className="mb-12 flex justify-between items-center">
                    <div>
                        <h2 className="text-xs uppercase tracking-[0.4em] text-stone-400 mb-2 font-bold">Twostones Platform</h2>
                        <h1 className="text-3xl font-serif font-bold text-brand-primary">Management Console</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-brand-primary">{user.name}</p>
                            <p className="text-[10px] text-stone-400 uppercase tracking-widest">Administrator</p>
                        </div>
                        <div className="w-10 h-10 bg-brand-secondary rounded-full flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0)}
                        </div>
                    </div>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-stone-200 min-h-[600px] overflow-hidden">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
