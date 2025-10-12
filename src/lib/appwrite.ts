import { Client, Account, Databases } from 'appwrite';

// Get environment variables
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

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

// Export constants and utilities
export { ID } from 'appwrite';
export const DATABASE_ID = APPWRITE_DATABASE_ID;
