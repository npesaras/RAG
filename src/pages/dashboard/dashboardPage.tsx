
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"
import { SidebarNavigation } from "@/components/dashboard/SidebarNavigation"
import { DashboardContent } from "@/components/dashboard/DashboardContent"

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <SidebarNavigation />
      <SidebarInset>        
        <DashboardContent />
      </SidebarInset>
    </SidebarProvider>
  )
}
