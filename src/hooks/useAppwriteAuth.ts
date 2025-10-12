import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { 
    logout, 
    createOAuthSession,
    getCurrentUser,
    createUserDocument,
    getUserByEmail
} from '@/lib/appwrite';
import type { AppwriteUser } from '@/lib/appwrite';
import { ROUTES } from '@/lib/constants';

interface UseAppwriteAuthReturn {
    user: AppwriteUser | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    clearError: () => void;
    refreshUser: () => Promise<void>;
}

const DEBUG = import.meta.env.DEV; // Only log in development

export const useAppwriteAuth = (redirectToDashboard = false): UseAppwriteAuthReturn => {
    const [user, setUser] = useState<AppwriteUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const ensureUserDocument = useCallback(async (authUser: AppwriteUser) => {
        try {
            if (DEBUG) console.log('Ensuring user document exists for:', authUser.email);
            
            const existingUser = await getUserByEmail(authUser.email);
            
            if (!existingUser.success) {
                if (DEBUG) console.log('Creating new user document');
                
                const userData = {
                    name: authUser.name || authUser.email?.split('@')[0] || 'User',
                    email: authUser.email
                };
                
                const createResult = await createUserDocument(userData, authUser.$id);
                
                if (!createResult.success) {
                    console.error('Failed to create user document:', createResult.error);
                }
            }
        } catch (err) {
            console.error('Error ensuring user document:', err);
        }
    }, []);

    const checkAuth = useCallback(async () => {
        try {
            setError(null);
            if (DEBUG) console.log('Checking authentication...');
            
            const userResult = await getCurrentUser();
            
            if (userResult.success && userResult.user) {
                if (DEBUG) console.log('User authenticated:', userResult.user.email);
                
                setUser(userResult.user);
                await ensureUserDocument(userResult.user);
                
                // Redirect if needed
                if (redirectToDashboard && location.pathname === '/login') {
                    navigate(ROUTES.DASHBOARD);
                }
            } else {
                if (DEBUG) console.log('User not authenticated');
                setUser(null);
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            setUser(null);
            setError(err instanceof Error ? err.message : 'Authentication check failed');
        } finally {
            setLoading(false);
        }
    }, [redirectToDashboard, navigate, location.pathname, ensureUserDocument]);

    // Handle OAuth callback and initial auth check
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const isOAuthCallback = urlParams.has('userId') && urlParams.has('secret');
        
        if (isOAuthCallback) {
            if (DEBUG) console.log('OAuth callback detected');
            // Slight delay for OAuth session establishment
            setTimeout(checkAuth, 1000);
        } else {
            checkAuth();
        }
    }, [checkAuth, location.search]);

    const signInWithGoogle = async () => {
        try {
            setLoading(true);
            setError(null);
            if (DEBUG) console.log('Starting Google OAuth...');
            
            const result = await createOAuthSession('google');
            if (!result.success) {
                setError(result.error || 'OAuth failed');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
            console.error('Google sign in error:', errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setLoading(true);
            setError(null);
            if (DEBUG) console.log('Signing out...');
            
            const result = await logout();
            
            if (result.success) {
                setUser(null);
                navigate(ROUTES.LOGIN);
            } else {
                setError(result.error || 'Sign out failed');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Sign out failed';
            console.error('Sign out error:', errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => setError(null);

    const refreshUser = async () => {
        try {
            if (DEBUG) console.log('Refreshing user data...');
            const userResult = await getCurrentUser();
            
            if (userResult.success && userResult.user) {
                setUser(userResult.user);
                if (DEBUG) console.log('User data refreshed:', userResult.user.email);
            }
        } catch (err) {
            console.error('Error refreshing user data:', err);
        }
    };

    return {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        signInWithGoogle,
        signOut,
        clearError,
        refreshUser
    };
};