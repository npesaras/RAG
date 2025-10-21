import type { LucideIcon } from "lucide-react"
import { useNavigate } from "react-router"

interface QuickAccessCardProps {
  title: string
  description: string
  icon: LucideIcon
  gradient: string
  iconColor: string
  href: string
  actionText: string
}

export function QuickAccessCard({ 
  title, 
  description, 
  icon: Icon, 
  gradient, 
  iconColor, 
  href, 
  actionText 
}: QuickAccessCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(href)
  }

  return (
    <div 
      className="group cursor-pointer rounded-xl border bg-card p-6"
      onClick={handleClick}
    >
      <div className="space-y-4">
        <div className={`h-32 ${gradient} rounded-lg flex items-center justify-center`}>
          <Icon className={`h-12 w-12 ${iconColor}`} />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
          <div className="text-primary text-sm font-medium group-hover:underline">
            {actionText}
          </div>
        </div>
      </div>
    </div>
  )
}