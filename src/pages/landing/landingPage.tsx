import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router"
import { ROUTES } from "@/lib/constants"

export default function LandingPage() {
  const navigate = useNavigate()

  const handleLoginClick = () => {
    navigate(ROUTES.LOGIN)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Navbar */}
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
                onClick={() => scrollToSection('home')}
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Contact
              </button>
            </div>

            {/* Login/Signup Buttons */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={handleLoginClick}
                className="text-gray-700 hover:text-primary"
              >
                Log in
              </Button>
              <Button 
                onClick={handleLoginClick}
                className="bg-primary hover:bg-primary/90 text-white px-6"
              >
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

      {/* Hero Section */}
      <main id="home" className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold text-foreground leading-tight">
            Intelligent Search,{" "}
            <span className="text-primary">Built for MSU-IIT CCS</span>{" "}
            Students
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A sophisticated web application powered by Retrieval-Augmented Generation (RAG).
          </p>

          <div className="flex gap-4 justify-center mt-8">
            <Button onClick={handleLoginClick} size="lg" className="px-8">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              Learn More
            </Button>
          </div>

          {/* Features */}
          <div id="features" className="grid md:grid-cols-2 gap-6 mt-16">
            {/* 24/7 Chat Assistant */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100">24/7 Chat Assistant</h3>
                  <p className="text-purple-700 dark:text-purple-300 text-sm leading-relaxed">
                    Get instant answers to your questions anytime. Our AI assistant is available round the clock to help with coursework, campus information, and academic guidance.
                  </p>
                  <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                    Start chatting →
                  </div>
                </div>
              </div>
            </div>

            {/* Download College Prospectus */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100">Download College Prospectus</h3>
                  <p className="text-orange-700 dark:text-orange-300 text-sm leading-relaxed">
                    Access comprehensive college brochures, course catalogs, and program details. Download official prospectuses for all CCS programs and departments.
                  </p>
                  <div className="text-orange-600 dark:text-orange-400 text-sm font-medium">
                    Browse downloads →
                  </div>
                </div>
              </div>
            </div>

            {/* Browse Professors Directory */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-green-900 dark:text-green-100">Browse Professors Directory</h3>
                  <p className="text-green-700 dark:text-green-300 text-sm leading-relaxed">
                    Find faculty contact information, office hours, research interests, and expertise areas. Connect with the right professors for your academic needs.
                  </p>
                  <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                    Explore directory →
                  </div>
                </div>
              </div>
            </div>

            {/* Access CCS Knowledge Base */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">Access CCS Knowledge Base</h3>
                  <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                    Explore our comprehensive database of academic resources, course materials, research papers, and institutional knowledge curated for CCS students.
                  </p>
                  <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                    Browse knowledge →
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
    </div>
  )
}