export function StrategicAdvice() {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-6 rounded-3xl shadow-sm border border-primary/10 animate-slide-up relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none transition-transform group-hover:scale-125 duration-700" />
      <div className="flex items-center gap-2 mb-3 relative z-10">
        <span className="material-symbols-outlined text-primary text-[20px]">lightbulb</span>
        <h3 className="font-headline font-bold text-sm text-on-surface">Review Strategy Tip</h3>
      </div>
      <p className="text-xs text-on-surface-variant leading-relaxed relative z-10 mb-5">
        Place your QR table signs near the checkout counter or directly on dining tables. Customers are <strong className="text-primary font-bold">3x more likely</strong> to scan and leave a Google review when prompted during their visit.
      </p>
      <button className="text-[10px] font-bold text-primary uppercase tracking-wider hover:text-primary-container transition-colors relative z-10 flex items-center gap-1">
        Read Printing Guide
        <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">arrow_forward</span>
      </button>
    </div>
  );
}
