import type { ReactNode } from 'react'

interface FeatureCardProps {
  title: string
  description: string
  icon: ReactNode
  gradient: string
  borderColor: string
  iconBgColor: string
  iconColor: string
  textColor: string
  actionText: string
  actionColor: string
}

export function FeatureCard({
  title,
  description,
  icon,
  gradient,
  borderColor,
  iconBgColor,
  iconColor,
  textColor,
  actionText,
  actionColor,
}: FeatureCardProps) {
  return (
    <div className={`${gradient} rounded-xl p-6 border ${borderColor}`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <div className={iconColor}>{icon}</div>
        </div>
        <div className="space-y-2">
          <h3 className={`text-xl font-semibold ${textColor}`}>{title}</h3>
          <p className={`${textColor} text-sm leading-relaxed opacity-90`}>{description}</p>
          <div className={`${actionColor} text-sm font-medium`}>{actionText}</div>
        </div>
      </div>
    </div>
  )
}
