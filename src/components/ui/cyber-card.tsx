import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CyberCardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    icon?: ReactNode;
}

export function CyberCard({ children, className, title, icon }: CyberCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-lg border border-border bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,243,255,0.1)]",
                className
            )}
        >
            {/* Corner Accents */}
            <div className="absolute -left-1 -top-1 h-3 w-3 border-l-2 border-t-2 border-primary opacity-50" />
            <div className="absolute -right-1 -top-1 h-3 w-3 border-r-2 border-t-2 border-primary opacity-50" />
            <div className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-primary opacity-50" />
            <div className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-primary opacity-50" />

            {(title || icon) && (
                <div className="mb-4 flex items-center gap-2 border-b border-border/50 pb-2">
                    {icon && <span className="text-primary">{icon}</span>}
                    {title && (
                        <h3 className="font-mono text-lg font-bold uppercase tracking-wider text-foreground">
                            {title}
                        </h3>
                    )}
                </div>
            )}
            <div className="relative z-10">{children}</div>
        </div>
    );
}
