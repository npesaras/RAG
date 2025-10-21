import { OAuthProvider } from 'appwrite'
import type { AppwriteUser } from '@/lib/appwrite'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface OAuthConfig {
  successUrl?: string
  failureUrl?: string
  onSuccess?: (user: AppwriteUser) => void
  onError?: (error: OAuthError) => void
}

export interface OAuthResult {
  success: boolean
  error?: string
}

export interface OAuthCallbackResult {
  success: boolean
  user?: AppwriteUser
  error?: string
  requiresUserDocument?: boolean
}

export interface GoogleAuthResult {
  success: boolean
  user?: AppwriteUser
  error?: OAuthError
}

export interface OAuthError {
  code: string
  message: string
  userMessage: string
  originalError?: unknown
}

export interface OAuthState {
  provider: 'google'
  timestamp: number
  redirectUrl?: string
}

export interface OAuthProviderConfig {
  provider: typeof OAuthProvider.Google
  defaultSuccessUrl: string
  defaultFailureUrl: string
  callbackTimeout: number
  retryAttempts: number
  retryDelay: number
}

export interface UserDocumentResult {
  success: boolean
  created: boolean
  error?: string
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const OAUTH_ERROR_CODES = {
  SESSION_CREATION_FAILED: 'oauth.session.creation_failed',
  CALLBACK_TIMEOUT: 'oauth.callback.timeout',
  USER_DOCUMENT_FAILED: 'oauth.user_document.failed',
  INVALID_CALLBACK: 'oauth.callback.invalid',
  USER_CANCELLED: 'oauth.user_cancelled',
  NETWORK_ERROR: 'oauth.network_error',
  UNKNOWN_ERROR: 'oauth.unknown_error',
} as const

export type OAuthErrorCode = (typeof OAUTH_ERROR_CODES)[keyof typeof OAUTH_ERROR_CODES]
