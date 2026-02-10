import { useState } from 'react';
import { authApi } from '../../../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await authApi.login({ email, password });
            const userData = res.data.user;
            login(userData, res.data.token);

            // Role-based redirect
            if (userData.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/shop');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 flex items-center justify-center px-6">
            <div className="w-full max-w-md luxury-card p-10">
                <h1 className="text-3xl font-serif font-bold text-center mb-2">Welcome Back</h1>
                <p className="text-stone-500 text-center mb-8 italic">Please sign in to your Twostones account.</p>

                {error && <p className="bg-red-50 text-red-600 p-4 text-sm mb-6 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold">Email Address</label>
                        <input
                            type="email"
                            className="w-full p-4 bg-stone-50 border border-stone-100 outline-none focus:border-brand-secondary transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold">Password</label>
                        <input
                            type="password"
                            className="w-full p-4 bg-stone-50 border border-stone-100 outline-none focus:border-brand-secondary transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full btn-primary disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-stone-400 text-xs">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-brand-primary font-bold hover:underline">
                            Join the Tribe
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
