// User Schema and Types for Appwrite Integration

// Base User interface matching Appwrite users collection schema
export interface User {
  $id?: string; // Appwrite document ID (optional for creation)
  $createdAt?: string; // Appwrite timestamp
  $updatedAt?: string; // Appwrite timestamp
  name: string; // User's full name from Google profile
  email: string; // User's email address from Google profile
}

// User creation payload (without Appwrite system fields)
export interface CreateUserPayload {
  name: string;
  email: string;
}

// User update payload (partial fields)
export interface UpdateUserPayload {
  name?: string;
  email?: string;
}

// Google OAuth user profile data structure
export interface GoogleUserProfile {
  name: string;
  email: string;
  picture?: string; // Profile picture URL (optional)
  sub: string; // Google user ID
}

// User operation response types
export interface UserOperationResult {
  success: boolean;
  user?: User;
  error?: string;
  isNewUser?: boolean; // Indicates if this was a new user creation
}

// Validation helpers
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUserName = (name: string): boolean => {
  return name.trim().length >= 1 && name.trim().length <= 128;
};

export const validateUserPayload = (payload: CreateUserPayload): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!validateUserName(payload.name)) {
    errors.push('Name must be between 1 and 128 characters');
  }

  if (!validateEmail(payload.email)) {
    errors.push('Invalid email format');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper function to transform Google profile to our user schema
export const transformGoogleProfile = (profile: GoogleUserProfile): CreateUserPayload => {
  return {
    name: profile.name.trim(),
    email: profile.email.toLowerCase().trim()
  };
};

// Type guards
export const isUser = (obj: unknown): obj is User => {
  if (!obj || typeof obj !== 'object') return false;
  
  const candidate = obj as Record<string, unknown>;
  return typeof candidate.name === 'string' && 
         typeof candidate.email === 'string';
};

export const isCreateUserPayload = (obj: unknown): obj is CreateUserPayload => {
  if (!obj || typeof obj !== 'object') return false;
  
  const candidate = obj as Record<string, unknown>;
  if (typeof candidate.name !== 'string' || typeof candidate.email !== 'string') {
    return false;
  }
  
  const payload = { name: candidate.name, email: candidate.email };
  return validateUserPayload(payload).isValid;
};
