import * as React from 'react';
import { cn } from '@/libs/utils';
import { EyeIcon, EyeOffIcon, ChevronDown, Check } from 'lucide-react';
import * as SelectPrimitive from "@radix-ui/react-select";
import {
    Controller,
    type ControllerProps,
    type FieldPath,
    type FieldValues,
    type FieldError
} from 'react-hook-form';

type FormFieldContextValue = {
    fieldId: string;
    errorId: string;
    error?: FieldError;
};

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

function useFormField() {
    const context = React.useContext(FormFieldContext);
    if (!context) {
        throw new Error('useFormField deve ser usado dentro de FormField');
    }
    return context;
}

export function FormField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ ...props }: ControllerProps<TFieldValues, TName>) {
    return (
        <Controller
            {...props}
            render={(renderProps) => {
                const fieldId = React.useId();
                const errorId = `${fieldId}-error`;

                const contextValue: FormFieldContextValue = {
                    fieldId,
                    errorId,
                    error: renderProps.fieldState.error,
                };

                return (
                    <FormFieldContext.Provider value={contextValue}>
                        {props.render(renderProps)}
                    </FormFieldContext.Provider>
                );
            }}
        />
    );
}

export function FormContainer({ children, className, ...props }: React.ComponentProps<'form'>) {
    return (
        <form
            className={cn("flex flex-col items-center gap-2", className)}
            {...props}
        >
            {children}
        </form>
    );
}

export function FormFieldGroup({ children, className, ...props }: React.ComponentProps<'form'>) {
    return (
        <section
            className={cn("grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-2", className)}
            {...props}
        >
            {children}
        </section>
    );
}

export function FormItem({ children, className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn("w-full space-y-2", className)}
            {...props}
        >
            {children}
        </div>
    );
}

export function FormLabel({ children, className, ...props }: React.ComponentProps<'label'>) {
    const { fieldId } = useFormField();

    return (
        <label
            htmlFor={fieldId}
            className={cn("text-xl font-medium text-foreground", className)}
            {...props}
        >
            {children}
        </label>
    );
}

export function FormMessage({ children, className, ...props }: React.ComponentProps<'p'>) {
    const { error, errorId } = useFormField();
    const body = error ? error.message : children;

    if (!body) {
        return null;
    }

    return (
        <p
            id={errorId}
            role="alert"
            aria-live="polite"
            className={cn(
                "mt-1 text-lg font-medium text-red-500",
                className
            )}
            {...props}
        >
            {body}
        </p>
    );
}

export function FormMessageReserved({ children, className, ...props }: React.ComponentProps<'p'>) {
    const { error, errorId } = useFormField();
    const body = error ? error.message : children;

    return (
        <p
            id={errorId}
            role={error ? "alert" : undefined}
            aria-live={error ? "polite" : undefined}
            className={cn(
                "mt-1 min-h-7 text-xl font-normal text-red-500",
                !error && "invisible",
                className
            )}
            {...props}
        >
            {body || "placeholder"}
        </p>
    );
}

export function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
    const { fieldId, errorId, error } = useFormField();
    const [showPassword, setShowPassword] = React.useState(false);
    const inputType = type === 'password' && showPassword ? 'text' : type;

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <div className="relative">
            <input
                id={fieldId}
                type={inputType}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? errorId : undefined}
                data-slot="input"
                className={cn(
                    'bg-secondary/30 text-xl text-secondary-foreground rounded-[1.25rem] w-140 h-16 px-10',
                    'focus:outline-none focus:ring-3 focus:ring-secondary/60',
                    error && 'ring-2 ring-red-500',
                    className
                )}
                {...props}
            />

            {type === 'password' && (
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className={cn(
                        "bg-secondary/40 hover:bg-secondary/70 cursor-pointer transition-colors duration-200",
                        "text-secondary-foreground absolute top-1/2 -translate-y-1/2 right-0 p-2.5 rounded-2xl mr-5"
                    )}
                    aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                    tabIndex={-1}
                >
                    {showPassword ? (
                        <EyeOffIcon className="size-5" />
                    ) : (
                        <EyeIcon className="size-5" />
                    )}
                </button>
            )}
        </div>
    );
}

export function Select({
    options,
    placeholder,
    className,
    ...props
}: React.ComponentProps<typeof SelectPrimitive.Root> & {
    options: { label: string; value: string }[],
    placeholder?: string,
    className?: string
}) {
    return (
        <SelectPrimitive.Root {...props}>
            <SelectPrimitive.Trigger
                className={cn(
                    'flex items-center justify-between gap-6 bg-secondary/30 text-xl text-secondary-foreground rounded-[1.25rem] w-140 h-16 px-8',
                    'focus:outline-none focus:ring-3 focus:ring-secondary/60 transition-all text-left',
                    className
                )}
            >
                <SelectPrimitive.Value placeholder={placeholder} />
                <SelectPrimitive.Icon>
                    <ChevronDown className="size-5 opacity-50" />
                </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>

            <SelectPrimitive.Portal>
                <SelectPrimitive.Content
                    className="mt-18 overflow-hidden bg-primary text-secondary-foreground rounded-2xl shadow-xl min-w-(--radix-select-trigger-)"
                >
                    <SelectPrimitive.Viewport className="p-2">
                        {options.map((opt, index) => (
                            <React.Fragment key={opt.value}>
                                <SelectPrimitive.Item
                                    key={opt.value}
                                    value={opt.value}
                                    className={cn(
                                        "relative flex w-full cursor-pointer select-none border-black/5 items-center rounded-xl py-3 px-8 text-lg outline-none",
                                        "focus:bg-yellow-400 data-disabled:pointer-events-none data-disabled:opacity-50"
                                    )}
                                >
                                    <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                                    <SelectPrimitive.ItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                                        <Check className="size-4" />
                                    </SelectPrimitive.ItemIndicator>
                                </SelectPrimitive.Item>

                                {index < options.length - 1 && (
                                    <SelectPrimitive.Separator className="m-auto h-0.5 w-[90%] bg-yellow-400 my-1" />
                                )}
                            </React.Fragment>
                        ))}
                    </SelectPrimitive.Viewport>
                </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
    );
}