import { databases } from '@/lib/appwrite/client'
import { DATABASE_ID, USERS_COLLECTION_ID } from '@/lib/appwrite/config'
import { handleError } from '@/lib/utils/error-handler'
import { ID, Query } from 'appwrite'
import type { CreateUserData, UserDocument } from '../types/user.types'

/**
 * Create a new user document in the database
 */
export const createUserDocument = async (userData: CreateUserData, userId?: string) => {
  try {
    const user = await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      userId || ID.unique(),
      userData
    )
    return { success: true as const, user: user as unknown as UserDocument }
  } catch (error) {
    return handleError(error)
  }
}

/**
 * Get a user document by email
 */
export const getUserByEmail = async (email: string) => {
  try {
    const users = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [
      Query.equal('email', email),
    ])

    return users.documents.length > 0
      ? { success: true as const, user: users.documents[0] as unknown as UserDocument }
      : { success: false as const, error: 'User not found' }
  } catch (error) {
    return handleError(error)
  }
}

/**
 * Update a user document
 */
export const updateUserDocument = async (userId: string, userData: Partial<CreateUserData>) => {
  try {
    const user = await databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, userId, userData)
    return { success: true as const, user: user as unknown as UserDocument }
  } catch (error) {
    return handleError(error)
  }
}
