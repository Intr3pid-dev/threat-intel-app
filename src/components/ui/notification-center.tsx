"use client";

import { useAuthStore } from "@/lib/store";
import { Bell, Check, Trash2, AlertTriangle, Info, CheckCircle, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

import { useRouter } from "next/navigation";

export function NotificationCenter() {
    const { notifications, markAsRead, markAllAsRead, clearNotifications } = useAuthStore();
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleNotificationClick = (id: string, actionUrl?: string) => {
        markAsRead(id);
        if (actionUrl) {
            router.push(actionUrl);
            setOpen(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'alert': return <AlertOctagon className="h-4 w-4 text-red-500" />;
            case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
            case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
            default: return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button className="relative rounded-full p-2 hover:bg-accent transition-colors">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    {unreadCount > 0 && (
                        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white animate-pulse">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 border-primary/20 bg-card/95 backdrop-blur-md" align="end">
                <div className="flex items-center justify-between border-b border-border p-4">
                    <h4 className="font-semibold leading-none text-glow">Notifications</h4>
                    <div className="flex gap-2">
                        <button
                            onClick={() => markAllAsRead()}
                            className="text-xs text-muted-foreground hover:text-primary transition-colors"
                            title="Mark all as read"
                        >
                            <Check className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => clearNotifications()}
                            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                            title="Clear all"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-4 text-muted-foreground">
                            <Bell className="h-8 w-8 mb-2 opacity-20" />
                            <p className="text-sm">No notifications</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notification) => (
                                <button
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification.id, notification.actionUrl)}
                                    className={cn(
                                        "flex gap-3 border-b border-border/50 p-4 text-left transition-colors hover:bg-muted/50",
                                        !notification.read && "bg-primary/5",
                                        notification.actionUrl && "cursor-pointer hover:bg-primary/10"
                                    )}
                                >
                                    <div className="mt-1">{getIcon(notification.type)}</div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className={cn("text-sm font-medium leading-none", !notification.read && "text-primary")}>
                                                {notification.title}
                                            </p>
                                            {notification.actionUrl && (
                                                <span className="text-[10px] text-primary/70 border border-primary/20 px-1 rounded">ACTION</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {notification.message}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground/50">
                                            {new Date(notification.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
