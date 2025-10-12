
import {
  Home,
  FileText,
  MessageSquare,
  GraduationCap,
  FolderOpen,
  Settings,
  HelpCircle,
} from "lucide-react"
import { useLocation } from "react-router"

import { ROUTES } from "@/lib/constants"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useOAuthCallback } from "@/hooks/useOAuthCallback"

// Menu items for the sidebar
const items = [
  {
    title: "Dashboard",
    url: ROUTES.DASHBOARD,
    icon: Home,
  },
  {
    title: "Articles",
    url: ROUTES.ARTICLES,
    icon: FileText,
  },
  {
    title: "Chatbot",
    url: ROUTES.CHATBOT,
    icon: MessageSquare,
  },
  {
    title: "Prospectus",
    url: ROUTES.PROSPECTUS,
    icon: GraduationCap,
  },
  {
    title: "Directory",
    url: ROUTES.DIRECTORY,
    icon: FolderOpen,
  },
]

const bottomItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Help",
    url: "/help",
    icon: HelpCircle,
  },
]

export default function DashboardPage() {
  const location = useLocation()
  
  // Handle OAuth callback processing
  const { isProcessing, error } = useOAuthCallback()
  
  // Get main content based on current route
  const getMainContent = () => {
    // Show OAuth processing state if needed
    if (isProcessing) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-lg font-medium">Setting up your account...</div>
            <div className="text-sm text-muted-foreground mt-2">Please wait while we save your profile.</div>
          </div>
        </div>
      )
    }

    // Show OAuth error if any
    if (error) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-lg font-medium text-red-600">Authentication Error</div>
            <div className="text-sm text-muted-foreground mt-2">{error}</div>
          </div>
        </div>
      )
    }

    switch (location.pathname) {
      case ROUTES.ARTICLES:
        return (
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-medium mb-2">Article Management</h4>
              <p className="text-sm text-muted-foreground">
                Create, edit, and manage your articles and content here.
              </p>
            </div>
          </div>
        )
      case ROUTES.CHATBOT:
        return (
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-medium mb-2">AI Chatbot</h4>
              <p className="text-sm text-muted-foreground">
                Interact with your intelligent assistant for quick answers and support.
              </p>
            </div>
          </div>
        )
      case ROUTES.PROSPECTUS:
        return (
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-medium mb-2">Prospectus Management</h4>
              <p className="text-sm text-muted-foreground">
                Manage academic prospectuses, course catalogs, and institutional information.
              </p>
            </div>
          </div>
        )
      case ROUTES.DIRECTORY:
        return (
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-medium mb-2">File Directory</h4>
              <p className="text-sm text-muted-foreground">
                Browse, organize, and manage your files and documents.
              </p>
            </div>
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Header */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Welcome to RAG Assistant!</h2>
              <p className="text-muted-foreground">Here's an overview of your innovation journey</p>
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Knowledge Base Card - Links to Articles */}
              <div 
                className="group cursor-pointer rounded-xl border bg-card p-6"
                onClick={() => window.location.href = ROUTES.ARTICLES}
              >
                <div className="space-y-4">
                  <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center">
                    <FileText className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Knowledge Base</h3>
                    <p className="text-sm text-muted-foreground">
                      Explore and manage your articles and knowledge resources
                    </p>
                    <div className="text-primary text-sm font-medium group-hover:underline">
                      Browse articles →
                    </div>
                  </div>
                </div>
              </div>

              {/* Ask Questions Card - Links to Chatbot */}
              <div 
                className="group cursor-pointer rounded-xl border bg-card p-6"
                onClick={() => window.location.href = ROUTES.CHATBOT}
              >
                <div className="space-y-4">
                  <div className="h-32 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Ask Questions</h3>
                    <p className="text-sm text-muted-foreground">
                      Get instant answers from your AI assistant
                    </p>
                    <div className="text-primary text-sm font-medium group-hover:underline">
                      Start chatting →
                    </div>
                  </div>
                </div>
              </div>

              {/* Links to Prospectus */}
              <div 
                className="group cursor-pointer rounded-xl border bg-card p-6"
                onClick={() => window.location.href = ROUTES.PROSPECTUS}
              >
                <div className="space-y-4">
                  <div className="h-32 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Download Prospectus</h3>
                    <p className="text-sm text-muted-foreground">
                      Access prospectuses and academic materials
                    </p>
                    <div className="text-primary text-sm font-medium group-hover:underline">
                      View resources →
                    </div>
                  </div>
                </div>
              </div>

              {/* Links to Directory */}
              <div 
                className="group cursor-pointer rounded-xl border bg-card p-6"
                onClick={() => window.location.href = ROUTES.DIRECTORY}
              >
                <div className="space-y-4">
                  <div className="h-32 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-lg flex items-center justify-center">
                    <FolderOpen className="h-12 w-12 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">File Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Organize and browse your document directory
                    </p>
                    <div className="text-primary text-sm font-medium group-hover:underline">
                      Browse files →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-4 w-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                RAG Assistant
              </span>
              <span className="truncate text-xs text-muted-foreground">
                v1.0.0
              </span>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      size="lg"
                      isActive={location.pathname === item.url}
                    >
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            {bottomItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild size="lg">
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      
      <SidebarInset>        
        <div className="flex flex-1 flex-col p-6">
          {getMainContent()}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
