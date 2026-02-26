import React from 'react';
import { useAuth } from '../features/auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Package, User as UserIcon, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { journalApi, API_BASE_URL } from '../services/api';

// Measurements Manager Component (defined first to avoid hoisting issues)
const MeasurementsManager = () => {
    const [measurements, setMeasurements] = React.useState({
        bust: '',
        waist: '',
        hips: '',
        shoulder: '',
        armhole: '',
        inseam: '',
        height: '',
        notes: ''
    });
    const [isEditing, setIsEditing] = React.useState(false);
    const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // Fetch measurements on mount
    React.useEffect(() => {
        const fetchMeasurements = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/api/user/measurements`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.measurements) {
                    setMeasurements(data.measurements);
                }
            } catch (error) {
                console.error('Error fetching measurements:', error);
            }
        };
        fetchMeasurements();
    }, []);

    const handleSave = async () => {
        setStatus('loading');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/user/measurements`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(measurements)
            });

            if (response.ok) {
                setStatus('success');
                setIsEditing(false);
                setTimeout(() => setStatus('idle'), 2000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Error saving measurements:', error);
            setStatus('error');
        }
    };

    const hasAnyMeasurement = Object.values(measurements).some(v => v && v.trim() !== '');

    if (!isEditing && !hasAnyMeasurement) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 text-center">
                <p className="text-stone-500 mb-4 italic">You haven't saved your measurements yet.</p>
                <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 border border-brand-primary text-brand-primary text-xs uppercase tracking-widest font-bold rounded hover:bg-brand-primary hover:text-white transition-colors"
                >
                    Add Measurements
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                {[
                    { key: 'bust', label: 'Bust (in)' },
                    { key: 'waist', label: 'Waist (in)' },
                    { key: 'hips', label: 'Hips (in)' },
                    { key: 'shoulder', label: 'Shoulder (in)' },
                    { key: 'armhole', label: 'Armhole (in)' },
                    { key: 'inseam', label: 'Inseam (in)' },
                    { key: 'height', label: 'Height (in)' }
                ].map(field => (
                    <div key={field.key}>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block mb-2">
                            {field.label}
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={measurements[field.key as keyof typeof measurements]}
                                onChange={(e) => setMeasurements({ ...measurements, [field.key]: e.target.value })}
                                className="w-full border-b border-stone-200 py-2 outline-none focus:border-brand-secondary transition-colors text-brand-primary"
                                placeholder="--"
                            />
                        ) : (
                            <p className="text-brand-primary font-serif text-lg">
                                {measurements[field.key as keyof typeof measurements] || '--'}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <div className="mb-6">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 block mb-2">
                    Additional Notes
                </label>
                {isEditing ? (
                    <textarea
                        value={measurements.notes}
                        onChange={(e) => setMeasurements({ ...measurements, notes: e.target.value })}
                        className="w-full border border-stone-200 p-4 outline-none focus:border-brand-secondary transition-colors text-brand-primary resize-none"
                        rows={3}
                        placeholder="Any specific fit preferences or notes..."
                    />
                ) : (
                    <p className="text-stone-600 italic text-sm">
                        {measurements.notes || 'No additional notes.'}
                    </p>
                )}
            </div>

            <div className="flex gap-4">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            disabled={status === 'loading'}
                            className="flex-1 btn-primary disabled:opacity-50"
                        >
                            {status === 'loading' ? 'Saving...' : 'Save Measurements'}
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-3 border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 px-6 py-3 border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-colors uppercase tracking-widest text-xs font-bold"
                    >
                        Update Measurements
                    </button>
                )}
            </div>

            {status === 'success' && (
                <p className="mt-4 text-center text-green-600 text-sm font-medium animate-fade-in">
                    Measurements saved securely.
                </p>
            )}
            {status === 'error' && (
                <p className="mt-4 text-center text-red-600 text-sm font-medium">
                    Failed to save. Please try again.
                </p>
            )}
        </div>
    );
};

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
            <h1 className="text-4xl font-serif font-bold text-brand-primary mb-2">My Profile</h1>
            <p className="text-stone-500 mb-12">Manage your account and view your history.</p>

            <div className="grid md:grid-cols-3 gap-8">
                {/* User Card */}
                <div className="md:col-span-1">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 text-center">
                        <div className="w-24 h-24 bg-brand-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-secondary">
                            <UserIcon size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-brand-primary mb-1">{user.name}</h2>
                        <p className="text-stone-500 text-sm mb-6">{user.email}</p>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-3 border border-stone-200 rounded-lg hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors text-sm font-medium text-stone-600"
                        >
                            <LogOut size={16} /> Sign Out
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="md:col-span-2 space-y-8">
                    {/* Reflections Section */}
                    <div>
                        <h3 className="text-xl font-serif font-bold text-brand-primary mb-4">My Journey</h3>
                        <ReflectionsList />
                    </div>

                    {/* Measurements Section */}
                    <div>
                        <h3 className="text-xl font-serif font-bold text-brand-primary mb-4">My Measurements</h3>
                        <MeasurementsManager />
                    </div>

                    {/* Orders Stub */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 opacity-75">
                        <div className="flex items-center gap-3 mb-6">
                            <Package className="text-brand-primary" />
                            <h3 className="text-lg font-bold text-brand-primary">Recent Orders</h3>
                        </div>
                        <div className="text-center py-6 bg-stone-50 rounded-lg border border-stone-100 border-dashed">
                            <p className="text-stone-400 text-sm">No recent orders found.</p>
                            <button onClick={() => navigate('/shop')} className="mt-4 text-brand-secondary text-sm font-bold hover:underline">
                                Browse Collection
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-component for clean code
const ReflectionsList = () => {
    const { data: reflections, isLoading } = useQuery({
        queryKey: ['my-reflections'],
        queryFn: () => journalApi.getMyReflections().then((res: any) => res.data),
    });

    if (isLoading) return <div className="p-4 text-center text-stone-400 text-xs uppercase tracking-widest">Loading Reflections...</div>;

    if (!reflections || reflections.length === 0) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 text-center">
                <p className="text-stone-500 mb-4 italic">You haven't recorded any reflections yet.</p>
                <div className="inline-block px-6 py-2 border border-brand-primary text-brand-primary text-xs uppercase tracking-widest font-bold rounded hover:bg-brand-primary hover:text-white transition-colors cursor-pointer">
                    <a href="/journal">Start a Journal</a>
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {reflections.map((r: any) => (
                <div key={r.id} className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-serif font-bold text-brand-primary">{r.entry?.title || 'Journal Entry'}</h4>
                        <span className="flex items-center gap-1 text-[10px] text-stone-400 uppercase tracking-widest">
                            <Calendar size={12} /> {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-stone-600 text-sm italic mb-4 line-clamp-2">"{r.reflection_text}"</p>
                    <div className="text-right">
                        <span className="text-brand-secondary text-xs font-bold uppercase tracking-widest">Saved</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Profile;
