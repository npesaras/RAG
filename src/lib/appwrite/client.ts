import { Client, Account, Databases } from 'appwrite'
import { config } from './config'

// Initialize Appwrite client
export const client = new Client().setEndpoint(config.endpoint).setProject(config.projectId)

// Initialize services
export const account = new Account(client)
export const databases = new Databases(client)

// Re-export SDK utilities
export { ID, Query, OAuthProvider, type Models } from 'appwrite'
