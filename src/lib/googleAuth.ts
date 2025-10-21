/**
 * @deprecated This file is being refactored. Please import from @/features/auth instead.
 * 
 * This facade maintains backwards compatibility during the migration.
 * All functionality has been moved to features/auth/api/google-oauth.ts
 */

// Re-export types
export type {
  OAuthConfig,
  OAuthResult,
  OAuthCallbackResult,
  GoogleAuthResult,
  OAuthError,
  OAuthState,
  OAuthProviderConfig,
  UserDocumentResult,
  OAuthErrorCode,
} from '@/features/auth/types/oauth.types'

// Re-export constants
export { OAUTH_ERROR_CODES } from '@/features/auth/types/oauth.types'
export { GOOGLE_OAUTH_CONFIG, DEBUG } from '@/features/auth/config/oauth.config'

// Re-export utilities
export {
  getOAuthRedirectUrls,
  mapOAuthError,
  isOAuthError,
  log,
  sleep,
} from '@/features/auth/utils/oauth-errors'

// Re-export state management
export {
  saveOAuthState,
  getOAuthState,
  clearOAuthState,
  isGoogleOAuthCallback,
} from '@/features/auth/api/oauth-state'

// Re-export core functions
export {
  handleGoogleOAuthCallback,
  ensureGoogleUserDocument,
  initiateGoogleOAuth,
  signInWithGoogle,
} from '@/features/auth/api/google-oauth'

// Default export for compatibility
import {
  signInWithGoogle,
  initiateGoogleOAuth,
  handleGoogleOAuthCallback,
  isGoogleOAuthCallback,
  ensureGoogleUserDocument,
  getOAuthState,
  clearOAuthState,
} from '@/features/auth/api/google-oauth'

import { mapOAuthError, isOAuthError } from '@/features/auth/utils/oauth-errors'

export default {
  signInWithGoogle,
  initiateGoogleOAuth,
  handleGoogleOAuthCallback,
  isGoogleOAuthCallback,
  ensureGoogleUserDocument,
  getOAuthState,
  clearOAuthState,
  mapOAuthError,
  isOAuthError,
}

