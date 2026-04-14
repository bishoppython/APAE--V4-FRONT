import { cn } from "@/libs/utils";

export function PageContainer({ children, className }: React.ComponentProps<'div'>) {
    return (
        <div className={cn(
            'flex h-screen items-center justify-center',
            className
        )}>
            {children}
        </div>
    )
}