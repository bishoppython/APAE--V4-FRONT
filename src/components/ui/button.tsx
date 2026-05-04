import { cn } from '@/libs/utils';
import { useTTS } from '@/libs/text-to-speech';
import * as React from 'react';
import { cva } from 'class-variance-authority';

const ButtonVariants = cva(
    'rounded-[20px] cursor-pointer hover:scale-105 transition-all duration-300 inline-flex items-center px-1 justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
    {
        variants: {
            variant: {
                'primary': 'w-85 h-15 bg-primary text-2xl font-medium',
                'secondary': 'w-60 h-14 text-lg px-4 border-2 border-secondary/60',
                'tertiary': 'w-30 h-15 bg-[#46CF0C] text-2xl font-medium',
                'quaternary': 'w-100 h-15 bg-red-600 text-2xl font-medium',
            },
        }
    }
  }
)

interface IButtonProps extends React.ComponentProps<'button'> {
    title?: string;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
    isDisabled?: boolean;
    isSelected?: boolean
}

function ButtonGroup({ children, className }: React.ComponentProps<'div'>) {
  return <div className={cn(
    "flex flex-col md:flex-row justify-evenly items-center gap-2 md:gap-4 mb-8",
    className
  )}>
    {children}
  </div>
}

function Button({
  children,
  className,
  variant = 'primary',
  isDisabled = false,
  isSelected = false,
  title,
  onClick,
  ...props
}: IButtonProps) {
  const { play } = useTTS({ text: title ? title : '' });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    play();
    onClick?.(event);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        ButtonVariants({ variant }),
        isSelected && 'md:mx-4 scale-110 hover:scale-110 md:scale-115 md:hover:scale-115',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { Button, ButtonGroup };