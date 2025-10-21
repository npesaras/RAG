import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import { ROUTES } from "@/lib/constants"
import communicationSvg from "@/assets/communication.svg"
import { useAppwriteAuth } from "@/hooks/useAppwriteAuth"
import { GoogleIcon } from "@/components/ui/icons/GoogleIcon"

// Login Page Component
export default function LoginPage() {
  const navigate = useNavigate()
  const { signInWithGoogle, loading, error, clearError } = useAppwriteAuth(true)

  const handleGoogleLogin = async () => {
    clearError()
    await signInWithGoogle()
  }

  const handleBackToHome = () => {
    navigate(ROUTES.HOME)
  }

  // Show loading while checking session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If user is authenticated, they will be redirected by the hook
  // This component will only render for unauthenticated users

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login form */}
      <div className="flex-1 flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Login</h1>
            <p className="text-muted-foreground">
              Sign in with your Google account
            </p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <Button 
              onClick={handleGoogleLogin}
              variant="outline"
              size="lg"
              className="w-full h-12 text-base"
              disabled={loading}
            >
              <GoogleIcon />
              {loading ? 'Signing in...' : 'Continue with Google'}
            </Button>

            <Button 
              onClick={handleBackToHome}
              variant="ghost"
              size="lg"
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Right side - Image and content */}
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
          {/* Communication SVG */}
          <div className="mb-8 w-full max-w-lg h-96">
            <img 
              src={communicationSvg} 
              alt="Communication illustration" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  )
}