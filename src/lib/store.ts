import { create } from 'zustand';

export type UserRole = 'admin' | 'analyst' | 'hunter';

export interface User {
    id: string;
    name: string;
    role: UserRole;
    avatar?: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'alert' | 'info' | 'success' | 'warning';
    timestamp: number;
    read: boolean;
    actionUrl?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    notifications: Notification[];
    login: (name: string, role: UserRole) => void;
    logout: () => void;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    notifications: [],

    login: (name, role) => set({
        user: {
            id: Math.random().toString(36).substr(2, 9),
            name,
            role,
            avatar: '/avatar-placeholder.png'
        },
        isAuthenticated: true
    }),

    logout: () => set({ user: null, isAuthenticated: false }),

    addNotification: (notification) => set((state) => ({
        notifications: [
            {
                ...notification,
                id: Math.random().toString(36).substr(2, 9),
                timestamp: Date.now(),
                read: false
            },
            ...state.notifications
        ].slice(0, 50) // Keep last 50 notifications
    })),

    markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        )
    })),

    markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
    })),

    clearNotifications: () => set({ notifications: [] })
}));
