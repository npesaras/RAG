import { useState, useEffect, useCallback } from 'react'
import { getUserByEmail } from '../api/user-profile'
import { useAuth } from '@/features/auth/hooks/useAuth'

// Simple counter to force re-renders across components
let profileRefreshCounter = 0

// Helper function to trigger profile refresh
export const triggerProfileRefresh = () => {
  profileRefreshCounter++
  // Force re-render in all components using this hook
  window.dispatchEvent(new CustomEvent('forceProfileRefresh', { 
    detail: { counter: profileRefreshCounter } 
  }))
}

export const useUserProfile = () => {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState<{ name: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const fetchProfile = useCallback(async () => {
    if (!user?.email) return
    
    try {
      setIsLoading(true)
      console.log('Fetching profile data for:', user.email)
      const userDoc = await getUserByEmail(user.email)
      
      if (userDoc.success && userDoc.user) {
        console.log('Profile data fetched:', userDoc.user.name)
        setProfileData({ name: userDoc.user.name })
      } else {
        // Fallback to auth user data
        console.log('Using fallback auth data:', user.name)
        setProfileData({ name: user.name || 'User' })
      }
    } catch (error) {
      console.log('Error fetching profile data:', error)
      // Fallback to auth user data
      setProfileData({ name: user.name || 'User' })
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Initial fetch
  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  // Listen for profile update events
  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent) => {
      console.log('Profile refresh triggered, counter:', event.detail?.counter)
      setRefreshTrigger(prev => prev + 1)
      fetchProfile()
    }

    window.addEventListener('forceProfileRefresh', handleProfileUpdate as EventListener)
    
    return () => {
      window.removeEventListener('forceProfileRefresh', handleProfileUpdate as EventListener)
    }
  }, [fetchProfile])

  const displayName = profileData?.name || user?.name || 'User'
  console.log('useUserProfile displayName:', displayName)

  return {
    profileData,
    isLoading,
    displayName,
    refreshTrigger
  }
}