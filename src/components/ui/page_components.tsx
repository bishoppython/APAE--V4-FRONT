import { cn } from "@/libs/utils";

export function PageContainer({ children, className }: React.ComponentProps<'main'>) {
    return (
        <main className={cn(
            'flex flex-col min-h-[60vh] px-4 py-6 md:pb-16 items-center justify-between gap-2 sm:gap-8',
            'mt-30 md:mt-[15vh]',
            className
        )}>
            {children}
        </main>
    )
}

export function PageTitle({ children, className, ...input }: React.ComponentProps<'h1'>) {
    return (
        <h1 className={cn(
            'text-[2.5rem] md:text-[3.25rem] text-center font-extrabold mb-2 sm:mb-0',
            className
        )} {...input}>
            {children}
        </h1>
    )
}



