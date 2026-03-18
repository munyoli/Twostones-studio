import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { journalApi, API_BASE_URL } from '../services/api';
import { ChevronRight, ChevronLeft, Send, Sparkles } from 'lucide-react';

const steps = ['Encounter', 'Strengths', 'Mirror', 'LieTruth', 'Redemption', 'Reflection', 'Translation'];

const renderFormattedText = (text: string | undefined) => {
    if (!text) return null;
    
    return text.split('\n').map((paragraph, i) => {
        const trimmed = paragraph.trim();
        if (!trimmed) return <div key={i} className="h-4"></div>; // spacing for empty lines

        // 1. Check for main section headers (e.g. "The Distortion: The Birth of Insecurity")
        // Usually short, no periods at the end, contains a colon.
        if (trimmed.length < 80 && !trimmed.endsWith('.') && trimmed.includes(':')) {
           return <h3 key={i} className="text-xl md:text-2xl font-bold font-serif text-brand-secondary mt-8 mb-4 border-b border-stone-200/50 pb-2">{trimmed}</h3>;
        }

        // 2. Check for subtopic sentences like "The Comparison Trap: Eve had no one..."
        const colonIndex = trimmed.indexOf(':');
        // If colon is found early in the sentence (e.g. within first 35 chars)
        if (colonIndex > 0 && colonIndex < 40 && trimmed[colonIndex + 1] === ' ') {
            const lead = trimmed.substring(0, colonIndex);
            const rest = trimmed.substring(colonIndex + 1);
            return (
                <p key={i} className="mb-6 leading-relaxed">
                    <strong className="font-sans uppercase tracking-[0.1em] text-xs font-bold text-brand-secondary block mb-2">{lead}</strong>
                    {rest.trim()}
                </p>
            );
        }

        // 3. Default paragraph
        return <p key={i} className="mb-6 leading-relaxed">{trimmed}</p>;
    });
};

