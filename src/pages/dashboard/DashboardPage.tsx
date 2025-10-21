
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"
import { SidebarNavigation } from "@/features/dashboard/components/SidebarNavigation"
import { DashboardContent } from "@/features/dashboard/components/DashboardContent"

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
