import { cn } from '@/libs/utils';
import * as React from 'react';

interface IButtonProps extends React.ComponentProps<'button'> {
    variant: 'primary' | 'secundary';
    isDisabled?: boolean
}

function Button({ children, className, variant = 'primary', isDisabled = false, ...props }: IButtonProps) {
    return <button
        disabled={isDisabled}
        className={cn(
            'rounded-[10px] cursor-pointer hover:scale-110 transition-all duration-350 hover:disabled:scale-100',
            { 'w-85 h-15 bg-primary text-2xl ': variant === 'primary' },
            { 'w-60 h-14 text-[14px] border-2 border-secondary/60': variant === 'secundary' },
            { 'opacity-50 cursor-not-allowed': isDisabled },
            // to do adicionar imagens ao lado do texto 
            className
        )}
        {...props}>
        {children}
    </button>
}

export { Button }

