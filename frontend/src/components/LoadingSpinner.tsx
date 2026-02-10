// LoadingSpinner component

const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
            <div className="w-12 h-12 border-2 border-stone-100 border-t-brand-secondary rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-secondary font-bold">Loading</p>
        </div>
    );
};

export default LoadingSpinner;
