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
    password?: string; // Simulated hash
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
    registeredUsers: User[];
    notifications: Notification[];
    lastActivity: number;
    login: (name: string, password?: string) => boolean;
    register: (user: User) => boolean;
    logout: () => void;
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
    checkSessionTimeout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            registeredUsers: [],
            notifications: [],
            lastActivity: Date.now(),

            login: (name, password) => {
                const { registeredUsers } = get();
                const user = registeredUsers.find(u => u.name === name && u.password === password);

                if (user) {
                    set({ user, isAuthenticated: true, lastActivity: Date.now() });
                    return true;
                }
                return false;
            },

            register: (newUser) => {
                const { registeredUsers } = get();
                if (registeredUsers.some(u => u.name === newUser.name)) {
                    return false; // User exists
                }

                const userWithId = {
                    ...newUser,
                    id: Math.random().toString(36).substr(2, 9),
                    avatar: '/avatar-placeholder.png'
                };

                set({
                    registeredUsers: [...registeredUsers, userWithId],
                    user: userWithId,
                    isAuthenticated: true,
                    lastActivity: Date.now()
                });
                return true;
            },

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

            clearNotifications: () => set({ notifications: [] }),

            preferences: {
                theme: 'dark',
                notifications: true,
                sessionTimeout: 15 // 15 minutes default
            },

            setPreferences: (prefs) => set((state) => ({
                preferences: { ...state.preferences, ...prefs }
            })),

            updateProfile: (data) => set((state) => ({
                user: state.user ? { ...state.user, ...data } : null,
                // Also update the user in the registered list
                registeredUsers: state.registeredUsers.map(u =>
                    u.id === state.user?.id ? { ...u, ...data } : u
                )
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

            updateActivity: () => set({ lastActivity: Date.now() }),

            checkSessionTimeout: () => {
                const state = get();
                if (!state.isAuthenticated) return;

                const now = Date.now();
                const timeoutMs = state.preferences.sessionTimeout * 60 * 1000;
                const timeSinceActivity = now - state.lastActivity;

                if (timeSinceActivity > timeoutMs) {
                    set({ user: null, isAuthenticated: false });
                    // Optionally add a notification
                    get().addNotification({
                        title: 'Session Expired',
                        message: 'Your session has expired due to inactivity.',
                        type: 'warning'
                    });
                }
            }
        }),
        {
            name: 'netwatch-storage',
            partialize: (state) => ({
                registeredUsers: state.registeredUsers,
                preferences: state.preferences,
                usageStats: state.usageStats,
                // Optionally persist current user session
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);
