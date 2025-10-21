import { Client, Account, Databases, ID, Query, OAuthProvider, type Models } from 'appwrite';

// Environment variables with validation
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const APPWRITE_USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID) {
    throw new Error('Missing required Appwrite environment variables. Please check your .env file.');
}

// Initialize Appwrite client
export const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);

// Export useful constants
export { ID, Query, OAuthProvider };
export const DATABASE_ID = APPWRITE_DATABASE_ID;
export const USERS_COLLECTION_ID = APPWRITE_USERS_COLLECTION_ID;

// Types - using Appwrite's built-in types where possible
export type AppwriteUser = Models.User<Models.Preferences>;
export type UserDocument = Models.Document & CreateUserData;

export interface CreateUserData {
    name: string;
    email: string;
}

// Generic error handler
const handleError = (error: unknown): { success: false; error: string } => ({
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error'
});

// Authentication functions
export const getCurrentUser = async () => {
    try {
        const user = await account.get();
        return { success: true as const, user };
    } catch (error) {
        return handleError(error);
    }
};

/**
 * Create an OAuth2 session with various providers
 * 
 * @deprecated For Google OAuth, use `signInWithGoogle` from `@/lib/googleAuth` instead.
 * This provides better error handling, user document management, and callback handling.
 * 
 * This function remains available for other OAuth providers (GitHub, Facebook, Apple).
 * 
 * @param provider - OAuth provider: 'google' | 'github' | 'facebook' | 'apple'
 * @param successUrl - URL to redirect on successful authentication
 * @param failureUrl - URL to redirect on failed authentication
 * 
 * @example
 * // For Google OAuth (recommended):
 * import { signInWithGoogle } from '@/lib/googleAuth';
 * await signInWithGoogle();
 * 
 * @example
 * // For other providers:
 * await createOAuthSession('github');
 */
export const createOAuthSession = async(
    provider: 'google' | 'github' | 'facebook' | 'apple', 
    successUrl?: string, 
    failureUrl?: string
) => {
    try {
        const providerMap = {
            google: OAuthProvider.Google,
            github: OAuthProvider.Github,
            facebook: OAuthProvider.Facebook,
            apple: OAuthProvider.Apple,
        } as const;

        await account.createOAuth2Session(
            providerMap[provider],
            successUrl || `${window.location.origin}/dashboard`,
            failureUrl || `${window.location.origin}/login`
        );
        return { success: true as const };
    } catch (error) {
        return handleError(error);
    }
};

export const logout = async () => {
    try {
        await account.deleteSession('current');
        return { success: true as const };
    } catch (error) {
        return handleError(error);
    }
};

// Database functions
export const createUserDocument = async (userData: CreateUserData, userId?: string) => {
    try {
        const user = await databases.createDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            userId || ID.unique(),
            userData
        );
        return { success: true as const, user: user as unknown as UserDocument };
    } catch (error) {
        return handleError(error);
    }
};

export const getUserByEmail = async (email: string) => {
    try {
        const users = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Query.equal('email', email)]
        );
        
        return users.documents.length > 0 
            ? { success: true as const, user: users.documents[0] as unknown as UserDocument }
            : { success: false as const, error: 'User not found' };
    } catch (error) {
        return handleError(error);
    }
};

export const updateUserDocument = async (userId: string, userData: Partial<CreateUserData>) => {
    try {
        const user = await databases.updateDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            userId,
            userData
        );
        return { success: true as const, user: user as unknown as UserDocument };
    } catch (error) {
        return handleError(error);
    }
};
