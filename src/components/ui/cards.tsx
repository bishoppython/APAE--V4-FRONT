import { cn } from '@/libs/utils';
import { Volume2 } from 'lucide-react';
import * as React from 'react';

export function CardGroupContainer({ children, className }: React.ComponentProps<'div'>) {
    return (
        <div className={cn(
            'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8',
            className
        )}>
            {children}
        </div>
    )
}

export function CardContainer({ children, className, isDisabled, ...props }: React.ComponentProps<'button'> & { isDisabled?: boolean }) {
    return (
        <button
            className={cn(
                'relative m-auto hover:scale-105 rounded-[1.25rem] cursor-pointer focus:outline-none focus:ring-3 focus:ring-secondary/60 transition-all duration-300',
                isDisabled ? 'cursor-not-allowed opacity-60 hover:scale-100' : 'cursor-pointer',
                className
            )}
            disabled={isDisabled}
            {...props}
        >
            <div className='size-60 rounded-[1.25rem] flex flex-col items-center justify-between'>
                {children}
            </div>
            <span
                className="bg-primary text-white font-extrabold absolute top-7 -translate-y-1/2 right-0 p-2.5 rounded-2xl mr-2">
                <Volume2 className="size-5 stroke-3" />
            </span>
        </button>
    )
}

export function CardImage({ src, alt, className, ...input }: React.ComponentProps<'img'>) {
    return <div className={cn(
        'rounded-t-[1.25rem] flex justify-center items-center overflow-hidden',
        className
    )}>
        <img src={src} alt={alt} {...input} />
    </div>
}

export function CardTitle({ children, className, ...input }: React.ComponentProps<'h1'>) {
    return <div className={cn(
        'w-full bg-primary text-white font-semibold text-center rounded-b-[1.25rem] h-12 flex items-center justify-center text-xl',
        className
    )}>
        <h1 {...input}>
            {children}
        </h1>
    </div>
}
