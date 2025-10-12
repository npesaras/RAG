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
}

export const useAppwriteAuth = (redirectToDashboard = false): UseAppwriteAuthReturn => {
    const [user, setUser] = useState<AppwriteUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    const ensureUserDocument = useCallback(async (authUser: AppwriteUser) => {
        try {
            console.log('🔍 Starting ensureUserDocument for:', {
                id: authUser.$id,
                email: authUser.email,
                name: authUser.name,
                fullUser: authUser
            });
            
            // Check if user document exists by email
            const existingUser = await getUserByEmail(authUser.email);
            console.log('📋 Existing user check result:', existingUser);
            
            if (!existingUser.success) {
                console.log('📝 Creating new user document with ID:', authUser.$id);
                // Create user document with the authenticated user's ID
                const userData = {
                    name: authUser.name || authUser.email?.split('@')[0] || 'User',
                    email: authUser.email
                };
                
                console.log('📊 User data to create:', userData);
                const createResult = await createUserDocument(userData, authUser.$id);
                console.log('💾 Create result:', createResult);
                
                if (createResult.success) {
                    console.log('✅ User document created successfully with ID:', authUser.$id);
                } else {
                    console.error('❌ Failed to create user document:', createResult.error);
                }
            } else {
                console.log('✅ User document already exists:', existingUser.user);
            }
        } catch (err) {
            console.error('💥 Error ensuring user document:', err);
        }
    }, []);

    const checkAuth = useCallback(async () => {
        try {
            console.log('🔄 Checking authentication status...');
            
            // Use getCurrentUser for direct auth check
            const userResult = await getCurrentUser();
            console.log('🔍 getCurrentUser result:', userResult);
            
            if (userResult.success && userResult.user) {
                console.log('✅ User is authenticated:', {
                    email: userResult.user.email,
                    id: userResult.user.$id,
                    name: userResult.user.name
                });
                setUser(userResult.user);
                
                // Ensure user document exists in database
                console.log('🔗 Calling ensureUserDocument...');
                await ensureUserDocument(userResult.user);
                
                if (redirectToDashboard && location.pathname === '/login') {
                    console.log('🚀 Redirecting to dashboard...');
                    navigate(ROUTES.DASHBOARD);
                }
            } else {
                console.log('❌ User is not authenticated:', userResult);
                setUser(null);
            }
        } catch (err) {
            console.error('💥 Auth check error:', err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [redirectToDashboard, navigate, location.pathname, ensureUserDocument]);

    // Check for OAuth callback and initial auth
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const userId = urlParams.get('userId');
        const secret = urlParams.get('secret');
        
        if (userId && secret) {
            console.log('🔗 OAuth callback detected, checking auth...');
            // Small delay to ensure OAuth session is established
            setTimeout(checkAuth, 1000);
        } else {
            checkAuth();
        }
    }, [checkAuth, location.search]);

    // Set up periodic auth checking for non-authenticated users
    useEffect(() => {
        const interval = setInterval(() => {
            if (!user) {
                checkAuth();
            }
        }, 30000); // Check every 30 seconds if not authenticated
        
        return () => clearInterval(interval);
    }, [checkAuth, user]);

    const signInWithGoogle = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🚀 Starting Google OAuth...');
            
            const result = await createOAuthSession('google');
            if (!result.success) {
                setError(result.error || 'OAuth failed');
                console.error('❌ OAuth failed:', result.error);
            }
        } catch (err) {
            console.error('💥 Google sign in error:', err);
            setError(err instanceof Error ? err.message : 'Sign in failed');
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🚪 Signing out...');
            
            const result = await logout();
            
            if (result.success) {
                setUser(null);
                console.log('✅ Successfully signed out');
                navigate(ROUTES.HOME);
            } else {
                setError(result.error || 'Sign out failed');
                console.error('❌ Sign out failed:', result.error);
            }
        } catch (err) {
            console.error('💥 Sign out error:', err);
            setError(err instanceof Error ? err.message : 'Sign out failed');
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        signInWithGoogle,
        signOut,
        clearError
    };
};