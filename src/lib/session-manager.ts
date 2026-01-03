import { useAuthStore } from './store';
import { useEffect } from 'react';

let activityTimer: NodeJS.Timeout | null = null;

/**
 * Session Manager Hook
 * Tracks user activity and enforces session timeout
 */
export function useSessionManager() {
    const logout = useAuthStore((state) => state.logout);
    const updateActivity = useAuthStore((state) => state.updateActivity);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const lastActive = useAuthStore((state) => state.lastActive);
    const sessionTimeout = useAuthStore((state) => state.preferences.sessionTimeout);

    useEffect(() => {
        if (!isAuthenticated) return;

        // Track user activity
        const handleActivity = () => {
            updateActivity();
        };

        // Listen for user interactions
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        // Check timeout
        const timer = setInterval(() => {
            const now = Date.now();
            const timeoutMs = sessionTimeout * 60 * 1000;
            if (now - lastActive > timeoutMs) {
                logout();
            }
        }, 60 * 1000); // Check every minute

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
            clearInterval(timer);
        };
    }, [isAuthenticated, lastActive, sessionTimeout, logout, updateActivity]);
}
