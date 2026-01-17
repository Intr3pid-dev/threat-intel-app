import Link from "next/link";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface GlassTileProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    gradient?: string;
    className?: string;
}

export function GlassTile({
    title,
    description,
    icon: Icon,
    href,
    gradient = "from-primary/20 to-primary/5",
    className,
}: GlassTileProps) {
    return (
        <Link
            href={href}
            className={cn(
                "group relative flex flex-col items-center justify-center p-6 rounded-2xl",
                "bg-white/5 backdrop-blur-xl border border-white/10",
                "hover:bg-white/10 hover:border-primary/50 hover:scale-[1.02]",
                "transition-all duration-300 ease-out cursor-pointer",
                "shadow-lg shadow-black/20",
                className
            )}
        >
            {/* Gradient Glow Effect */}
            <div
                className={cn(
                    "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    "bg-gradient-to-br",
                    gradient
                )}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-colors">
                    <Icon className="h-7 w-7 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[180px]">
                        {description}
                    </p>
                </div>
            </div>

            {/* Shine Effect on Hover */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute -inset-full top-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700" />
            </div>
        </Link>
    );
}
