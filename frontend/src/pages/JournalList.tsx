import { useQuery } from '@tanstack/react-query';
import { journalApi } from '../services/api';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles } from 'lucide-react';

const JournalList = () => {
    const { data: entries, isLoading } = useQuery({
        queryKey: ['journal-entries'],
        queryFn: () => journalApi.getEntries().then(res => res.data),
    });

    if (isLoading) return <div className="min-h-screen pt-40 text-center uppercase tracking-widest text-stone-400 animate-pulse">Consulting the Archives...</div>;

    const sortedEntries = entries?.sort((a: any, b: any) => a.day_number - b.day_number) || [];

    return (
        <div className="min-h-screen bg-brand-bg pt-32 pb-32 px-6">
            <header className="max-w-5xl mx-auto mb-24 text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="h-px w-12 bg-brand-secondary opacity-50"></div>
                    <span className="text-[10px] uppercase tracking-[0.5em] text-brand-secondary font-bold">The 30-Day Intensive</span>
                    <div className="h-px w-12 bg-brand-secondary opacity-50"></div>
                </div>
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-primary mb-8 tracking-tighter">Women of Valor</h1>
                <p className="max-w-2xl mx-auto text-stone-500 font-serif italic text-lg leading-relaxed">
                    "Strength and honor are her clothing; she shall rejoice in time to come."<br />
                    A journey through identity, grace, and the timeless style of the women who shaped history.
                </p>
            </header>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {sortedEntries.map((entry: any) => (
                    <Link
                        key={entry.id}
                        to={`/journal/${entry.id}`}
                        className="group relative flex flex-col"
                    >
                        {/* Image Container */}
                        <div className="relative aspect-[3/4] overflow-hidden luxury-card mb-6">
                            <img
                                src={entry.image_url}
                                alt={entry.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40"></div>

                            {/* Day Badge */}
                            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1 flex items-center gap-2">
                                <span className="text-[10px] font-bold tracking-widest uppercase text-brand-primary">Day</span>
                                <span className="text-lg font-serif font-bold text-brand-secondary">{entry.day_number}</span>
                            </div>

                            {/* Hover Action */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="bg-white text-brand-primary px-8 py-3 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                    <BookOpen size={14} /> Open Scroll
                                </div>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="text-center md:text-left px-2">
                            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                                <span className="text-[10px] uppercase tracking-widest text-brand-secondary font-bold">
                                    {entry.biblical_ref || 'Scripture'}
                                </span>
                                <Sparkles size={10} className="text-brand-secondary/40" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-brand-primary mb-2 group-hover:text-brand-secondary transition-colors">
                                {entry.title}
                            </h3>
                            <p className="text-stone-400 text-[10px] uppercase tracking-widest font-medium">
                                {entry.subtitle || 'A Character Study'}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>

            <footer className="max-w-3xl mx-auto mt-32 border-t border-stone-200 pt-16 text-center">
                <p className="text-xs uppercase tracking-[0.4em] text-stone-400 mb-8">End of the first scroll</p>
                <div className="flex justify-center gap-8">
                    <div className="w-2 h-2 rounded-full bg-brand-secondary"></div>
                    <div className="w-2 h-2 rounded-full bg-brand-secondary opacity-50"></div>
                    <div className="w-2 h-2 rounded-full bg-brand-secondary opacity-20"></div>
                </div>
            </footer>
        </div>
    );
};

export default JournalList;
