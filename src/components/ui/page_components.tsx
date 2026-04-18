import { cn } from "@/libs/utils";

export function PageContainer({ children, className }: React.ComponentProps<'div'>) {
    return (
        <div className={cn(
            'flex flex-col min-h-[60vh] px-4 py-6 md:pb-16 items-center justify-between gap-8',
            className
        )}>
            {children}
        </div>
    )
}

export function PageTitle({ children, className, ...input }: React.ComponentProps<'h1'>) {
    return (
        <h1 className={cn(
            'text-[3.25rem] font-extrabold',
            className
        )} {...input}>
            {children}
        </h1>
    )
}



