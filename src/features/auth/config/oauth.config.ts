import { OAuthProvider } from 'appwrite'
import type { OAuthProviderConfig } from '../types/oauth.types'

export const GOOGLE_OAUTH_CONFIG: OAuthProviderConfig = {
  provider: OAuthProvider.Google,
  defaultSuccessUrl: `${window.location.origin}/dashboard`,
  defaultFailureUrl: `${window.location.origin}/login`,
  callbackTimeout: 3000,
  retryAttempts: 3,
  retryDelay: 1000,
}

export const DEBUG = import.meta.env.DEV
