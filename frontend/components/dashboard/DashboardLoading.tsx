"use client";

import { Logo } from '@/components/ui/Logo';

interface DashboardLoadingProps {
  title?: string;
  description?: string;
}

export function DashboardLoading({
  title = "Preparing your dashboard...",
  description = "Fetching your latest review insights"
}: DashboardLoadingProps) {
  return (
    <div className="w-full h-full min-h-[calc(100vh-64px)] flex items-center justify-center bg-surface relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="flex flex-col items-center gap-6 relative z-10">
        {/* Animated Logo Container */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <Logo className="w-16 h-16 text-primary relative z-10 animate-bounce drop-shadow-xl" />
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <h3 className="font-headline font-bold text-xl text-on-surface tracking-tight animate-pulse">
            {title}
          </h3>
          <p className="text-sm text-on-surface-variant font-medium">
            {description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-48 h-1.5 bg-surface-container-high rounded-full overflow-hidden mt-4 relative">
          <div className="absolute top-0 left-0 h-full bg-primary rounded-full w-1/3 animate-[progress_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(300%); }
        }
      `}} />
    </div>
  );
}
