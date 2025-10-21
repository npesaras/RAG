import { account } from '@/lib/appwrite/client'
import { getCurrentUser } from './appwrite-auth'
import { createUserDocument, getUserByEmail } from '@/features/user/api/user-profile'
import type { AppwriteUser } from '../types/auth.types'
import type {
  OAuthConfig,
  OAuthResult,
  OAuthCallbackResult,
  GoogleAuthResult,
  OAuthError,
  OAuthState,
  UserDocumentResult,
} from '../types/oauth.types'
import { OAUTH_ERROR_CODES } from '../types/oauth.types'
import { GOOGLE_OAUTH_CONFIG } from '../config/oauth.config'
import { getOAuthRedirectUrls, mapOAuthError, sleep, log } from '../utils/oauth-errors'
import { saveOAuthState, getOAuthState, clearOAuthState, isGoogleOAuthCallback } from './oauth-state'

// ============================================================================
// OAUTH CALLBACK HANDLING
// ============================================================================

/**
 * Handle Google OAuth callback with retry logic
 */
export const handleGoogleOAuthCallback = async (): Promise<OAuthCallbackResult> => {
  log('Handling OAuth callback...')

  const urlParams = new URLSearchParams(window.location.search)
  const userId = urlParams.get('userId')
  const secret = urlParams.get('secret')

  if (!userId || !secret) {
    const error: OAuthError = {
      code: OAUTH_ERROR_CODES.INVALID_CALLBACK,
      message: 'Missing userId or secret in callback',
      userMessage: 'Invalid authentication response. Please try again.',
    }
    log('Invalid callback parameters')
    return { success: false, error: error.userMessage }
  }

  // Wait for session to be established
  await sleep(GOOGLE_OAUTH_CONFIG.callbackTimeout)

  // Retry logic to get current user
  let lastError: unknown
  for (let attempt = 1; attempt <= GOOGLE_OAUTH_CONFIG.retryAttempts; attempt++) {
    try {
      log(`Attempting to get current user (attempt ${attempt}/${GOOGLE_OAUTH_CONFIG.retryAttempts})`)

      const userResult = await getCurrentUser()

      if (userResult.success && userResult.user) {
        log('Successfully retrieved user after OAuth', userResult.user.email)

        // Ensure user document exists
        const docResult = await ensureGoogleUserDocument(userResult.user)

        // Clear OAuth state
        clearOAuthState()

        return {
          success: true,
          user: userResult.user,
          requiresUserDocument: docResult.created,
        }
      }
    } catch (error) {
      lastError = error
      log(`Attempt ${attempt} failed:`, error)

      if (attempt < GOOGLE_OAUTH_CONFIG.retryAttempts) {
        await sleep(GOOGLE_OAUTH_CONFIG.retryDelay * attempt)
      }
    }
  }

  // All retries failed
  const mappedError = mapOAuthError(lastError)
  return {
    success: false,
    error: mappedError.userMessage,
  }
}

// ============================================================================
// USER DOCUMENT MANAGEMENT
// ============================================================================

/**
 * Ensure user document exists in database after OAuth
 */
export const ensureGoogleUserDocument = async (authUser: AppwriteUser): Promise<UserDocumentResult> => {
  try {
    log('Ensuring user document exists for:', authUser.email)

    const existingUser = await getUserByEmail(authUser.email)

    if (existingUser.success) {
      log('User document already exists')
      return { success: true, created: false }
    }

    // Create new user document
    log('Creating new user document')
    const userData = {
      name: authUser.name || authUser.email?.split('@')[0] || 'User',
      email: authUser.email,
    }

    const createResult = await createUserDocument(userData, authUser.$id)

    if (!createResult.success) {
      console.error('Failed to create user document:', createResult.error)
      return {
        success: false,
        created: false,
        error: createResult.error,
      }
    }

    log('User document created successfully')
    return { success: true, created: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error ensuring user document:', error)
    return {
      success: false,
      created: false,
      error: errorMessage,
    }
  }
}

// ============================================================================
// CORE OAUTH FUNCTIONS
// ============================================================================

/**
 * Initiate Google OAuth session
 */
export const initiateGoogleOAuth = async (config?: OAuthConfig): Promise<OAuthResult> => {
  try {
    log('Initiating Google OAuth...')

    const { success: successUrl, failure: failureUrl } = getOAuthRedirectUrls(config)

    // Save OAuth state
    const state: OAuthState = {
      provider: 'google',
      timestamp: Date.now(),
      redirectUrl: successUrl,
    }
    saveOAuthState(state)

    // Create OAuth2 session (this will redirect)
    await account.createOAuth2Session(GOOGLE_OAUTH_CONFIG.provider, successUrl, failureUrl)

    log('OAuth session created, redirecting...')
    return { success: true }
  } catch (error) {
    console.error('Failed to initiate Google OAuth:', error)
    clearOAuthState()

    const mappedError = mapOAuthError(error)
    config?.onError?.(mappedError)

    return {
      success: false,
      error: mappedError.userMessage,
    }
  }
}

/**
 * Complete Google sign-in flow (high-level wrapper)
 * This is the main function to use for Google authentication
 */
export const signInWithGoogle = async (config?: OAuthConfig): Promise<GoogleAuthResult> => {
  try {
    log('Starting Google sign-in flow...')

    // Check if we're in a callback
    if (isGoogleOAuthCallback()) {
      log('Already in OAuth callback, handling...')
      const callbackResult = await handleGoogleOAuthCallback()

      if (callbackResult.success && callbackResult.user) {
        config?.onSuccess?.(callbackResult.user)
        return {
          success: true,
          user: callbackResult.user,
        }
      }

      const error: OAuthError = {
        code: OAUTH_ERROR_CODES.CALLBACK_TIMEOUT,
        message: callbackResult.error || 'Callback handling failed',
        userMessage: callbackResult.error || 'Authentication failed. Please try again.',
      }

      config?.onError?.(error)
      return {
        success: false,
        error,
      }
    }

    // Initiate OAuth flow
    const result = await initiateGoogleOAuth(config)

    if (!result.success) {
      const error: OAuthError = {
        code: OAUTH_ERROR_CODES.SESSION_CREATION_FAILED,
        message: result.error || 'Session creation failed',
        userMessage: result.error || 'Failed to start sign-in. Please try again.',
      }

      return {
        success: false,
        error,
      }
    }

    // OAuth initiated successfully (will redirect)
    return { success: true }
  } catch (error) {
    const mappedError = mapOAuthError(error)
    config?.onError?.(mappedError)

    return {
      success: false,
      error: mappedError,
    }
  }
}

// Re-export utility functions
export { isGoogleOAuthCallback, getOAuthState, clearOAuthState }