const JournalExperience = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [reflection, setReflection] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const { data: entry, isLoading } = useQuery({
        queryKey: ['journal-entry', id],
        queryFn: () => journalApi.getEntry(id!).then(res => res.data),
    });

    const handleNext = () => currentStep < steps.length - 1 && setCurrentStep(curr => curr + 1);
    const handleBack = () => currentStep > 0 && setCurrentStep(curr => curr - 1);

    const handleSaveReflection = async () => {
        setIsSaving(true);
        try {
            await journalApi.saveReflection({ entry_id: id, reflection_text: reflection });
            handleNext();
        } catch (err) {
            alert('Failed to save reflection. Please sign in.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="min-h-screen pt-40 text-center uppercase tracking-widest text-stone-400">Opening the scrolls...</div>;

    const renderStepContent = () => {
        switch (steps[currentStep]) {
            case 'Encounter':
                return (
                    <div className="animate-fade-in text-center flex flex-col items-center">
                        <div className="w-full max-w-sm aspect-[4/5] overflow-hidden luxury-card mb-12 shadow-2xl skew-y-1 hover:skew-y-0 transition-transform duration-700">
                            <img src={entry.image_url} alt={entry.title} className="w-full h-full object-cover" />
                        </div>
                        <h2 className="text-brand-secondary text-[10px] font-bold uppercase tracking-[0.4em] mb-4">Day {entry.day_number}: The Encounter</h2>
                        <div className="text-lg md:text-xl font-serif text-brand-primary leading-relaxed mb-8 text-left max-w-2xl px-6">
                            {renderFormattedText(entry.encounter_text)}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-px w-8 bg-brand-secondary opacity-30"></div>
                            <span className="text-stone-400 text-[10px] uppercase tracking-widest font-medium italic">{entry.biblical_ref}</span>
                            <div className="h-px w-8 bg-brand-secondary opacity-30"></div>
                        </div>
                    </div>
                );
            case 'Strengths':
                return (
                    <div className="animate-fade-in grid md:grid-cols-2 gap-12 text-left">
                        <div className="bg-stone-50 p-8 rounded-xl border border-stone-100">
                            <h3 className="text-brand-primary font-bold uppercase tracking-widest text-xs mb-4">Her Strengths</h3>
                            <p className="text-stone-600 leading-relaxed font-serif">{entry.strengths}</p>
                        </div>
                        <div className="bg-red-50 p-8 rounded-xl border border-red-50">
                            <h3 className="text-red-800 font-bold uppercase tracking-widest text-xs mb-4">Her Struggle</h3>
                            <p className="text-red-900/70 leading-relaxed font-serif">{entry.weaknesses}</p>
                        </div>
                    </div>
                );
            case 'Mirror':
                return (
                    <div className="animate-fade-in text-center max-w-2xl mx-auto px-6">
                        <h2 className="text-stone-400 text-xs uppercase tracking-[0.3em] mb-8">The Modern Mirror</h2>
                        <div className="text-lg md:text-xl text-brand-primary leading-relaxed font-serif text-left bg-white/50 p-8 rounded-2xl border border-stone-100">
                            {renderFormattedText(entry.modern_contrast)}
                        </div>
                    </div>
                );
            case 'LieTruth':
                return (
                    <div className="animate-fade-in grid md:grid-cols-2 gap-8 items-center">
                        <div className="bg-stone-900 text-stone-400 p-10 rounded-2xl relative overflow-hidden">
                            <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest font-bold text-stone-600">The Lie</span>
                            <p className="text-lg font-serif italic line-through decoration-stone-600 decoration-2">{entry.lie_text}</p>
                        </div>

                        <div className="flex justify-center text-stone-300">
                            <div className="h-px w-full bg-stone-300 md:hidden my-4"></div>
                            <span className="md:hidden text-xs uppercase mx-4">VS</span>
                        </div>

                        <div className="bg-brand-primary text-white p-10 rounded-2xl relative shadow-xl transform md:scale-105">
                            <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest font-bold text-brand-secondary">God's Truth</span>
                            <p className="text-xl font-serif font-medium">{entry.truth_text}</p>
                        </div>
                    </div>
                );
            case 'Redemption':
                return (
                    <div className="animate-fade-in max-w-2xl mx-auto px-6">
                        <h2 className="text-stone-400 text-xs uppercase tracking-[0.3em] mb-8 text-center">Phase Five: Redemption</h2>
                        <div className="bg-brand-primary p-8 md:p-12 text-left rounded-2xl shadow-xl">
                            <div className="text-white/90 text-lg md:text-xl font-serif leading-relaxed">
                                {renderFormattedText(entry.redemption_text)}
                            </div>
                        </div>
                    </div>
                );
            case 'Reflection':
                return (
                    <div className="animate-fade-in max-w-3xl mx-auto px-4">
                        <h2 className="text-stone-400 text-xs uppercase tracking-[0.3em] mb-8 text-center">Phase Six: Heart Posture</h2>

                        <div className="bg-brand-soft p-8 md:p-12 rounded-3xl mb-10 border border-brand-secondary/20 text-left shadow-sm">
                            <h4 className="text-brand-secondary text-[10px] font-bold uppercase tracking-[0.3em] mb-10 text-center flex items-center justify-center gap-4">
                                <div className="h-px w-8 bg-brand-secondary/30"></div>
                                Journal Prompts
                                <div className="h-px w-8 bg-brand-secondary/30"></div>
                            </h4>
                            <div className="font-serif text-brand-primary leading-relaxed">
                                {entry.reflective_question ? 
                                    entry.reflective_question.split('\n').map((line: string, i: number) => {
                                        if (!line.trim()) return null;
                                        if (/^\d+\./.test(line.trim())) {
                                            const parts = line.split(':');
                                            const numAndTitle = parts[0];
                                            const rest = parts.slice(1).join(':') || parts[0]; // Fallback if no colon
                                            
                                            // Render numbered list items with deep luxury styling
                                            return (
                                                <div key={i} className="mb-10 pl-6 border-l-2 border-brand-secondary/40 relative group">
                                                    <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-brand-bg border border-brand-secondary transition-all group-hover:bg-brand-secondary"></div>
                                                    <span className="font-sans font-bold text-brand-secondary block mb-3 text-xs md:text-sm tracking-[0.2em] uppercase">
                                                        {numAndTitle.trim()}
                                                    </span>
                                                    <p className="text-xl md:text-2xl text-brand-primary/90 italic">
                                                        {rest.trim() !== numAndTitle.trim() ? rest.trim() : ''}
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return <p key={i} className="mb-8 font-serif text-2xl text-center text-brand-primary">{line}</p>;
                                    })
                                : (
                                    <p className="text-2xl italic text-center">What truth are you anchoring yourself in today?</p>
                                )}
                            </div>
                        </div>

                        <textarea
                            className="w-full h-56 p-8 bg-white/50 border border-stone-200 rounded-3xl outline-none focus:border-brand-secondary focus:bg-white transition-all font-sans shadow-inner text-lg leading-relaxed placeholder:text-stone-300 placeholder:italic mb-8"
                            placeholder="Write your heart's response..."
                            value={reflection}
                            onChange={(e) => setReflection(e.target.value)}
                        />
                        <button
                            onClick={handleSaveReflection}
                            disabled={isSaving || !reflection}
                            className="w-full btn-primary flex items-center justify-center gap-3 py-5 text-[10px] font-bold tracking-[0.4em] rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                        >
                            <Send size={16} /> {isSaving ? 'SEALING...' : 'SEAL REFLECTION'}
                        </button>
                    </div>
                );
            case 'Translation':
                return (
                    <div className="animate-fade-in text-center">
                        <h2 className="text-brand-secondary text-xs uppercase tracking-[0.3em] mb-8 flex items-center justify-center gap-2">
                            <Sparkles size={16} /> The Fashion Translation
                        </h2>
                        {entry.garment ? (
                            <div className="flex flex-col items-center">
                                <div className="w-64 h-80 bg-stone-100 mb-6 overflow-hidden luxury-card">
                                    <img
                                        src={entry.garment.images?.[0]?.image_url.startsWith('http')
                                            ? entry.garment.images[0].image_url
                                            : `${API_BASE_URL}${entry.garment.images?.[0]?.image_url}`}
                                        alt={entry.garment.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-2xl font-serif font-bold mb-2">{entry.garment.name}</h3>
                                <p className="text-stone-500 text-sm max-w-sm mb-6">{entry.garment.description}</p>
                                <button
                                    onClick={() => navigate(`/product/${entry.garment.id}`)}
                                    className="btn-primary"
                                >
                                    View Garment
                                </button>
                            </div>
                        ) : (
                            <p className="text-stone-400 italic">No garment translation yet.</p>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-brand-bg pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto flex flex-col min-h-[600px]">
                {/* Progress Bar */}
                <div className="flex justify-between mb-16">
                    {steps.map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1 flex-grow mx-1 transition-colors duration-500 ${idx <= currentStep ? 'bg-brand-secondary' : 'bg-stone-200'}`}
                        />
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-grow flex flex-col justify-center mb-12">
                    <h1 className="text-xs uppercase tracking-[0.4em] text-stone-300 mb-12 text-center">
                        {entry.title}
                    </h1>
                    {renderStepContent()}
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-8 border-t border-stone-100">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className="flex items-center gap-2 text-stone-400 hover:text-brand-primary disabled:opacity-0 transition-all font-bold tracking-widest text-[10px] uppercase"
                    >
                        <ChevronLeft size={16} /> Back
                    </button>

                    {steps[currentStep] !== 'Reflection' && (
                        <button
                            onClick={handleNext}
                            disabled={currentStep === steps.length - 1}
                            className="flex items-center gap-2 text-brand-primary hover:text-brand-secondary disabled:opacity-0 transition-all font-bold tracking-widest text-[10px] uppercase"
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    )}

                    {currentStep === steps.length - 1 && (
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/journal')}
                                className="bg-stone-100 text-stone-600 px-6 py-3 rounded uppercase tracking-widest text-[10px] font-bold hover:bg-stone-200 transition-colors"
                            >
                                Journey Map
                            </button>
                            {entry.day_number < 30 && (
                                <button
                                    onClick={() => {
                                        // Navigate to the next entry id if possible, but IDs might not be sequential in DB. 
                                        // A better way is to find by day_number, but here we'll just go back to list or the user can pick next.
                                        // For now, let's keep it simple and just show the 'Complete' button and a 'Next Day' if we can determine the ID.
                                        navigate('/journal');
                                    }}
                                    className="btn-primary"
                                >
                                    Next Day
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JournalExperience;
