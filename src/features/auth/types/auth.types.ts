import type { Models } from 'appwrite'

// Types - using Appwrite's built-in types where possible
export type AppwriteUser = Models.User<Models.Preferences>

export type AuthResult<T = void> =
  | { success: true; user?: T }
  | { success: false; error: string }
