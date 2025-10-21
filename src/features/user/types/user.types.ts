// User Schema and Types
import type { Models } from 'appwrite'

// Appwrite document type
export type UserDocument = Models.Document & CreateUserData

// Base User interface
export interface User {
  id?: string // User ID (optional for creation)
  createdAt?: string // Creation timestamp
  updatedAt?: string // Update timestamp
  name: string // User's full name
  email: string // User's email address
}

// User creation data (for Appwrite documents)
export interface CreateUserData {
  name: string
  email: string
}

// User creation payload
export interface CreateUserPayload {
  name: string
  email: string
}

// User update payload (partial fields)
export interface UpdateUserPayload {
  name?: string;
  email?: string;
}

// Authentication user profile data structure
export interface AuthUserProfile {
  name: string;
  email: string;
  picture?: string; // Profile picture URL (optional)
  sub: string; // User ID
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

// Helper function to transform auth profile to our user schema
export const transformAuthProfile = (profile: AuthUserProfile): CreateUserPayload => {
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
