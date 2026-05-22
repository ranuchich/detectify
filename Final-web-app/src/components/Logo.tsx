import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Globe Grid */}
        <circle cx="50" cy="50" r="40" fill="#EBF5FF" />
        <circle cx="50" cy="50" r="40" stroke="#93C5FD" strokeWidth="0.5" />
        <path d="M50 10V90 M10 50H90" stroke="#93C5FD" strokeWidth="0.5" strokeDasharray="2 2" />
        <ellipse cx="50" cy="50" rx="40" ry="15" stroke="#93C5FD" strokeWidth="0.5" strokeDasharray="2 2" transform="rotate(45 50 50)" />
        <ellipse cx="50" cy="50" rx="40" ry="15" stroke="#93C5FD" strokeWidth="0.5" strokeDasharray="2 2" transform="rotate(-45 50 50)" />

        {/* Outer Orbit */}
        <ellipse
          cx="50"
          cy="55"
          rx="45"
          ry="18"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinecap="round"
          transform="rotate(-15 50 55)"
        />

        {/* Sparkle Star */}
        <path
          d="M20 35C20 35 25 30 30 30C25 30 20 25 20 25C20 25 15 30 10 30C15 30 20 35 20 35Z"
          fill="#3B82F6"
        />
        
        {/* Text Area (Simulated) */}
        <circle cx="50" cy="50" r="3" fill="#3B82F6" className="animate-pulse" />
      </svg>
    </div>
  );
};
