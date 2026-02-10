import { Truck, RotateCcw, ShieldCheck, Globe } from 'lucide-react';

const ShippingReturns = () => {
    return (
        <div className="min-h-screen bg-brand-bg pt-32 pb-20 px-6">
            <div className="max-w-5xl mx-auto">
                <header className="text-center mb-20">
                    <h2 className="text-xs uppercase tracking-[0.5em] text-brand-secondary mb-4 font-bold">Our Promise</h2>
                    <h1 className="text-5xl font-serif font-bold text-brand-primary mb-6">Shipping & Returns</h1>
                    <p className="text-stone-500 font-light leading-relaxed max-w-2xl mx-auto">
                        We aim for excellence in every delivery. Your Twostones piece is handled with care from our studio to your door.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    <section className="bg-white p-12 shadow-sm border border-stone-100">
                        <Truck className="text-brand-secondary mb-6" size={32} />
                        <h3 className="text-xl font-serif font-bold text-brand-primary mb-6">Shipping Policy</h3>
                        <div className="space-y-6 text-stone-500 font-light leading-relaxed">
                            <p>
                                <strong className="text-brand-primary font-medium block mb-1">Processing Time</strong>
                                Ready-To-Wear items are processed within 2–3 business days. Custom orders involve a more detailed artisanal process and usually ship within 2–3 weeks.
                            </p>
                            <p>
                                <strong className="text-brand-primary font-medium block mb-1">Local Delivery (Kenya)</strong>
                                We offer flat-rate delivery within Nairobi and across Kenya through our trusted local partners. Delivery typically takes 1–2 days after processing.
                            </p>
                            <p>
                                <strong className="text-brand-primary font-medium block mb-1">Global Shipping</strong>
                                Twostones ships worldwide via DHL and FedEx. International delivery typically takes 5–7 business days depending on your location.
                            </p>
                        </div>
                    </section>

                    <section className="bg-white p-12 shadow-sm border border-stone-100">
                        <RotateCcw className="text-brand-secondary mb-6" size={32} />
                        <h3 className="text-xl font-serif font-bold text-brand-primary mb-6">Returns & Exchanges</h3>
                        <div className="space-y-6 text-stone-500 font-light leading-relaxed">
                            <p>
                                <strong className="text-brand-primary font-medium block mb-1">14-Day Return Window</strong>
                                If a garment does not meet your expectations for wholeness and fit, you may return it within 14 days of receipt for an exchange or store credit.
                            </p>
                            <p>
                                <strong className="text-brand-primary font-medium block mb-1">Condition Requirements</strong>
                                Garments must be returned in their original condition: unworn, unwashed, and with all Twostones tags attached.
                            </p>
                            <p>
                                <strong className="text-brand-primary font-medium block mb-1">Explanations</strong>
                                Custom items or those with personalized alterations are unfortunately not eligible for return as they have been crafted specifically for you.
                            </p>
                        </div>
                    </section>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-sm tracking-wide">
                    <div className="flex flex-col items-center gap-3">
                        <ShieldCheck className="text-stone-300" size={24} />
                        <p className="uppercase font-bold text-[10px] text-brand-primary">Secure Packaging</p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <Globe className="text-stone-300" size={24} />
                        <p className="uppercase font-bold text-[10px] text-brand-primary">Worldwide Tracking</p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                        <ShieldCheck className="text-stone-300" size={24} />
                        <p className="uppercase font-bold text-[10px] text-brand-primary">Quality Assurance</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingReturns;
