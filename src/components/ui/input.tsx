import * as React from 'react';

import { cn } from '@/libs/utils';
import { EyeIcon } from 'lucide-react';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
    return (
        <div className="relative ">
            <input
                type={type}
                data-slot="input"
                className={cn(
                    'bg-secondary/30 text-xl text-secondary-foreground rounded-[1.25rem] w-140 h-16 pl-10',
                    'focus:outline-none focus:ring-3 focus:ring-secondary/60',
                    className
                )}
                {...props}
            />

            {type === 'password' && (
                // TODO: Implementar a funcionalidade de mostrar e esconder a senha
                <button
                    type="button"
                    className={cn(
                        "bg-secondary/40 hover:bg-secondary/70 cursor-pointer transition-colors duration-200 text-secondary-foreground absolute top-1/2 -translate-y-1/2 right-0 p-2.5 rounded-2xl mr-5"
                    )}
                >
                    <EyeIcon className="size-5" />
                </button>
            )}
        </div>
    );
}

export { Input };
