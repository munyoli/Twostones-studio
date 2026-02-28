import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { journalApi, API_BASE_URL } from '../services/api';
import { ChevronRight, ChevronLeft, Send, Sparkles } from 'lucide-react';

const steps = ['Encounter', 'Strengths', 'Mirror', 'LieTruth', 'Redemption', 'Reflection', 'Translation'];

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
                        <div className="text-3xl md:text-4xl font-serif italic text-brand-primary leading-tight mb-8 tracking-tight max-w-xl">
                            "{entry.encounter_text}"
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
                    <div className="animate-fade-in text-center max-w-2xl mx-auto">
                        <h2 className="text-stone-400 text-xs uppercase tracking-[0.3em] mb-8">The Modern Mirror</h2>
                        <p className="text-xl text-brand-primary leading-loose font-serif italic">
                            "{entry.modern_contrast}"
                        </p>
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
                    <div className="animate-fade-in">
                        <h2 className="text-stone-400 text-xs uppercase tracking-[0.3em] mb-8 text-center">Phase Five: Redemption</h2>
                        <div className="bg-brand-primary p-12 text-center rounded-2xl shadow-xl">
                            <p className="text-white text-xl font-medium italic">
                                {entry.redemption_text}
                            </p>
                        </div>
                    </div>
                );
            case 'Reflection':
                return (
                    <div className="animate-fade-in">
                        <h2 className="text-stone-400 text-xs uppercase tracking-[0.3em] mb-8 text-center">Phase Six: Heart Posture</h2>

                        <div className="bg-brand-soft p-10 rounded-2xl mb-10 border border-brand-secondary/10">
                            <h4 className="text-brand-secondary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Meditative Prompt</h4>
                            <p className="text-xl font-serif text-brand-primary italic leading-relaxed">
                                {entry.reflective_question || "What truth are you anchoring yourself in today?"}
                            </p>
                        </div>

                        <textarea
                            className="w-full h-48 p-8 bg-white border border-stone-200 rounded-2xl outline-none focus:border-brand-secondary transition-all font-sans shadow-inner text-lg"
                            placeholder="Write your heart's response..."
                            value={reflection}
                            onChange={(e) => setReflection(e.target.value)}
                        />
                        <button
                            onClick={handleSaveReflection}
                            disabled={isSaving || !reflection}
                            className="mt-8 w-full btn-primary flex items-center justify-center gap-3 py-4 text-xs font-bold tracking-[0.3em]"
                        >
                            <Send size={18} /> {isSaving ? 'SEALING...' : 'SEAL REFLECTION'}
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
