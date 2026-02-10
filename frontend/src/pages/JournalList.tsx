import { useQuery } from '@tanstack/react-query';
import { journalApi } from '../services/api';
import { Link } from 'react-router-dom';
import { Lock, Star } from 'lucide-react';

const JournalList = () => {
    const { data: entries, isLoading } = useQuery({
        queryKey: ['journal-entries'],
        queryFn: () => journalApi.getEntries().then(res => res.data),
    });

    if (isLoading) return <div className="min-h-screen pt-40 text-center uppercase tracking-widest text-stone-400">Seeking wisdom...</div>;

    // Sort entries by day number
    const sortedEntries = entries?.sort((a: any, b: any) => a.day_number - b.day_number) || [];

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-4xl mx-auto">
            <header className="mb-20 text-center max-w-2xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-primary mb-4 tracking-tight">The 30-Day Journey</h1>
                <p className="text-stone-500 italic">"I will put enmity between you and the woman..." — Reclaim your story through the women who walked before you.</p>
            </header>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-stone-200" />

                <div className="space-y-24">
                    {sortedEntries.map((entry: any, index: number) => {
                        const isEven = index % 2 === 0;
                        const isLocked = false; // All 30 days are now accessible

                        return (
                            <div key={entry.id} className={`relative flex items-center ${isEven ? 'justify-start' : 'justify-end'}`}>

                                {/* Timeline Node */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                                    <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center bg-brand-bg transition-colors ${isLocked ? 'border-stone-200 text-stone-300' : 'border-brand-primary text-brand-primary'
                                        }`}>
                                        <span className="font-serif font-bold text-sm">{entry.day_number}</span>
                                    </div>
                                </div>

                                {/* Content Card */}
                                <Link
                                    to={`/journal/${entry.id}`}
                                    className={`w-5/12 group relative ${isLocked ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                                >
                                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-all text-center">
                                        <div className="mb-4 text-brand-secondary flex justify-center">
                                            {isLocked ? <Lock size={24} /> : <Star size={24} />}
                                        </div>
                                        <h3 className="text-xl font-serif font-bold text-brand-primary mb-2 line-clamp-1">{entry.title}</h3>
                                        <p className="text-stone-400 text-xs uppercase tracking-widest mb-4">Day {entry.day_number}</p>

                                        {!isLocked && (
                                            <span className="text-brand-primary text-xs font-bold border-b border-brand-primary pb-1 group-hover:text-brand-secondary group-hover:border-brand-secondary transition-colors">
                                                Begin Day {entry.day_number}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default JournalList;
