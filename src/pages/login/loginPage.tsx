import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import { ROUTES } from "@/lib/constants"
import { useState } from "react"
import communicationSvg from "@/assets/communication.svg"

// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

// Login Page Component
export default function LoginPage() {
  const navigate = useNavigate()
  const [authError, setAuthError] = useState<string | null>(null)

  const handleLogin = async () => {
    // TODO: Implement authentication logic
    setAuthError('Authentication not yet implemented')
  }

  const handleBackToHome = () => {
    navigate(ROUTES.HOME)
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
            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {authError}
              </div>
            )}
            
            <Button 
              onClick={handleLogin}
              variant="outline"
              size="lg"
              className="w-full h-12 text-base"
            >
              <GoogleIcon />
              Continue with Google
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