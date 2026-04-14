import { cn } from '@/libs/utils';
import { Volume2 } from 'lucide-react';
import * as React from 'react';

export function NumbersContainer({ children, ...props }: React.ComponentProps<'button'>) {
    return (
        <button
            className='relative hover:scale-105 rounded-[1.25rem] cursor-pointer focus:outline-none focus:ring-3 focus:ring-secondary/60 transition-all duration-300'
            {...props}
        >
            <div className={cn(
                'size-60 rounded-[1.25rem] flex flex-col items-center justify-between',
            )}
            >
                {children}
            </div>
            <span
                className={cn(
                    "bg-primary text-white font-extrabold absolute top-7 -translate-y-1/2 right-0 p-2.5 rounded-2xl mr-2"   
                )}
            >
                <Volume2 className="size-5 stroke-3" />
            </span>
        </button>
    )
}

export function NumbersImage({ src, alt }: React.ComponentProps<'img'>) {
    return <div className='rounded-t-[1.25rem] flex justify-center items-center overflow-hidden'>
        <img src={src} alt={alt} />
    </div>
}

export function NumbersTitle({ children }: React.ComponentProps<'h1'>) {
    return <div className='w-full bg-primary text-white font-semibold text-center rounded-b-[1.25rem] h-12 flex items-center justify-center text-xl'>
        {children}
    </div>
}