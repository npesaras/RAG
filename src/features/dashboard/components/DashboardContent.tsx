import { useLocation } from "react-router"
import { ROUTES } from "@/lib/constants"
import { DashboardOverview } from "./DashboardOverview"
import { ProfileSettings } from "./ProfileSettings"

export function DashboardContent() {
  const location = useLocation()
  
  // Get main content based on current route
  const getMainContent = () => {
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
      case ROUTES.PROFILE:
        return <ProfileSettings />
      default:
        return (
          <div className="space-y-6">
            <DashboardOverview />
          </div>
        )
    }
  }

  return (
    <div className="flex flex-1 flex-col p-6">
      {getMainContent()}
    </div>
  )
}