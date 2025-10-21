import { useRef } from "react"
import { useNavigate } from "react-router"
import { ROUTES } from "@/lib/constants"
import { LandingNavbar } from "./components/LandingNavbar"
import { LandingHero } from "./components/LandingHero"
import { FeatureGrid } from "./components/FeatureGrid"

export default function LandingPage() {
  const navigate = useNavigate()
  const homeRef = useRef<HTMLElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  const handleLoginClick = () => {
    navigate(ROUTES.LOGIN)
  }

  const scrollToSection = (sectionId: string) => {
    const refs = {
      home: homeRef,
      features: featuresRef,
      contact: contactRef,
    }

    const targetRef = refs[sectionId as keyof typeof refs]
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar 
        onLoginClick={handleLoginClick}
        onScrollToSection={scrollToSection}
      />

      <main ref={homeRef} className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <LandingHero onGetStartedClick={handleLoginClick} />
          <div ref={featuresRef}>
            <FeatureGrid />
          </div>
        </div>
      </main>

      {/* Footer */}
      <div ref={contactRef} />
    </div>
  )
}