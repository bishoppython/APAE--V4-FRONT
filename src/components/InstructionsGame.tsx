import React from 'react';

interface InstructionsGameProps {
  children: React.ReactNode;
}

export default function InstructionsGame({ children }: InstructionsGameProps) {
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-900 px-6 py-4 rounded-xl max-w-5xl w-full text-center shadow-sm my-4">
      <p className="font-medium text-lg flex items-center justify-center gap-2">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 text-amber-500 shrink-0" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        {children}
      </p>
    </div>
  );
}