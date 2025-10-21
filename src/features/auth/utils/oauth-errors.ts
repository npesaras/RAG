import type { OAuthConfig, OAuthError } from '../types/oauth.types'
import { OAUTH_ERROR_CODES } from '../types/oauth.types'
import { GOOGLE_OAUTH_CONFIG, DEBUG } from '../config/oauth.config'

/**
 * Get OAuth redirect URLs with fallbacks
 */
export const getOAuthRedirectUrls = (config?: OAuthConfig) => ({
  success: config?.successUrl || GOOGLE_OAUTH_CONFIG.defaultSuccessUrl,
  failure: config?.failureUrl || GOOGLE_OAUTH_CONFIG.defaultFailureUrl,
})

/**
 * Map generic errors to user-friendly OAuth errors
 */
export const mapOAuthError = (error: unknown): OAuthError => {
  if (isOAuthError(error)) {
    return error
  }

  const errorMessage = error instanceof Error ? error.message : String(error)

  // Map common error patterns
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return {
      code: OAUTH_ERROR_CODES.NETWORK_ERROR,
      message: errorMessage,
      userMessage: 'Network error. Please check your connection and try again.',
      originalError: error,
    }
  }

  if (errorMessage.includes('cancelled') || errorMessage.includes('denied')) {
    return {
      code: OAUTH_ERROR_CODES.USER_CANCELLED,
      message: errorMessage,
      userMessage: 'Sign in was cancelled. Please try again.',
      originalError: error,
    }
  }

  return {
    code: OAUTH_ERROR_CODES.UNKNOWN_ERROR,
    message: errorMessage,
    userMessage: 'An unexpected error occurred. Please try again.',
    originalError: error,
  }
}

/**
 * Type guard to check if error is an OAuthError
 */
export const isOAuthError = (error: unknown): error is OAuthError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'userMessage' in error
  )
}

/**
 * Debug logger (only logs in development)
 */
export const log = (message: string, ...args: unknown[]) => {
  if (DEBUG) {
    console.log(`[GoogleAuth] ${message}`, ...args)
  }
}

/**
 * Sleep utility for retry logic
 */
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
