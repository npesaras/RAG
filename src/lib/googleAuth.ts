import { OAuthProvider } from 'appwrite';
import { 
    account, 
    getCurrentUser, 
    createUserDocument, 
    getUserByEmail,
    type AppwriteUser 
} from './appwrite';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface OAuthConfig {
    successUrl?: string;
    failureUrl?: string;
    onSuccess?: (user: AppwriteUser) => void;
    onError?: (error: OAuthError) => void;
}

export interface OAuthResult {
    success: boolean;
    error?: string;
}

export interface OAuthCallbackResult {
    success: boolean;
    user?: AppwriteUser;
    error?: string;
    requiresUserDocument?: boolean;
}

export interface GoogleAuthResult {
    success: boolean;
    user?: AppwriteUser;
    error?: OAuthError;
}

export interface OAuthError {
    code: string;
    message: string;
    userMessage: string;
    originalError?: unknown;
}

export interface OAuthState {
    provider: 'google';
    timestamp: number;
    redirectUrl?: string;
}

export interface OAuthProviderConfig {
    provider: typeof OAuthProvider.Google;
    defaultSuccessUrl: string;
    defaultFailureUrl: string;
    callbackTimeout: number;
    retryAttempts: number;
    retryDelay: number;
}

export interface UserDocumentResult {
    success: boolean;
    created: boolean;
    error?: string;
}

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const DEBUG = import.meta.env.DEV;

export const GOOGLE_OAUTH_CONFIG: OAuthProviderConfig = {
    provider: OAuthProvider.Google,
    defaultSuccessUrl: `${window.location.origin}/dashboard`,
    defaultFailureUrl: `${window.location.origin}/login`,
    callbackTimeout: 3000,
    retryAttempts: 3,
    retryDelay: 1000,
};

// OAuth Error Codes
export const OAUTH_ERROR_CODES = {
    SESSION_CREATION_FAILED: 'oauth.session.creation_failed',
    CALLBACK_TIMEOUT: 'oauth.callback.timeout',
    USER_DOCUMENT_FAILED: 'oauth.user_document.failed',
    INVALID_CALLBACK: 'oauth.callback.invalid',
    USER_CANCELLED: 'oauth.user_cancelled',
    NETWORK_ERROR: 'oauth.network_error',
    UNKNOWN_ERROR: 'oauth.unknown_error',
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get OAuth redirect URLs with fallbacks
 */
export const getOAuthRedirectUrls = (config?: OAuthConfig) => ({
    success: config?.successUrl || GOOGLE_OAUTH_CONFIG.defaultSuccessUrl,
    failure: config?.failureUrl || GOOGLE_OAUTH_CONFIG.defaultFailureUrl,
});

/**
 * Map generic errors to user-friendly OAuth errors
 */
export const mapOAuthError = (error: unknown): OAuthError => {
    if (isOAuthError(error)) {
        return error;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Map common error patterns
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        return {
            code: OAUTH_ERROR_CODES.NETWORK_ERROR,
            message: errorMessage,
            userMessage: 'Network error. Please check your connection and try again.',
            originalError: error,
        };
    }

    if (errorMessage.includes('cancelled') || errorMessage.includes('denied')) {
        return {
            code: OAUTH_ERROR_CODES.USER_CANCELLED,
            message: errorMessage,
            userMessage: 'Sign in was cancelled. Please try again.',
            originalError: error,
        };
    }

    return {
        code: OAUTH_ERROR_CODES.UNKNOWN_ERROR,
        message: errorMessage,
        userMessage: 'An unexpected error occurred. Please try again.',
        originalError: error,
    };
};

/**
 * Type guard to check if error is an OAuthError
 */
export const isOAuthError = (error: unknown): error is OAuthError => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        'message' in error &&
        'userMessage' in error
    );
};

/**
 * Debug logger (only logs in development)
 */
const log = (message: string, ...args: unknown[]) => {
    if (DEBUG) {
        console.log(`[GoogleAuth] ${message}`, ...args);
    }
};

