import { account } from '@/lib/appwrite/client'
import { OAuthProvider } from 'appwrite'
import { handleError } from '@/lib/utils/error-handler'
import type { AppwriteUser, AuthResult } from '../types/auth.types'

/**
 * Get currently authenticated user
 */
export const getCurrentUser = async (): Promise<AuthResult<AppwriteUser>> => {
  try {
    const user = await account.get()
    return { success: true as const, user }
  } catch (error) {
    return handleError(error)
  }
}

/**
 * Create an OAuth2 session with various providers
 *
 * @deprecated For Google OAuth, use `signInWithGoogle` from `@/features/auth` instead.
 * This provides better error handling, user document management, and callback handling.
 *
 * This function remains available for other OAuth providers (GitHub, Facebook, Apple).
 *
 * @param provider - OAuth provider: 'google' | 'github' | 'facebook' | 'apple'
 * @param successUrl - URL to redirect on successful authentication
 * @param failureUrl - URL to redirect on failed authentication
 *
 * @example
 * // For Google OAuth (recommended):
 * import { signInWithGoogle } from '@/features/auth';
 * await signInWithGoogle();
 *
 * @example
 * // For other providers:
 * await createOAuthSession('github');
 */
export const createOAuthSession = async (
  provider: 'google' | 'github' | 'facebook' | 'apple',
  successUrl?: string,
  failureUrl?: string
): Promise<AuthResult> => {
  try {
    const providerMap = {
      google: OAuthProvider.Google,
      github: OAuthProvider.Github,
      facebook: OAuthProvider.Facebook,
      apple: OAuthProvider.Apple,
    } as const

    await account.createOAuth2Session(
      providerMap[provider],
      successUrl || `${window.location.origin}/dashboard`,
      failureUrl || `${window.location.origin}/login`
    )
    return { success: true as const }
  } catch (error) {
    return handleError(error)
  }
}

/**
 * Log out the current user
 */
export const logout = async (): Promise<AuthResult> => {
  try {
    await account.deleteSession('current')
    return { success: true as const }
  } catch (error) {
    return handleError(error)
  }
}
