import type { OAuthState } from '../types/oauth.types'
import { log } from '../utils/oauth-errors'

const OAUTH_STATE_KEY = 'google_oauth_state'

/**
 * Save OAuth state to sessionStorage
 */
export const saveOAuthState = (state: OAuthState): void => {
  try {
    sessionStorage.setItem(OAUTH_STATE_KEY, JSON.stringify(state))
    log('OAuth state saved', state)
  } catch (error) {
    console.error('Failed to save OAuth state:', error)
  }
}

/**
 * Get OAuth state from sessionStorage
 */
export const getOAuthState = (): OAuthState | null => {
  try {
    const stateStr = sessionStorage.getItem(OAUTH_STATE_KEY)
    if (!stateStr) return null

    const state = JSON.parse(stateStr) as OAuthState

    // Check if state is expired (older than 10 minutes)
    const isExpired = Date.now() - state.timestamp > 10 * 60 * 1000
    if (isExpired) {
      clearOAuthState()
      return null
    }

    return state
  } catch (error) {
    console.error('Failed to get OAuth state:', error)
    return null
  }
}

/**
 * Clear OAuth state from sessionStorage
 */
export const clearOAuthState = (): void => {
  try {
    sessionStorage.removeItem(OAUTH_STATE_KEY)
    log('OAuth state cleared')
  } catch (error) {
    console.error('Failed to clear OAuth state:', error)
  }
}

/**
 * Check if current URL contains OAuth callback parameters
 */
export const isGoogleOAuthCallback = (): boolean => {
  const urlParams = new URLSearchParams(window.location.search)
  const hasCallback = urlParams.has('userId') && urlParams.has('secret')

  if (hasCallback) {
    log('OAuth callback detected in URL')
  }

  return hasCallback
}
