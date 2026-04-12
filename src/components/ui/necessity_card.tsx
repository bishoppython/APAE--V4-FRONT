import { cn } from '@/libs/utils';
import * as React from 'react';

export function NecessityCardContainer({ children }: React.ComponentProps<'button'>) {
    return <button className={cn(
        'size-80 rounded-[1.25rem] flex flex-col items-center justify-between hover:scale-110 cursor-pointer',
        'focus:outline-none focus:ring-3 focus:ring-secondary/60 transition-all duration-300',
    )}
    >
        {children}
    </button>
}

export function NecessityCardImage({ src, alt }: React.ComponentProps<'img'>) {
    return <div className='rounded-t-[1.25rem] flex justify-center items-center overflow-hidden'>
        <img src={src} alt={alt} />
    </div>
}

export function NecessityCardTitle({ children }: React.ComponentProps<'h1'>) {
    return <div className='w-full bg-primary text-white font-semibold text-center rounded-b-[1.25rem] h-15 flex items-center justify-center text-2xl'>
        {children}
    </div>
}
