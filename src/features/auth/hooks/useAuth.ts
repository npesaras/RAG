import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { logout, getCurrentUser } from '../api/appwrite-auth'
import type { AppwriteUser } from '../types/auth.types'
import { ROUTES } from '@/lib/constants'
import {
  signInWithGoogle as googleSignIn,
  handleGoogleOAuthCallback,
  isGoogleOAuthCallback,
} from '../api/google-oauth'

export interface UseAuthReturn {
  user: AppwriteUser | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void
  refreshUser: () => Promise<void>
}

const DEBUG = import.meta.env.DEV // Only log in development

export const useAuth = (redirectToDashboard = false): UseAuthReturn => {
  const [user, setUser] = useState<AppwriteUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const checkAuth = useCallback(async () => {
    try {
      setError(null)
      if (DEBUG) console.log('Checking authentication...')

      const userResult = await getCurrentUser()

      if (userResult.success && userResult.user) {
        if (DEBUG) console.log('User authenticated:', userResult.user.email)

        setUser(userResult.user)

        // Redirect if needed
        if (redirectToDashboard && location.pathname === '/login') {
          navigate(ROUTES.DASHBOARD)
        }
      } else {
        if (DEBUG) console.log('User not authenticated')
        setUser(null)
      }
    } catch (err) {
      console.error('Auth check failed:', err)
      setUser(null)
      setError(err instanceof Error ? err.message : 'Authentication check failed')
    } finally {
      setLoading(false)
    }
  }, [redirectToDashboard, navigate, location.pathname])

  // Handle OAuth callback and initial auth check
  useEffect(() => {
    if (isGoogleOAuthCallback()) {
      if (DEBUG) console.log('OAuth callback detected, handling...')

      handleGoogleOAuthCallback()
        .then((result) => {
          if (result.success && result.user) {
            if (DEBUG) console.log('OAuth callback handled successfully')
            setUser(result.user)
            setLoading(false)

            // Redirect to dashboard if needed
            if (redirectToDashboard) {
              navigate(ROUTES.DASHBOARD)
            }
          } else {
            console.error('OAuth callback failed:', result.error)
            setError(result.error || 'Authentication failed')
            setLoading(false)
          }
        })
        .catch((err) => {
          console.error('OAuth callback error:', err)
          setError('Authentication failed. Please try again.')
          setLoading(false)
        })
    } else {
      checkAuth()
    }
  }, [checkAuth, redirectToDashboard, navigate])

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      setError(null)
      if (DEBUG) console.log('Starting Google sign-in...')

      const result = await googleSignIn({
        onSuccess: (user) => {
          if (DEBUG) console.log('Google sign-in successful:', user.email)
          setUser(user)
          if (redirectToDashboard) {
            navigate(ROUTES.DASHBOARD)
          }
        },
        onError: (error) => {
          console.error('Google sign-in error:', error)
          setError(error.userMessage)
        },
      })

      if (!result.success && result.error) {
        setError(result.error.userMessage)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed'
      console.error('Google sign in error:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)
      if (DEBUG) console.log('Signing out...')

      const result = await logout()

      if (result.success) {
        setUser(null)
        navigate(ROUTES.LOGIN)
      } else {
        setError(result.error || 'Sign out failed')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed'
      console.error('Sign out error:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  const refreshUser = async () => {
    try {
      if (DEBUG) console.log('Refreshing user data...')
      const userResult = await getCurrentUser()

      if (userResult.success && userResult.user) {
        setUser(userResult.user)
        if (DEBUG) console.log('User data refreshed:', userResult.user.email)
      }
    } catch (err) {
      console.error('Error refreshing user data:', err)
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signInWithGoogle,
    signOut,
    clearError,
    refreshUser,
  }
}

// Backwards compatibility alias
export const useAppwriteAuth = useAuth
