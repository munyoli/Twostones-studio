import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const sections = [
        {
            title: "Orders & Payments",
            items: [
                {
                    q: "How can I be sure my order has been received?",
                    a: "Upon completing your transaction, you will receive a confirmation email detailing your selection. As a brand focused on excellence, we also verify every order manually before processing to ensure accuracy."
                },
                {
                    q: "What payment methods do you accept?",
                    a: "We accept all major credit cards, as well as M-Pesa for our local clients. All transactions are processed through secure, encrypted gateways to ensure your peace of mind."
                }
            ]
        },
        {
            title: "Shipping & Delivery",
            items: [
                {
                    q: "Do you ship internationally?",
                    a: "Yes, Twostones pieces are crafted to be shared with the global community. We ship to most countries worldwide via expedited courier services to ensure your garments arrive safely and promptly."
                },
                {
                    q: "How long will my order take to arrive?",
                    a: "Ready-To-Wear items are typically processed within 2-3 business days. Local delivery (Kenya) takes 1-2 days thereafter, while international shipping usually takes 5-7 business days."
                }
            ]
        },
        {
            title: "Returns & Exchanges",
            items: [
                {
                    q: "What is your return policy?",
                    a: "We want you to feel whole and confident in your Twostones piece. We accept returns on all unworn, unaltered garments with original tags within 14 days of delivery. Please note that custom-fitted items are final sale due to their unique nature."
                },
                {
                    q: "How do I initiate a return?",
                    a: "Simply contact our concierge team at manukato.twostones@gmail.com with your order number. We will guide you through the process with care and efficiency."
                }
            ]
        },
        {
            title: "Sizing & Fit",
            items: [
                {
                    q: "How do I know which size to choose?",
                    a: "We provide a detailed Size Guide for all our Manukato RTW pieces. We also recommend using our Client Measurements Portal to save your data for more accurate recommendations from our AI Stylist."
                },
                {
                    q: "What if I'm between sizes?",
                    a: "Most of our silhouettes are designed with a modest, elegant flow. If you prefer a more structured look, we recommend sizing down; for a more relaxed, draped feel, size up. You can also consult our AI Stylist for personalized advice."
                }
            ]
        },
        {
            title: "Our Philosophy",
            items: [
                {
                    q: "What does 'Crafted for wholeness' mean?",
                    a: "It is our core mission. We believe that true engagement with the world starts with being at ease with oneself. Our clothing aims to reflect inner dignity, confidence, and peace through external excellence and modesty."
                },
                {
                    q: "Are your garments made locally?",
                    a: "Yes, every Twostones piece is designed and crafted by skilled artisans in Nairobi, Kenya. We pride ourselves on ethical production and the preservation of African craftsmanship."
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-brand-bg pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-20">
                    <h2 className="text-xs uppercase tracking-[0.5em] text-brand-secondary mb-4 font-bold">Clarity & Trust</h2>
                    <h1 className="text-5xl font-serif font-bold text-brand-primary mb-6">Frequently Asked Questions</h1>
                    <p className="text-stone-500 font-light leading-relaxed max-w-2xl mx-auto">
                        In the pursuit of excellence, we aim for total transparency. If your question is not addressed below, please do not hesitate to reach out to us.
                    </p>
                </header>

                <div className="space-y-16">
                    {sections.map((section, sIndex) => (
                        <div key={sIndex} className="animate-fade-in" style={{ animationDelay: `${sIndex * 100}ms` }}>
                            <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-brand-secondary mb-8 border-b border-stone-100 pb-4">
                                {section.title}
                            </h3>
                            <div className="space-y-4">
                                {section.items.map((item, iIndex) => {
                                    const currentIndex = sIndex * 100 + iIndex;
                                    const isOpen = openIndex === currentIndex;
                                    return (
                                        <div key={iIndex} className="border border-stone-200 bg-white overflow-hidden transition-all duration-300">
                                            <button
                                                onClick={() => setOpenIndex(isOpen ? null : currentIndex)}
                                                className="w-full flex items-center justify-between p-6 text-left hover:bg-stone-50 transition-colors"
                                            >
                                                <span className="font-serif font-bold text-brand-primary tracking-tight">{item.q}</span>
                                                {isOpen ? <ChevronUp size={18} className="text-brand-secondary" /> : <ChevronDown size={18} className="text-stone-300" />}
                                            </button>
                                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                                                <div className="p-6 pt-0 text-stone-500 font-light leading-relaxed border-t border-stone-50">
                                                    {item.a}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-24 p-12 bg-brand-primary text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-serif font-bold mb-4 italic">Still seeking clarity?</h3>
                        <p className="text-stone-300 font-light mb-8 max-w-md mx-auto">Our concierge team is available to assist you with any specific inquiries you may have.</p>
                        <a href="/contact" className="inline-block px-10 py-4 border border-white font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-brand-primary transition-all duration-500">
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
