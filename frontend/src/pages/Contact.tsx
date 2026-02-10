import { useState } from 'react';
import { Mail, Instagram, Facebook, MessageCircle, Send, MapPin } from 'lucide-react';

const Contact = () => {
    const [status, setStatus] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        // Simulate form submission
        setTimeout(() => {
            setStatus('success');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-brand-bg pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-20 max-w-2xl mx-auto">
                    <h2 className="text-xs uppercase tracking-[0.5em] text-brand-secondary mb-4 font-bold">Connect With Us</h2>
                    <h1 className="text-5xl font-serif font-bold text-brand-primary mb-6">Start a Conversation</h1>
                    <p className="text-stone-500 font-light leading-relaxed">
                        Whether you have a question about our collections, need styling advice, or simply wish to share your journey with us, our team is here to listen and serve with excellence.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Contact Form */}
                    <div className="bg-white p-10 md:p-16 shadow-xl border border-stone-100">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border-b border-stone-200 py-4 outline-none focus:border-brand-secondary transition-colors text-brand-primary"
                                        placeholder="Grace Mensah"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full border-b border-stone-200 py-4 outline-none focus:border-brand-secondary transition-colors text-brand-primary"
                                        placeholder="grace@example.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Subject</label>
                                <select className="w-full border-b border-stone-200 py-4 outline-none focus:border-brand-secondary transition-colors text-brand-primary bg-transparent">
                                    <option>General Inquiry</option>
                                    <option>Orders & Shipping</option>
                                    <option>Custom Fitting</option>
                                    <option>Feedback</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Your Message</label>
                                <textarea
                                    rows={4}
                                    required
                                    className="w-full border-b border-stone-200 py-4 outline-none focus:border-brand-secondary transition-colors text-brand-primary resize-none"
                                    placeholder="How can we assist you today?"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="w-full btn-primary flex items-center justify-center gap-3 group disabled:opacity-50"
                            >
                                {status === 'sending' ? 'Sending...' : (
                                    <>
                                        Send Message <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            {status === 'success' && (
                                <p className="text-center text-green-600 font-medium animate-fade-in">
                                    Thank you. Your message has been received with grace.
                                </p>
                            )}
                        </form>
                    </div>

                    {/* Reach Out Details */}
                    <div className="space-y-16 py-10">
                        <section>
                            <h3 className="text-xs uppercase tracking-widest font-bold text-brand-primary mb-8 pb-4 border-b border-stone-100">Our Atmosphere</h3>
                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center text-brand-secondary flex-shrink-0">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-brand-primary text-sm uppercase tracking-tighter mb-1">Email Correspondence</h4>
                                        <p className="text-stone-500 font-light">manukato.twostones@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MessageCircle size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-serif font-bold text-brand-primary mb-2">WhatsApp</h3>
                                        <p className="text-stone-500 font-light">+254 715 961 659</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-xs uppercase tracking-widest font-bold text-brand-primary mb-8 pb-4 border-b border-stone-100">Digital Presence</h3>
                            <div className="flex gap-6">
                                <a href="https://instagram.com/shop_twostones" target="_blank" rel="noopener noreferrer" className="w-14 h-14 border border-stone-200 rounded-full flex items-center justify-center text-stone-400 hover:text-brand-secondary hover:border-brand-secondary transition-all group">
                                    <Instagram size={24} />
                                </a>
                                <a href="https://facebook.com/ShopTwostones" target="_blank" rel="noopener noreferrer" className="w-14 h-14 border border-stone-200 rounded-full flex items-center justify-center text-stone-400 hover:text-brand-secondary hover:border-brand-secondary transition-all group">
                                    <Facebook size={24} />
                                </a>
                                <a href="https://tiktok.com/@twostones" target="_blank" rel="noopener noreferrer" className="w-14 h-14 border border-stone-200 rounded-full flex items-center justify-center text-stone-400 hover:text-brand-secondary hover:border-brand-secondary transition-all group font-bold text-lg">
                                    <span className="text-xs">🎶</span>
                                </a>
                            </div>
                        </section>

                        <section className="bg-stone-50 p-8 rounded-lg">
                            <h4 className="text-xs uppercase tracking-widest font-bold text-brand-primary mb-4 flex items-center gap-2">
                                <MapPin size={14} className="text-brand-secondary" /> Studio Address
                            </h4>
                            <p className="text-stone-500 font-light italic leading-relaxed">
                                Buruburu Shopping Complex, Suite E5<br />
                                Nairobi, Kenya. <br />
                                <span className="text-[10px] mt-2 block opacity-50 uppercase tracking-tighter">By Appointment Only</span>
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
