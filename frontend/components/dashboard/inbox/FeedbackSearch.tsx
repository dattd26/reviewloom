import { useState, useEffect, memo } from 'react';

interface FeedbackSearchProps {
  onSearchChange: (value: string) => void;
}

export const FeedbackSearch = memo(({ onSearchChange }: FeedbackSearchProps) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(value);
    }, 400);
    return () => clearTimeout(handler);
  }, [value, onSearchChange]);

  return (
    <div className="relative w-full max-w-md focus-within:ring-2 focus-within:ring-primary/20 rounded-xl transition-all">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
      <input
        className="w-full bg-surface-container-low border-none rounded-xl py-2.5 pl-10 pr-4 text-sm font-body focus:ring-0 text-on-surface placeholder:text-outline"
        placeholder="Search feedback..."
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
});

FeedbackSearch.displayName = 'FeedbackSearch';
