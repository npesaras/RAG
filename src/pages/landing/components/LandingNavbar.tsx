import { Button } from "@/components/ui/button"

interface LandingNavbarProps {
  onLoginClick: () => void
  onScrollToSection: (sectionId: string) => void
}

export function LandingNavbar({ onLoginClick, onScrollToSection }: LandingNavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand/Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary">Wolfie</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onScrollToSection('home')}
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Home
            </button>
            <button
              onClick={() => onScrollToSection('features')}
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Features
            </button>
            <button
              onClick={() => onScrollToSection('contact')}
              className="text-gray-700 hover:text-primary transition-colors font-medium"
            >
              Contact
            </button>
          </div>

          {/* Login/Signup Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onLoginClick}
              className="text-gray-700 hover:text-primary"
            >
              Log in
            </Button>
            <Button onClick={onLoginClick} className="bg-primary hover:bg-primary/90 text-white px-6">
              Sign up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
