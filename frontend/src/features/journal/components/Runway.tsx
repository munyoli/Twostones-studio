import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { journalApi } from '../../../services/api';
import { Play, Pause, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Runway = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const navigate = useNavigate();

  const { data: entries, isLoading } = useQuery({
    queryKey: ['journal-entries'],
    queryFn: () => journalApi.getEntries().then(res => res.data),
  });

  const journalEntries = entries?.sort((a: any, b: any) => a.day_number - b.day_number) || [];

  useEffect(() => {
    let interval: any;
    if (isPlaying && journalEntries.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % journalEntries.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, journalEntries.length]);

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white font-serif">
        <Loader2 className="animate-spin mb-4 text-brand-primary" size={48} />
        <p className="uppercase tracking-[0.5em] text-xs">Summoning the Runway...</p>
      </div>
    );
  }

  if (journalEntries.length === 0) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center text-white">
        <p>No spirits found for the runway.</p>
      </div>
    );
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % journalEntries.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + journalEntries.length) % journalEntries.length);
  };

  const currentEntry = journalEntries[currentIndex];

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center font-serif">
      {/* Background/Image Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.2, y: 40 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { 
              duration: 2.5, 
              ease: [0.16, 1, 0.3, 1] // Custom luxury ease-out
            }
          }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 1 } }}
          className="absolute inset-0 w-full h-full flex items-center justify-center"
        >
          {/* Walking Motion Wrapper */}
          <motion.div
            animate={isPlaying ? {
              y: [0, -15, 0],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            } : {}}
            className="w-full h-full relative"
          >
            <img
              src={currentEntry.image_url}
              alt={currentEntry.title}
              className="w-full h-full object-cover opacity-80"
            />
          </motion.div>
          
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60" />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-6xl px-8 flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-4"
          >
            <span className="text-brand-primary-light uppercase tracking-[0.3em] text-sm md:text-base font-sans">
              Day {currentEntry.day_number}
            </span>
            <h1 className="text-6xl md:text-9xl text-white font-serif italic font-light tracking-tight">
              {currentEntry.title}
            </h1>
            <div className="h-px w-24 bg-brand-primary/50 mx-auto mt-8 mb-4" />
            <p className="text-white/60 uppercase tracking-widest text-[10px] md:text-xs font-sans">
              The Twostones Foundational Collection
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Vertical Branding */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-left hidden md:block">
        <span className="text-white/20 uppercase tracking-[1em] text-[10px] whitespace-nowrap">
          Twostones Studio | Biblical Couture
        </span>
      </div>

      {/* Controls */}
      <div className="absolute bottom-12 left-0 right-0 z-20 flex flex-col items-center space-y-8">
        {/* Progress Bar */}
        <div className="w-1/2 max-w-md h-px bg-white/20 relative overflow-hidden">
          <motion.div
            key={currentIndex + (isPlaying ? '-playing' : '-paused')}
            initial={{ x: "-100%" }}
            animate={{ x: isPlaying ? "0%" : "-100%" }}
            transition={{ duration: 5, ease: "linear" }}
            className="absolute inset-0 bg-brand-primary h-full"
          />
        </div>

        <div className="flex items-center space-x-12 text-white/80">
          <button onClick={handlePrev} className="hover:text-white transition-colors">
            <ChevronLeft size={32} strokeWidth={1} />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all hover:scale-110"
          >
            {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="ml-1" />}
          </button>

          <button onClick={handleNext} className="hover:text-white transition-colors">
            <ChevronRight size={32} strokeWidth={1} />
          </button>
        </div>
      </div>

      {/* Exit Button */}
      <button 
        onClick={() => navigate('/journal')}
        className="absolute top-8 right-8 z-30 text-white/50 hover:text-white transition-colors"
      >
        <X size={32} strokeWidth={1} />
      </button>

      {/* Counter */}
      <div className="absolute bottom-8 right-12 z-20 text-white/30 font-sans text-sm tracking-widest">
        {String(currentIndex + 1).padStart(2, '0')} / {journalEntries.length}
      </div>
    </div>
  );
};
