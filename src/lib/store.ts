import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'analyst' | 'hunter';

export interface User {
    id: string;
    name: string;
    role: UserRole;
    avatar?: string;
    email?: string;
    bio?: string;
    location?: string;
}

export interface UsageStats {
    apiCalls: number;
    threatsAnalyzed: number;
    reportsGenerated: number;
    lastActive: number;
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
    lastActive: number;
    notifications: Notification[];
    login: (email: string, password?: string) => Promise<boolean>;
    register: (user: Partial<User> & { password?: string }) => Promise<boolean>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
    preferences: {
        theme: 'dark' | 'light';
        notifications: boolean;
        sessionTimeout: number; // in minutes
    };
    setPreferences: (prefs: Partial<AuthState['preferences']>) => void;
    updateProfile: (data: Partial<User>) => void;
    usageStats: UsageStats;
    incrementUsage: (metric: keyof Omit<UsageStats, 'lastActive'>) => void;
    updateActivity: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            lastActive: Date.now(),
            notifications: [],

            login: async (email, password) => {
                try {
                    const res = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password }),
                    });

                    if (res.ok) {
                        const user = await res.json();
                        set({ user, isAuthenticated: true });
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error("Login failed", error);
                    return false;
                }
            },

            register: async (newUser) => {
                try {
                    const res = await fetch('/api/auth/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newUser),
                    });

                    if (res.ok) {
                        const user = await res.json();
                        set({ user, isAuthenticated: true });
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error("Registration failed", error);
                    return false;
                }
            },

            logout: async () => {
                try {
                    await fetch('/api/auth/me', { method: 'DELETE' });
                } catch (e) {
                    console.error(e);
                }
                set({ user: null, isAuthenticated: false });
            },

            checkSession: async () => {
                try {
                    const res = await fetch('/api/auth/me');
                    if (res.ok) {
                        const user = await res.json();
                        if (user) {
                            set({ user, isAuthenticated: true });
                            return;
                        }
                    }
                    // If check fails or returns 401, clear state
                    set({ user: null, isAuthenticated: false });
                } catch (error) {
                    set({ user: null, isAuthenticated: false });
                }
            },

            addNotification: (notification) => set((state) => ({
                notifications: [
                    {
                        ...notification,
                        id: Math.random().toString(36).substr(2, 9),
                        timestamp: Date.now(),
                        read: false
                    },
                    ...state.notifications
                ].slice(0, 50)
            })),

            markAsRead: (id) => set((state) => ({
                notifications: state.notifications.map(n =>
                    n.id === id ? { ...n, read: true } : n
                )
            })),

            markAllAsRead: () => set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, read: true }))
            })),

            clearNotifications: () => set({ notifications: [] }),

            preferences: {
                theme: 'light', // Default to modern light
                notifications: true,
                sessionTimeout: 15
            },

            setPreferences: (prefs) => set((state) => ({
                preferences: { ...state.preferences, ...prefs }
            })),

            updateProfile: (data) => set((state) => ({
                user: state.user ? { ...state.user, ...data } : null,
            })),

            usageStats: {
                apiCalls: 0,
                threatsAnalyzed: 0,
                reportsGenerated: 0,
                lastActive: Date.now()
            },

            incrementUsage: (metric) => set((state) => ({
                usageStats: {
                    ...state.usageStats,
                    [metric]: state.usageStats[metric] + 1,
                    lastActive: Date.now()
                }
            })),

            updateActivity: () => set({ lastActive: Date.now() }),
        }),
        {
            name: 'netwatch-storage',
            partialize: (state) => ({
                preferences: state.preferences,
                usageStats: state.usageStats,
                // Do NOT persist user/auth locally anymore (except maybe for offline support, but for security, rely on session check)
                // Actually, for better UX on refresh before API returns, we might want to keep it, but session cookie is source of truth.
                // Let's not persist auth state, let checkSession handle it.
            }),
        }
    )
);

