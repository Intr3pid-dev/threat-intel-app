import { useAuthStore } from './store';
import { useEffect } from 'react';

let activityTimer: NodeJS.Timeout | null = null;

/**
 * Session Manager Hook
 * Tracks user activity and enforces session timeout
 */
export function useSessionManager() {
    const checkSessionTimeout = useAuthStore((state) => state.checkSessionTimeout);
    const updateActivity = useAuthStore((state) => state.updateActivity);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            if (activityTimer) {
                clearInterval(activityTimer);
                activityTimer = null;
            }
            return;
        }

        // Track user activity
        const handleActivity = () => {
            updateActivity();
        };

        // Listen for user interactions
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        // Check session timeout every minute
        activityTimer = setInterval(() => {
            checkSessionTimeout();
        }, 60 * 1000); // Check every minute

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
            if (activityTimer) {
                clearInterval(activityTimer);
                activityTimer = null;
            }
        };
    }, [isAuthenticated, checkSessionTimeout, updateActivity]);
}
