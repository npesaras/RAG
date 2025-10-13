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

export const createOAuthSession = async (
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

        // Ensure absolute HTTPS URLs for production
        const getAbsoluteUrl = (path: string) => {
            const origin = window.location.origin;
            // Ensure HTTPS for production deployments
            const httpsOrigin = origin.replace(/^http:/, 'https:');
            return `${httpsOrigin}${path}`;
        };

        const defaultSuccessUrl = successUrl || getAbsoluteUrl('/dashboard');
        const defaultFailureUrl = failureUrl || getAbsoluteUrl('/login');

        console.log('OAuth Configuration:', { 
            provider,
            success: defaultSuccessUrl, 
            failure: defaultFailureUrl,
            origin: window.location.origin,
            href: window.location.href,
            hostname: window.location.hostname
        });

        // Add validation for URLs
        if (!defaultSuccessUrl.startsWith('https://') && !defaultSuccessUrl.startsWith('http://localhost')) {
            throw new Error(`Invalid success URL: ${defaultSuccessUrl}`);
        }
        
        if (!defaultFailureUrl.startsWith('https://') && !defaultFailureUrl.startsWith('http://localhost')) {
            throw new Error(`Invalid failure URL: ${defaultFailureUrl}`);
        }

        console.log('Creating OAuth session with validated URLs...');

        await account.createOAuth2Session(
            providerMap[provider],
            defaultSuccessUrl,
            defaultFailureUrl
        );
        
        console.log('OAuth session created successfully');
        return { success: true as const };
    } catch (error) {
        console.error('OAuth session creation failed:', error);
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
