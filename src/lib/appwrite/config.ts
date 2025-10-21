// Environment variables with validation
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID
const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const APPWRITE_USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID) {
  throw new Error('Missing required Appwrite environment variables. Please check your .env file.')
}

export const config = {
  endpoint: APPWRITE_ENDPOINT,
  projectId: APPWRITE_PROJECT_ID,
  databaseId: APPWRITE_DATABASE_ID,
  usersCollectionId: APPWRITE_USERS_COLLECTION_ID,
} as const

export const DATABASE_ID = APPWRITE_DATABASE_ID
export const USERS_COLLECTION_ID = APPWRITE_USERS_COLLECTION_ID
