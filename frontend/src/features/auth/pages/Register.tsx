import { useState } from 'react';
import { authApi } from '../../../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
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
            console.log('Attempting registration:', email);
            const res = await authApi.register({ name, email, password });
            console.log('Registration success:', res);
            login(res.data.user, res.data.token);
            alert('Welcome to the Tribe!');
            navigate('/shop');
        } catch (err: any) {
            console.error('Registration error:', err);
            const msg = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(msg);
            alert(msg); // Temporary feedback
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 flex items-center justify-center px-6">
            <div className="w-full max-w-md luxury-card p-10">
                <h1 className="text-3xl font-serif font-bold text-center mb-2">Join the Tribe</h1>
                <p className="text-stone-500 text-center mb-8 italic">Begin your journey with Twostones.</p>

                {error && <p className="bg-red-50 text-red-600 p-4 text-sm mb-6 text-center">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold">Full Name</label>
                        <input
                            type="text"
                            className="w-full p-4 bg-stone-50 border border-stone-100 outline-none focus:border-brand-secondary transition-colors"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-stone-400 text-xs">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand-primary font-bold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
