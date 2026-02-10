import { Ruler, Scissors, Info } from 'lucide-react';

const SizeGuide = () => {
    const sizeData = [
        { size: "XS", bust: "32-33", waist: "24-25", hips: "34-35" },
        { size: "S", bust: "34-35", waist: "26-27", hips: "36-37" },
        { size: "M", bust: "36-37", waist: "28-29", hips: "38-39" },
        { size: "L", bust: "38-40", waist: "30-32", hips: "40-42" },
        { size: "XL", bust: "41-43", waist: "33-35", hips: "43-45" },
        { size: "XXL", bust: "44-46", waist: "36-38", hips: "46-48" },
    ];

    return (
        <div className="min-h-screen bg-brand-bg pt-32 pb-20 px-6">
            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-20">
                    <h2 className="text-xs uppercase tracking-[0.5em] text-brand-secondary mb-4 font-bold">Divine Fit</h2>
                    <h1 className="text-5xl font-serif font-bold text-brand-primary mb-6">Size Guide</h1>
                    <p className="text-stone-500 font-light leading-relaxed max-w-2xl mx-auto">
                        Wholeness begins with comfort. Use our guide to find the silhouette that best honors your form.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
                    {/* Measurement Table */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="bg-white shadow-xl overflow-hidden border border-stone-100">
                            <table className="w-full text-left">
                                <thead className="bg-brand-primary text-white">
                                    <tr>
                                        <th className="p-6 text-[10px] uppercase tracking-widest font-bold">Size</th>
                                        <th className="p-6 text-[10px] uppercase tracking-widest font-bold">Bust (in)</th>
                                        <th className="p-6 text-[10px] uppercase tracking-widest font-bold">Waist (in)</th>
                                        <th className="p-6 text-[10px] uppercase tracking-widest font-bold">Hips (in)</th>
                                    </tr>
                                </thead>
                                <tbody className="text-stone-600 divide-y divide-stone-100 italic">
                                    {sizeData.map((row) => (
                                        <tr key={row.size} className="hover:bg-stone-50 transition-colors">
                                            <td className="p-6 font-bold text-brand-primary">{row.size}</td>
                                            <td className="p-6">{row.bust}</td>
                                            <td className="p-6">{row.waist}</td>
                                            <td className="p-6">{row.hips}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 italic">
                            <div className="p-8 bg-white border-l-4 border-brand-secondary shadow-sm">
                                <h4 className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-brand-primary mb-4">
                                    <Info size={16} className="text-brand-secondary" /> Fit Notes
                                </h4>
                                <ul className="space-y-3 text-sm text-stone-500 font-light">
                                    <li>• **Structured**: Fits true to size, following the body's natural lines.</li>
                                    <li>• **Relaxed**: Designed with a generous drape for ease of movement.</li>
                                    <li>• **Tailored**: A more precise fit; if between sizes, we recommend sizing up.</li>
                                </ul>
                            </div>
                            <div className="p-8 bg-stone-900 text-white shadow-xl relative overflow-hidden">
                                <h4 className="text-xs uppercase tracking-widest font-bold text-brand-secondary mb-4">Pro Tip</h4>
                                <p className="text-stone-300 text-sm font-light leading-relaxed relative z-10">
                                    For the most accurate fit, we recommend saving your detailed measurements in our <strong>Client Portal</strong>. This allows our AI Stylist to provide tailored recommendations just for you.
                                </p>
                                <Scissors className="absolute -right-4 -bottom-4 text-white/5 rotate-45" size={100} />
                            </div>
                        </div>
                    </div>

                    {/* How to Measure */}
                    <div className="bg-white p-10 shadow-sm border border-stone-100">
                        <div className="flex items-center gap-3 mb-8">
                            <Ruler className="text-brand-secondary" size={24} />
                            <h3 className="text-lg font-serif font-bold text-brand-primary">How To Measure</h3>
                        </div>
                        <div className="space-y-10">
                            <div>
                                <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-secondary mb-2">01. Bust</h4>
                                <p className="text-sm text-stone-500 font-light leading-relaxed">Measure across the fullest part of your bust and straight around the back.</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-secondary mb-2">02. Waist</h4>
                                <p className="text-sm text-stone-500 font-light leading-relaxed">Measure around the narrowest part of your waistline, usually above your belly button.</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-secondary mb-2">03. Hips</h4>
                                <p className="text-sm text-stone-500 font-light leading-relaxed">Place your feet together and measure around the fullest part of your hips.</p>
                            </div>
                            <div className="pt-8 border-t border-stone-100">
                                <p className="text-xs text-stone-400 font-light italic">
                                    * Keep the measuring tape firm but not tight. Breathe naturally.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SizeGuide;
