'use client';

import React from 'react';
import { RatingIconType } from '@/app/dashboard/campaigns/[id]/types';

interface RatingSystemProps {
  type: RatingIconType;
  value: number;
  onChange: (value: number) => void;
  primaryColor: string;
}

const EMOJI_MAP = ['😞', '😕', '😐', '😊', '😍'];

export default function RatingSystem({ type, value, onChange, primaryColor }: RatingSystemProps) {
  if (type === 'thumbs') {
    return (
      <div className="flex gap-6 mt-4">
        {[
          { icon: 'thumb_down', val: 1, label: 'Not Good' },
          { icon: 'thumb_up', val: 5, label: 'Excellent' }
        ].map((item) => (
          <button
            key={item.val}
            onClick={() => onChange(item.val)}
            className={`flex flex-col items-center gap-2 group transition-all active:scale-90`}
          >
            <div 
              className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${
                value === item.val ? 'shadow-lg scale-110' : 'opacity-60 border-outline-variant/30'
              }`}
              style={{ 
                borderColor: value === item.val ? primaryColor : undefined,
                backgroundColor: value === item.val ? `${primaryColor}10` : 'transparent'
              }}
            >
              <span 
                className="material-symbols-outlined text-3xl transition-colors"
                style={{ 
                  color: value === item.val ? primaryColor : '#747686',
                  fontVariationSettings: value === item.val ? "'FILL' 1" : "'FILL' 0"
                }}
              >
                {item.icon}
              </span>
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${
              value === item.val ? 'text-on-surface' : 'text-outline opacity-50'
            }`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    );
  }

  if (type === 'emoji') {
    return (
      <div className="flex gap-2 mt-4">
        {EMOJI_MAP.map((emoji, i) => {
          const ratingValue = i + 1;
          const isSelected = value === ratingValue;
          return (
            <button
              key={i}
              onClick={() => onChange(ratingValue)}
              className={`text-3xl w-12 h-12 flex items-center justify-center rounded-full transition-all active:scale-90 ${
                isSelected ? 'bg-surface-container-high shadow-inner scale-110' : 'opacity-50 grayscale'
              }`}
            >
              {emoji}
            </button>
          );
        })}
      </div>
    );
  }

  // Stars default
  return (
    <div className="flex gap-2 mt-4">
      {[1, 2, 3, 4, 5].map((star) => {
        const isSelected = star <= value;
        return (
          <button
            key={star}
            onClick={() => onChange(star)}
            className="transition-all active:scale-90"
          >
            <span
              className="material-symbols-outlined text-4xl cursor-pointer"
              style={{
                color: isSelected ? primaryColor : '#c4c5d7',
                fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              star
            </span>
          </button>
        );
      })}
    </div>
  );
}
