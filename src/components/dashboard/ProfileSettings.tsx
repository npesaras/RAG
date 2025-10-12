import { useState, useEffect } from 'react'
import { useAppwriteAuth } from '@/hooks/useAppwriteAuth'
import { updateUserDocument, getUserByEmail } from '@/lib/appwrite'
import { triggerProfileRefresh } from '@/hooks/useUserProfile'

export function ProfileSettings() {
  const { user, refreshUser } = useAppwriteAuth()
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Load user data from database when component mounts
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.email) return
      
      try {
        setIsLoadingData(true)
        const userDoc = await getUserByEmail(user.email)
        
        if (userDoc.success && userDoc.user) {
          // Parse the user's full name from database
          const fullName = userDoc.user.name || ''
          const nameParts = fullName.split(' ')
          setFirstName(nameParts[0] || '')
          setLastName(nameParts.slice(1).join(' ') || '')
        } else {
          // Fallback to auth user data if database user not found
          const authName = user.name || ''
          const nameParts = authName.split(' ')
          setFirstName(nameParts[0] || '')
          setLastName(nameParts.slice(1).join(' ') || '')
        }
      } catch (error) {
        console.error('Error loading user data:', error)
        // Fallback to auth user data
        const authName = user.name || ''
        const nameParts = authName.split(' ')
        setFirstName(nameParts[0] || '')
        setLastName(nameParts.slice(1).join(' ') || '')
      } finally {
        setIsLoadingData(false)
      }
    }

    loadUserData()
  }, [user])

  const handleSaveChanges = async () => {
    if (!user) return

    // Validation
    const trimmedFirstName = firstName.trim()
    const trimmedLastName = lastName.trim()
    
    if (!trimmedFirstName) {
      setMessage({ type: 'error', text: 'First name is required' })
      return
    }
    
    if (!trimmedLastName) {
      setMessage({ type: 'error', text: 'Last name is required' })
      return
    }

    try {
      setIsLoading(true)
      setMessage(null)

      // Combine first and last name
      const fullName = `${trimmedFirstName} ${trimmedLastName}`.trim()

      // Update the user document in the database
      const result = await updateUserDocument(user.$id, {
        name: fullName,
        email: user.email // Keep the same email
      })

      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        // Refresh the user data to update the UI
        await refreshUser()
        
        // Trigger profile refresh in other components (like UserAccountDropdown)
        triggerProfileRefresh()
        
        // Update local state to reflect the new full name structure
        setFirstName(trimmedFirstName)
        setLastName(trimmedLastName)
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading user information...</p>
      </div>
    )
  }

  if (isLoadingData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading profile data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-medium mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <input 
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <input 
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input 
              type="email" 
              value={user.email}
              className="mt-1 w-full px-3 py-2 border rounded-md bg-muted"
              disabled
            />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
          </div>
          
          {message && (
            <div className={`p-3 rounded-md text-sm ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}
          
          <button 
            onClick={handleSaveChanges}
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}