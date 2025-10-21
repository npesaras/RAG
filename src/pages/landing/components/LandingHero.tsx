import { Button } from "@/components/ui/button"

interface LandingHeroProps {
  onGetStartedClick: () => void
}

export function LandingHero({ onGetStartedClick }: LandingHeroProps) {
  return (
    <main id="home" className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-5xl font-bold text-foreground leading-tight">
          Intelligent Search,{" "}
          <span className="text-primary">Built for MSU-IIT CCS</span> Students
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A sophisticated web application powered by Retrieval-Augmented Generation (RAG).
        </p>

        <div className="flex gap-4 justify-center mt-8">
          <Button onClick={onGetStartedClick} size="lg" className="px-8">
            Get Started
          </Button>
          <Button variant="outline" size="lg" className="px-8">
            Learn More
          </Button>
        </div>
      </div>
    </main>
  )
}