/**
 * Sleep utility for retry logic
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================================
// OAUTH STATE MANAGEMENT
// ============================================================================

const OAUTH_STATE_KEY = 'google_oauth_state';

/**
 * Save OAuth state to sessionStorage
 */
export const saveOAuthState = (state: OAuthState): void => {
    try {
        sessionStorage.setItem(OAUTH_STATE_KEY, JSON.stringify(state));
        log('OAuth state saved', state);
    } catch (error) {
        console.error('Failed to save OAuth state:', error);
    }
};

/**
 * Get OAuth state from sessionStorage
 */
export const getOAuthState = (): OAuthState | null => {
    try {
        const stateStr = sessionStorage.getItem(OAUTH_STATE_KEY);
        if (!stateStr) return null;
        
        const state = JSON.parse(stateStr) as OAuthState;
        
        // Check if state is expired (older than 10 minutes)
        const isExpired = Date.now() - state.timestamp > 10 * 60 * 1000;
        if (isExpired) {
            clearOAuthState();
            return null;
        }
        
        return state;
    } catch (error) {
        console.error('Failed to get OAuth state:', error);
        return null;
    }
};

/**
 * Clear OAuth state from sessionStorage
 */
export const clearOAuthState = (): void => {
    try {
        sessionStorage.removeItem(OAUTH_STATE_KEY);
        log('OAuth state cleared');
    } catch (error) {
        console.error('Failed to clear OAuth state:', error);
    }
};

// ============================================================================
// OAUTH CALLBACK DETECTION & HANDLING
// ============================================================================

/**
 * Check if current URL contains OAuth callback parameters
 */
export const isGoogleOAuthCallback = (): boolean => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasCallback = urlParams.has('userId') && urlParams.has('secret');
    
    if (hasCallback) {
        log('OAuth callback detected in URL');
    }
    
    return hasCallback;
};

/**
 * Handle Google OAuth callback with retry logic
 */
export const handleGoogleOAuthCallback = async (): Promise<OAuthCallbackResult> => {
    log('Handling OAuth callback...');
    
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const secret = urlParams.get('secret');
    
    if (!userId || !secret) {
        const error: OAuthError = {
            code: OAUTH_ERROR_CODES.INVALID_CALLBACK,
            message: 'Missing userId or secret in callback',
            userMessage: 'Invalid authentication response. Please try again.',
        };
        log('Invalid callback parameters');
        return { success: false, error: error.userMessage };
    }

    // Wait for session to be established
    await sleep(GOOGLE_OAUTH_CONFIG.callbackTimeout);

    // Retry logic to get current user
    let lastError: unknown;
    for (let attempt = 1; attempt <= GOOGLE_OAUTH_CONFIG.retryAttempts; attempt++) {
        try {
            log(`Attempting to get current user (attempt ${attempt}/${GOOGLE_OAUTH_CONFIG.retryAttempts})`);
            
            const userResult = await getCurrentUser();
            
            if (userResult.success && userResult.user) {
                log('Successfully retrieved user after OAuth', userResult.user.email);
                
                // Ensure user document exists
                const docResult = await ensureGoogleUserDocument(userResult.user);
                
                // Clear OAuth state
                clearOAuthState();
                
                return {
                    success: true,
                    user: userResult.user,
                    requiresUserDocument: docResult.created,
                };
            }
        } catch (error) {
            lastError = error;
            log(`Attempt ${attempt} failed:`, error);
            
            if (attempt < GOOGLE_OAUTH_CONFIG.retryAttempts) {
                await sleep(GOOGLE_OAUTH_CONFIG.retryDelay * attempt);
            }
        }
    }

    // All retries failed
    const mappedError = mapOAuthError(lastError);
    return {
        success: false,
        error: mappedError.userMessage,
    };
};

// ============================================================================
// USER DOCUMENT MANAGEMENT
// ============================================================================

/**
 * Ensure user document exists in database after OAuth
 */
