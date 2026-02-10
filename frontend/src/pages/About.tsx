import { motion } from 'framer-motion';
import { Target, Users, BookOpen, Crown } from 'lucide-react';
import ResponsiveImage from '../components/ResponsiveImage';

const About = () => {
    return (
        <div className="min-h-screen bg-brand-bg pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-20 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-xs uppercase tracking-[0.5em] text-brand-secondary mb-4 font-bold">Our Essence</h2>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-primary mb-8">Wholeness in Motion.</h1>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-[3/4] bg-stone-200 overflow-hidden">
                            {/* Placeholder for Founder Image - user can replace later */}
                            <img
                                src="http://localhost:5000/uploads/manukato/scarlet%20pants-800.webp"
                                alt="Founder"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-brand-primary p-8 flex flex-col justify-center text-white hidden md:flex">
                            <span className="text-6xl font-serif opacity-20 absolute top-4 left-4">"</span>
                            <p className="font-serif italic text-lg leading-relaxed relative z-10">
                                "We don't just dress the body; we honor the story it carries."
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <h3 className="text-3xl font-serif font-bold text-brand-primary">The Architect of Identity</h3>
                        <div className="space-y-6 text-stone-600 font-light leading-relaxed text-lg">
                            <p>
                                Twostones was born in 2022, not in a boardroom, but in the quiet resilience of a home office. Founded by a visionary with a background in finance, the brand emerged from a deep frustration with fashion that demands conformity. We saw a gap—not just in the market, but in the soul of the industry.
                            </p>
                            <p>
                                We exist for the woman who has walked through fire and come out refined, not consumed. The woman who wears her scars like gold. We believe that true style is an act of reclamation—taking back your narrative, your confidence, and your voice.
                            </p>
                            <p>
                                Every garment we create is a sanctuary. It is designed to hold space for your wholeness, honoring both your beauty and your brokenness. We don't hide who you are; we glorify the masterpiece you are becoming. This is not just clothing. It is armour for the audacious.
                            </p>
                        </div>
                        <div className="pt-8 items-center flex gap-4">
                            <div className="h-px bg-brand-secondary w-20"></div>
                            <span className="font-serif italic text-brand-primary">The Founder</span>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
                    <motion.div
                        whileHover={{ y: -10 }}
                        className="bg-white p-12 border border-stone-100 shadow-xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-bl-[100px] -mr-8 -mt-8 transition-all group-hover:scale-110"></div>
                        <Target size={48} className="text-brand-secondary mb-8 relative z-10" />
                        <h3 className="text-xl uppercase tracking-widest font-bold text-brand-primary mb-6 relative z-10">Our Mission</h3>
                        <p className="text-stone-500 leading-relaxed relative z-10 text-lg">
                            To clothe the whole woman in dignity, power, and grace. We are here to dismantle the narrative that you must be perfect to be worthy. Our mission is to create garments that serve as a daily reminder of your inherent value, empowering you to show up in the world—unapologetic, authentic, and whole.
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -10 }}
                        className="bg-brand-primary p-12 shadow-xl relative overflow-hidden group text-white"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[100px] -mr-8 -mt-8 transition-all group-hover:scale-110"></div>
                        <Crown size={48} className="text-brand-secondary mb-8 relative z-10" />
                        <h3 className="text-xl uppercase tracking-widest font-bold text-white mb-6 relative z-10">Our Vision</h3>
                        <p className="text-white/80 leading-relaxed relative z-10 text-lg">
                            A world where women no longer shrink to fit, but expand to fill their purpose. We envision Twostones as a global beacon of redemptive luxury—where fashion becomes a testimony of resilience, and every hem, stitch, and silhouette declares the glory of a life fully lived.
                        </p>
                    </motion.div>
                </div>

                <div className="text-center max-w-2xl mx-auto">
                    <BookOpen size={32} className="text-brand-secondary mx-auto mb-6" />
                    <p className="font-serif italic text-2xl text-brand-primary leading-relaxed">
                        "She is clothed with strength and dignity, and she laughs without fear of the future."
                    </p>
                    <p className="text-xs uppercase tracking-widest text-stone-400 mt-4 font-bold">Proverbs 31:25</p>
                </div>
            </div>
        </div>
    );
};

export default About;
