import React from 'react';

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 15C30.67 15 15 30.67 15 50C15 58.72 18.2 66.7 23.5 72.83L18 85L30.17 79.5C36.3 84.8 44.28 88 53 88C72.33 88 88 72.33 88 53C88 33.67 72.33 18 53 18" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M35 40V65" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      <path d="M45 35V70" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      <path d="M55 35V70" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      <path d="M65 40V65" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      <path d="M30 45H70" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      <path d="M30 55H70" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      <path d="M30 65H70" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );
}
