import { account } from '../appwrite';
import { OAuthProvider } from 'appwrite';
import { ROUTES } from '../constants';

// User interface
export interface User {
  $id: string;
  email: string;
  name: string;
}

// Session status interface
export interface SessionStatus {
  isAuthenticated: boolean;
  user?: User;
  loading?: boolean;
}

// Check if user has an active session
export const checkSession = async (): Promise<SessionStatus> => {
  try {
    const user = await account.get();
    return {
      isAuthenticated: true,
      user: user
    };
  } catch (error: unknown) {
    const appwriteError = error as { code?: number };
    
    // 401 means no active session - this is expected for unauthenticated users
    if (appwriteError.code === 401) {
      return {
        isAuthenticated: false
      };
    }
    
    // Other errors (network, etc.) - treat as not authenticated
    return {
      isAuthenticated: false
    };
  }
};

// Simple redirect function
export const redirectIfAuthenticated = (navigate: (path: string) => void, dashboardPath: string) => {
  checkSession().then((sessionStatus) => {
    if (sessionStatus.isAuthenticated) {
      navigate(dashboardPath);
    }
  });
};

// Basic session management utilities
export const logout = async (): Promise<{ success: boolean; message: string }> => {
  try {
    await account.deleteSession({
      sessionId: 'current'
    });
    return {
      success: true,
      message: 'Logged out successfully'
    };
  } catch (error: unknown) {
    const appwriteError = error as { message?: string };
    return {
      success: false,
      message: appwriteError.message || 'Logout failed'
    };
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = await account.get();
    return user as User;
  } catch {
    return null;
  }
};

// Google OAuth2 Authentication
export const initiateGoogleAuth = (): void => {
  const currentUrl = window.location.origin;
  const successUrl = `${currentUrl}${ROUTES.DASHBOARD}`;
  const failureUrl = `${currentUrl}${ROUTES.LOGIN}?error=auth_failed`;

  // Initiate Google OAuth2 session
  account.createOAuth2Session({
    provider: OAuthProvider.Google,
    success: successUrl,
    failure: failureUrl
  });
};

// Check if returning from OAuth flow and handle session
export const handleOAuthCallback = async (): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    // Check if we have a valid session after OAuth
    const user = await account.get();
    
    return {
      success: true,
      user: user as User
    };
  } catch (error: unknown) {
    const appwriteError = error as { message?: string; code?: number };
    
    return {
      success: false,
      error: appwriteError.message || 'OAuth authentication failed'
    };
  }
};

// Complete Google authentication flow
export const authenticateWithGoogle = async (): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    // Check if user is already authenticated
    const existingUser = await getCurrentUser();
    if (existingUser) {
      return {
        success: true,
        user: existingUser
      };
    }

    // If not authenticated, initiate OAuth flow
    initiateGoogleAuth();
    
    // This will redirect, so we return a pending state
    return {
      success: false,
      error: 'Redirecting to Google authentication...'
    };
  } catch (error: unknown) {
    const appwriteError = error as { message?: string };
    
    return {
      success: false,
      error: appwriteError.message || 'Failed to initiate Google authentication'
    };
  }
};
