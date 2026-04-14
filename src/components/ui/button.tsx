import { cn } from '@/libs/utils';
import * as React from 'react';

interface IButtonProps extends React.ComponentProps<'button'> {
    variant?: 'primary' | 'secundary' | 'tertiary' | 'quaternary';
    isDisabled?: boolean;
}

function Button({
    children,
    className,
    variant = 'primary',
    isDisabled = false,
    ...props
}: IButtonProps) {
    return (
        <button
            disabled={isDisabled}
            className={cn(
                'rounded-[10px] cursor-pointer hover:scale-105 transition-all duration-300',
                'inline-flex items-center px-1 justify-center gap-3',
                variant === 'primary' && 'w-85 h-15 bg-primary text-2xl',
                variant === 'secundary' && 'w-60 h-14 text-[14px] border-2 border-secondary/60',
                variant === 'tertiary' && 'w-30 h-15 bg-[#46CF0C] text-[26px] font-medium',
                variant === 'quaternary' && 'w-100 h-15 bg-red-600 text-[26px] font-medium',
                isDisabled && 'opacity-50 cursor-not-allowed hover:scale-100',
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}

export { Button };