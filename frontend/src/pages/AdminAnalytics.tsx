import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Clock } from 'lucide-react';

interface AnalyticsData {
    totalVisits: number;
    recentVisits: any[];
}

const AdminAnalytics = () => {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const res = await axios.get(`${apiUrl}/analytics/stats`);
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch analytics', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-12 text-center text-stone-500 font-serif">Loading insights...</div>;
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold text-brand-primary">Website Traffic</h2>
                <p className="text-sm text-stone-500 mt-1">Real-time visitor analytics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-brand-primary text-white p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <Users size={20} className="text-brand-secondary" />
                        <h3 className="uppercase tracking-widest text-xs font-bold">Total Visits</h3>
                    </div>
                    <p className="text-4xl font-serif font-bold">{data?.totalVisits || 0}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
                <div className="p-6 border-b border-stone-100 bg-stone-50/50">
                    <h3 className="font-bold text-brand-primary font-serif">Recent Visitors</h3>
                </div>
                <div className="divide-y divide-stone-100">
                    {data?.recentVisits?.map((visit: any, i: number) => (
                        <div key={i} className="p-4 px-6 flex items-center justify-between hover:bg-stone-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                                    <Clock size={14} />
                                </div>
                                <div>
                                    <p className="font-medium text-brand-primary font-serif">{visit.path}</p>
                                    <p className="text-xs text-stone-500 truncate max-w-[200px]">
                                        {visit.referrer || 'Direct Traffic'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-medium text-stone-900">
                                    {new Date(visit.timestamp).toLocaleDateString()}
                                </p>
                                <p className="text-[10px] text-stone-400">
                                    {new Date(visit.timestamp).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))}
                    {!data?.recentVisits?.length && (
                        <div className="p-8 text-center text-stone-500 text-sm">No visits recorded yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
