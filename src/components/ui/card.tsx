import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    title?: string;
    icon?: ReactNode;
}

export function Card({ children, className, title, icon }: CardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden border border-border bg-card p-3 shadow-none transition-all duration-200 hover:border-primary/50",
                className
            )}
        >
            {(title || icon) && (
                <div className="mb-4 flex items-center gap-2 border-b border-border/50 pb-3">
                    {icon && <span className="text-primary">{icon}</span>}
                    {title && (
                        <h3 className="font-sans text-base font-semibold text-foreground">
                            {title}
                        </h3>
                    )}
                </div>
            )}
            <div className="relative z-10">{children}</div>
        </div>
    );
}
