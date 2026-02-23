import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { BASE_URL } from '../../../services/api';
import { Sparkles, ArrowRight, ArrowLeft, Check, User, Palette, Calendar, Send, RefreshCw, ShoppingBag } from 'lucide-react';
import ResponsiveImage from '../../../components/ResponsiveImage';
import { useAuth } from '../../auth/context/AuthContext';

const steps = [
    { id: 'bodyType', title: 'Body Architecture', icon: User },
    { id: 'undertone', title: 'Skin Undertone', icon: Palette },
    { id: 'occasion', title: 'The Occasion', icon: Calendar },
    { id: 'results', title: 'Your Blueprint', icon: Sparkles }
];

const AIStylist = () => {
    useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        bodyType: '',
        undertone: '',
        occasion: '',
    });
    const [recommendation, setRecommendation] = useState<any>(null);
    const [error, setError] = useState('');

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const selectOption = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(''); // Clear error on new selection
        // Auto-advance for better UX after selection
        setTimeout(() => handleNext(), 300);
    };

    const getRecommendation = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/stylist/recommend', {
                ...formData,
                measurements: {} // Can integrate real measurements later
            });
            setRecommendation(res.data);
            setCurrentStep(3); // Move to results
        } catch (err) {
            console.error(err);
            setError('Unable to curate your style at this moment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Trigger recommendation fetch when entering result step
    useEffect(() => {
        if (currentStep === 3 && !recommendation && !loading && formData.bodyType) {
            getRecommendation();
        }
    }, [currentStep]);

    const renderStep = () => {
        switch (currentStep) {
            case 0: // Body Type
                return (
                    <div className="animate-fade-in">
                        <h3 className="text-2xl font-serif text-brand-primary mb-8 text-center">How would you describe your silhouette?</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {['Hourglass', 'Pear', 'Apple', 'Rectangle', 'Inverted Triangle'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => selectOption('bodyType', type)}
                                    className={`p-8 border rounded-xl flex flex-col items-center gap-4 transition-all duration-300 hover:shadow-lg ${formData.bodyType === type ? 'border-brand-secondary bg-brand-secondary/5 ring-1 ring-brand-secondary' : 'border-stone-200 bg-white hover:border-brand-secondary/50'}`}
                                >
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${formData.bodyType === type ? 'bg-brand-secondary text-white' : 'bg-stone-100 text-stone-400'}`}>
                                        <User size={28} />
                                    </div>
                                    <span className="font-serif text-lg text-brand-primary">{type}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 1: // Undertone
                return (
                    <div className="animate-fade-in">
                        <h3 className="text-2xl font-serif text-brand-primary mb-8 text-center">What is your skin's natural undertone?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {[
                                { id: 'Warm', desc: 'Golden, yellow, or peachy tones. Veins appear green.' },
                                { id: 'Cool', desc: 'Pink, red, or bluish tones. Veins appear blue.' },
                                { id: 'Neutral', desc: 'A mix of warm and cool tones.' }
                            ].map((tone) => (
                                <button
                                    key={tone.id}
                                    onClick={() => selectOption('undertone', tone.id)}
                                    className={`p-8 border rounded-xl text-left transition-all duration-300 hover:shadow-lg ${formData.undertone === tone.id ? 'border-brand-secondary bg-brand-secondary/5 ring-1 ring-brand-secondary' : 'border-stone-200 bg-white hover:border-brand-secondary/50'}`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="font-serif text-xl text-brand-primary">{tone.id}</span>
                                        {formData.undertone === tone.id && <Check size={20} className="text-brand-secondary" />}
                                    </div>
                                    <p className="text-sm text-stone-500 leading-relaxed">{tone.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 2: // Occasion
                return (
                    <div className="animate-fade-in">
                        <h3 className="text-2xl font-serif text-brand-primary mb-8 text-center">What is the occasion?</h3>
                        <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
                            {['Wedding', 'Work', 'Casual', 'Evening', 'Worship'].map((occ) => (
                                <button
                                    key={occ}
                                    onClick={() => selectOption('occasion', occ)}
                                    className={`p-6 border rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-md ${formData.occasion === occ ? 'border-brand-secondary bg-brand-secondary/5 ring-1 ring-brand-secondary' : 'border-stone-200 bg-white hover:border-brand-secondary/50'}`}
                                >
                                    <span className="font-serif text-lg text-brand-primary">{occ}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 3: // Results
                if (error) return (
                    <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                        <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full flex items-center justify-center mb-6">
                            <Sparkles size={32} />
                        </div>
                        <h3 className="font-serif text-2xl text-stone-800 mb-2">Refining the Vision...</h3>
                        <p className="text-stone-500 mb-8 max-w-md">{error}</p>
                        <button
                            onClick={getRecommendation}
                            className="btn-primary"
                        >
                            Try Again
                        </button>
                    </div>
                );

                if (!recommendation) return (
                    <div className="min-h-[400px] flex flex-col items-center justify-center">
                        <div className="animate-pulse flex flex-col items-center gap-4">
                            <Sparkles className="text-brand-secondary animate-spin-slow" size={48} />
                            <p className="font-serif text-xl text-stone-400">Curating your blueprint...</p>
                        </div>
                    </div>
                );

                return (
                    <div className="animate-fade-in max-w-5xl mx-auto">
                        <div className="bg-white border border-stone-100 shadow-xl rounded-2xl overflow-hidden mb-12">
                            <div className="bg-brand-primary p-8 text-center text-white">
                                <h3 className="font-serif text-3xl mb-2">Your Personal Style Blueprint</h3>
                                <p className="text-brand-secondary text-sm tracking-widest uppercase font-bold">
                                    {formData.bodyType} • {formData.undertone} • {formData.occasion}
                                </p>
                            </div>

                            <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div>
                                    <h4 className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-stone-400 mb-6">
                                        <User size={16} /> Architectural Guidance
                                    </h4>
                                    <p className="text-lg font-serif text-brand-primary leading-relaxed mb-6">
                                        "{recommendation.silhouetteAdvice}"
                                    </p>
                                    <div className="bg-red-50 p-4 border-l-2 border-red-200 text-sm text-stone-600">
                                        <strong>Guidance:</strong> {recommendation.avoidAdvice}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-stone-400 mb-6">
                                        <Palette size={16} /> Color & Fabric
                                    </h4>
                                    <p className="text-stone-600 mb-6 leading-relaxed">
                                        {recommendation.colorAdvice}
                                    </p>
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        {(recommendation.colorPalette || []).map((color: string) => (
                                            <span key={color} className="px-3 py-1 bg-stone-100 text-stone-600 text-xs uppercase tracking-wide rounded-full">
                                                {color}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-sm text-stone-500">
                                        <strong>Recommended Fabrics:</strong> {recommendation.fabricAdvice}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-center font-serif text-2xl mb-8">Curated For You</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {(recommendation.recommendations || []).length > 0 ? (
                                recommendation.recommendations.map((rec: any, idx: number) => {
                                    if (rec.type === 'manukato') {
                                        const item = rec.item;
                                        return (
                                            <div key={idx} className="group cursor-pointer">
                                                <div className="aspect-[3/4] overflow-hidden mb-4 relative">
                                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-brand-secondary text-[10px] uppercase font-bold px-2 py-1 z-10">
                                                        Available in Collection
                                                    </div>
                                                    <img
                                                        src={`${BASE_URL}${item.imagePath}`}
                                                        alt={item.brandName}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                </div>
                                                <h4 className="font-serif text-lg text-brand-primary">{item.brandName}</h4>
                                                <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">Excellent Match</p>
                                            </div>
                                        );
                                    } else if (rec.type === 'inspiration') {
                                        return (
                                            <div key={idx} className="opacity-80 hover:opacity-100 transition-opacity">
                                                <div className="aspect-[3/4] bg-stone-100 mb-4 flex items-center justify-center relative overflow-hidden">
                                                    <div className="absolute top-2 right-2 bg-stone-900/80 text-white text-[10px] uppercase font-bold px-2 py-1 z-10">
                                                        Style Inspiration
                                                    </div>
                                                    <Palette size={32} className="text-stone-300" />
                                                </div>
                                                <h4 className="font-serif text-lg text-stone-600">{rec.item.title}</h4>
                                                <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">Vibe Reference</p>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div key={idx} className="h-full border border-brand-secondary/30 bg-brand-secondary/5 p-6 flex flex-col justify-center text-center rounded-sm hover:shadow-lg transition-shadow">
                                                <Sparkles className="mx-auto text-brand-secondary mb-4" size={32} />
                                                <h4 className="font-serif text-xl text-brand-primary mb-3">Custom Creation</h4>
                                                <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                                                    "{rec.item.description}"
                                                </p>
                                                <button className="btn-primary w-full text-xs uppercase tracking-widest">
                                                    Request Consultation
                                                </button>
                                            </div>
                                        );
                                    }
                                })
                            ) : (
                                // Fallback mock cards
                                [1, 2, 3].map(i => (
                                    <div key={i} className="bg-white p-4 border border-stone-200">
                                        <div className="aspect-[3/4] bg-stone-100 mb-4 flex items-center justify-center text-stone-300">
                                            <Shirt size={32} />
                                        </div>
                                        <h4 className="font-serif text-lg">Twostones Selection {i}</h4>
                                        <p className="text-xs text-stone-400 uppercase tracking-widest">Recommended Look</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-12 text-center">
                            <button
                                onClick={() => {
                                    setFormData({ bodyType: '', undertone: '', occasion: '' });
                                    setRecommendation(null);
                                    setCurrentStep(0);
                                }}
                                className="text-brand-secondary border-b border-brand-secondary pb-1 text-sm tracking-widest uppercase hover:text-brand-primary hover:border-brand-primary transition-colors"
                            >
                                Start New Session
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 bg-brand-bg">
            <div className="max-w-4xl mx-auto mb-12">
                {/* Progress Bar */}
                <div className="flex items-center justify-between relative mb-16 px-4">
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-stone-200 -z-10"></div>
                    <div className={`absolute left-0 top-1/2 h-0.5 bg-brand-secondary -z-10 transition-all duration-500`} style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>

                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = index <= currentStep;

                        return (
                            <div key={step.id} className="flex flex-col items-center bg-brand-bg px-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive ? 'bg-brand-secondary border-brand-secondary text-white' : 'bg-white border-stone-200 text-stone-300'}`}>
                                    <Icon size={18} />
                                </div>
                                <span className={`text-[10px] uppercase tracking-widest font-bold mt-2 ${isActive ? 'text-brand-primary' : 'text-stone-300'}`}>{step.title}</span>
                            </div>
                        );
                    })}
                </div>

                <div className="min-h-[500px]">
                    {renderStep()}
                </div>

                {/* Navigation Buttons (Results step has its own reset) */}
                {currentStep < 3 && (
                    <div className="flex justify-between mt-12 border-t border-stone-100 pt-8">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-2 text-xs uppercase tracking-widest font-bold transition-colors ${currentStep === 0 ? 'text-stone-300 cursor-not-allowed' : 'text-stone-500 hover:text-brand-primary'}`}
                        >
                            <ArrowLeft size={16} /> Back
                        </button>

                        {/* Only show 'Next' if it's not a selection step that auto-advances, or allow manual override */}
                        <button
                            onClick={handleNext}
                            disabled={!formData[steps[currentStep].id as keyof typeof formData]}
                            className={`flex items-center gap-2 text-xs uppercase tracking-widest font-bold transition-colors ${!formData[steps[currentStep].id as keyof typeof formData] ? 'text-stone-300 cursor-not-allowed' : 'text-brand-secondary hover:text-brand-primary'}`}
                        >
                            Next Step <ArrowRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIStylist;
