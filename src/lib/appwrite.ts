import { Client, Account, Databases, ID, Query, OAuthProvider } from 'appwrite';

// Environment variables
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const APPWRITE_USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;

// Validate required environment variables
if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID) {
    throw new Error('Missing required Appwrite environment variables. Please check your .env file.');
}

// Initialize Appwrite client
export const client = new Client();

client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

// Initialize services
export const account = new Account(client);
export const databases = new Databases(client);

// Export constants
export { ID, Query, OAuthProvider };
export const DATABASE_ID = APPWRITE_DATABASE_ID;
export const USERS_COLLECTION_ID = APPWRITE_USERS_COLLECTION_ID;

// Types
export interface AppwriteUser {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    name: string;
    email: string;
}

export interface CreateUserData {
    name: string;
    email: string;
}

// Authentication functions
export const getCurrentUser = async () => {
    try {
        const user = await account.get();
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

export const createSession = async (email: string, password: string) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return { success: true, session };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

export const createAccount = async (email: string, password: string, name: string) => {
    try {
        const user = await account.create(ID.unique(), email, password, name);
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

export const logout = async () => {
    try {
        await account.deleteSession('current');
        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

// OAuth functions
export const createOAuthSession = async (provider: 'google' | 'github' | 'facebook' | 'apple', successUrl?: string, failureUrl?: string) => {
    try {
        const oauthProvider = provider === 'google' ? OAuthProvider.Google :
                             provider === 'github' ? OAuthProvider.Github :
                             provider === 'facebook' ? OAuthProvider.Facebook :
                             provider === 'apple' ? OAuthProvider.Apple :
                             OAuthProvider.Google; // default fallback

        account.createOAuth2Session(
            oauthProvider,
            successUrl || `${window.location.origin}/dashboard`,
            failureUrl || `${window.location.origin}/login`
        );
        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
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
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

export const getUserDocument = async (userId: string) => {
    try {
        const user = await databases.getDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            userId
        );
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

export const getUserByEmail = async (email: string) => {
    try {
        const users = await databases.listDocuments(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            [Query.equal('email', email)]
        );
        
        if (users.documents.length > 0) {
            return { success: true, user: users.documents[0] };
        } else {
            return { success: false, error: 'User not found' };
        }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
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
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

export const deleteUserDocument = async (userId: string) => {
    try {
        await databases.deleteDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            userId
        );
        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

// Session management
export const getSession = async () => {
    try {
        const session = await account.getSession('current');
        return { success: true, session };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};

// Test connection function
export const testConnection = async () => {
    try {
        // Try to get the current user (will fail if not authenticated, but connection works)
        await account.get();
        return { success: true, message: 'Connected to Appwrite and user is authenticated' };
    } catch (error) {
        // If error is about no session, connection is working
        if (error instanceof Error && 'code' in error && (error as Error & { code: number }).code === 401) {
            return { success: true, message: 'Connected to Appwrite (no active session)' };
        }
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
};
