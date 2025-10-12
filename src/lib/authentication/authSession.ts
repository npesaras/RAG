import { account } from '../appwrite';

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
