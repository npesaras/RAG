/**
 * @deprecated This file is being refactored. Import from specific modules instead:
 * - Auth: @/features/auth
 * - User: @/features/user
 * - Client: @/lib/appwrite/client
 * - Config: @/lib/appwrite/config
 *
 * This facade maintains backwards compatibility during the migration.
 */

// Re-export client and services
export { client, account, databases, ID, Query, OAuthProvider, type Models } from './appwrite/client'

// Re-export config
export { DATABASE_ID, USERS_COLLECTION_ID } from './appwrite/config'

// Re-export auth types
export type { AppwriteUser } from '@/features/auth/types/auth.types'

// Re-export user types and functions
export type { CreateUserData, UserDocument } from '@/features/user/types/user.types'
export { createUserDocument, getUserByEmail, updateUserDocument } from '@/features/user/api/user-profile'

// Re-export auth functions
export { getCurrentUser, createOAuthSession, logout } from '@/features/auth/api/appwrite-auth'
