import { cn } from "@/libs/utils";

export function PageContainer({ children, className }: React.ComponentProps<'div'>) {
    return (
        <div className={cn(
            'flex min-h-[60vh] px-4 py-8 md:py-8 lg:py-12 items-center justify-center',
            className
        )}>
            {children}
        </div>
    )
}