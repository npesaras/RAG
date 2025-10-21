import {
  FileText,
  MessageSquare,
  GraduationCap,
  FolderOpen,
} from "lucide-react"

import { ROUTES } from "@/lib/constants"
import { QuickAccessCard } from "./QuickAccessCard"

const quickAccessCards = [
  {
    title: "Knowledge Base",
    description: "Explore and manage your articles and knowledge resources",
    icon: FileText,
    gradient: "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800",
    iconColor: "text-blue-600 dark:text-blue-400",
    href: ROUTES.ARTICLES,
    actionText: "Browse articles →",
  },
  {
    title: "Ask Questions",
    description: "Get instant answers from your AI assistant",
    icon: MessageSquare,
    gradient: "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800",
    iconColor: "text-green-600 dark:text-green-400",
    href: ROUTES.CHATBOT,
    actionText: "Start chatting →",
  },
  {
    title: "Download Prospectus",
    description: "Access prospectuses and academic materials",
    icon: GraduationCap,
    gradient: "bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800",
    iconColor: "text-purple-600 dark:text-purple-400",
    href: ROUTES.PROSPECTUS,
    actionText: "View resources →",
  },
  {
    title: "File Management",
    description: "Organize and browse your document directory",
    icon: FolderOpen,
    gradient: "bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800",
    iconColor: "text-orange-600 dark:text-orange-400",
    href: ROUTES.DIRECTORY,
    actionText: "Browse files →",
  },
]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Welcome to RAG Assistant!</h2>
        <p className="text-muted-foreground">Here's an overview of your innovation journey</p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickAccessCards.map((card) => (
          <QuickAccessCard
            key={card.title}
            title={card.title}
            description={card.description}
            icon={card.icon}
            gradient={card.gradient}
            iconColor={card.iconColor}
            href={card.href}
            actionText={card.actionText}
          />
        ))}
      </div>
    </div>
  )
}