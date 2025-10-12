import { databases, DATABASE_ID, ID } from '../appwrite';
import type { User, CreateUserPayload, UpdateUserPayload, UserOperationResult } from '../../schema/user';
import { validateUserPayload } from '../../schema/user';

// Collection ID for users - should be set in environment variables
const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID || 'users';

// Check if user exists in the database by email
export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [`email=${email}`]
    );

    if (response.documents.length > 0) {
      return response.documents[0] as unknown as User;
    }

    return null;
  } catch (error: unknown) {
    console.error('Error finding user by email:', error);
    return null;
  }
};

// Create new user in the database
export const createUser = async (userData: CreateUserPayload): Promise<UserOperationResult> => {
  try {
    // Validate user data
    const validation = validateUserPayload(userData);
    if (!validation.isValid) {
      return {
        success: false,
        error: `Validation failed: ${validation.errors.join(', ')}`
      };
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
      return {
        success: true,
        user: existingUser,
        isNewUser: false
      };
    }

    // Create new user document
    const newUser = await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      ID.unique(),
      userData
    );

    return {
      success: true,
      user: newUser as unknown as User,
      isNewUser: true
    };
  } catch (error: unknown) {
    const appwriteError = error as { message?: string };
    
    return {
      success: false,
      error: appwriteError.message || 'Failed to create user'
    };
  }
};

// Update existing user in the database
export const updateUser = async (userId: string, userData: UpdateUserPayload): Promise<UserOperationResult> => {
  try {
    const updatedUser = await databases.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userId,
      userData
    );

    return {
      success: true,
      user: updatedUser as unknown as User,
      isNewUser: false
    };
  } catch (error: unknown) {
    const appwriteError = error as { message?: string };
    
    return {
      success: false,
      error: appwriteError.message || 'Failed to update user'
    };
  }
};

// Save user profile from authenticated session
export const saveUserProfileFromSession = async (): Promise<UserOperationResult> => {
  try {
    // Get the authenticated user from Appwrite account service
    const { account } = await import('../appwrite');
    const sessionUser = await account.get();

    if (!sessionUser.email || !sessionUser.name) {
      return {
        success: false,
        error: 'User profile incomplete - missing email or name'
      };
    }

    // Transform session user data to our schema
    const userPayload: CreateUserPayload = {
      name: sessionUser.name,
      email: sessionUser.email
    };

    // Create or update user in our database
    const result = await createUser(userPayload);
    
    return result;
  } catch (error: unknown) {
    const appwriteError = error as { message?: string };
    
    return {
      success: false,
      error: appwriteError.message || 'Failed to save user profile from session'
    };
  }
};

// Get user profile by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const user = await databases.getDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userId
    );

    return user as unknown as User;
  } catch (error: unknown) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

// Complete user management after OAuth authentication
export const handleUserAfterAuth = async (): Promise<UserOperationResult> => {
  try {
    // Save user profile from the authenticated session
    const result = await saveUserProfileFromSession();
    
    if (!result.success) {
      return result;
    }

    return {
      success: true,
      user: result.user,
      isNewUser: result.isNewUser
    };
  } catch (error: unknown) {
    const appwriteError = error as { message?: string };
    
    return {
      success: false,
      error: appwriteError.message || 'Failed to handle user after authentication'
    };
  }
};