export const ensureGoogleUserDocument = async (
    authUser: AppwriteUser
): Promise<UserDocumentResult> => {
    try {
        log('Ensuring user document exists for:', authUser.email);
        
        const existingUser = await getUserByEmail(authUser.email);
        
        if (existingUser.success) {
            log('User document already exists');
            return { success: true, created: false };
        }
        
        // Create new user document
        log('Creating new user document');
        const userData = {
            name: authUser.name || authUser.email?.split('@')[0] || 'User',
            email: authUser.email,
        };
        
        const createResult = await createUserDocument(userData, authUser.$id);
        
        if (!createResult.success) {
            console.error('Failed to create user document:', createResult.error);
            return {
                success: false,
                created: false,
                error: createResult.error,
            };
        }
        
        log('User document created successfully');
        return { success: true, created: true };
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error ensuring user document:', error);
        return {
            success: false,
            created: false,
            error: errorMessage,
        };
    }
};

// ============================================================================
// CORE OAUTH FUNCTIONS
// ============================================================================

/**
 * Initiate Google OAuth session
 */
export const initiateGoogleOAuth = async (config?: OAuthConfig): Promise<OAuthResult> => {
    try {
        log('Initiating Google OAuth...');
        
        const { success: successUrl, failure: failureUrl } = getOAuthRedirectUrls(config);
        
        // Save OAuth state
        const state: OAuthState = {
            provider: 'google',
            timestamp: Date.now(),
            redirectUrl: successUrl,
        };
        saveOAuthState(state);
        
        // Create OAuth2 session (this will redirect)
        await account.createOAuth2Session(
            GOOGLE_OAUTH_CONFIG.provider,
            successUrl,
            failureUrl
        );
        
        log('OAuth session created, redirecting...');
        return { success: true };
        
    } catch (error) {
        console.error('Failed to initiate Google OAuth:', error);
        clearOAuthState();
        
        const mappedError = mapOAuthError(error);
        config?.onError?.(mappedError);
        
        return {
            success: false,
            error: mappedError.userMessage,
        };
    }
};

/**
 * Complete Google sign-in flow (high-level wrapper)
 * This is the main function to use for Google authentication
 */
export const signInWithGoogle = async (config?: OAuthConfig): Promise<GoogleAuthResult> => {
    try {
        log('Starting Google sign-in flow...');
        
        // Check if we're in a callback
        if (isGoogleOAuthCallback()) {
            log('Already in OAuth callback, handling...');
            const callbackResult = await handleGoogleOAuthCallback();
            
            if (callbackResult.success && callbackResult.user) {
                config?.onSuccess?.(callbackResult.user);
                return {
                    success: true,
                    user: callbackResult.user,
                };
            }
            
            const error: OAuthError = {
                code: OAUTH_ERROR_CODES.CALLBACK_TIMEOUT,
                message: callbackResult.error || 'Callback handling failed',
                userMessage: callbackResult.error || 'Authentication failed. Please try again.',
            };
            
            config?.onError?.(error);
            return {
                success: false,
                error,
            };
        }
        
        // Initiate OAuth flow
        const result = await initiateGoogleOAuth(config);
        
        if (!result.success) {
            const error: OAuthError = {
                code: OAUTH_ERROR_CODES.SESSION_CREATION_FAILED,
                message: result.error || 'Session creation failed',
                userMessage: result.error || 'Failed to start sign-in. Please try again.',
            };
            
            return {
                success: false,
                error,
            };
        }
        
        // OAuth initiated successfully (will redirect)
        return { success: true };
        
    } catch (error) {
        const mappedError = mapOAuthError(error);
        config?.onError?.(mappedError);
        
        return {
            success: false,
            error: mappedError,
        };
    }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    signInWithGoogle,
    initiateGoogleOAuth,
    handleGoogleOAuthCallback,
    isGoogleOAuthCallback,
    ensureGoogleUserDocument,
    getOAuthState,
    clearOAuthState,
    mapOAuthError,
    isOAuthError,
};
