import { Settings, LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useAppwriteAuth } from "@/hooks/useAppwriteAuth"
import { useUserProfile } from "@/hooks/useUserProfile"
import { ROUTES } from "@/lib/constants"
import { useNavigate } from "react-router"

export function UserAccountDropdown() {
  const { user, signOut, loading } = useAppwriteAuth()
  const { displayName, refreshTrigger } = useUserProfile()
  const navigate = useNavigate()

  // Debug log to track updates
  console.log('UserAccountDropdown render - displayName:', displayName, 'refreshTrigger:', refreshTrigger)

  if (loading) {
    return (
      <SidebarMenuButton size="lg" className="w-full justify-start">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate text-muted-foreground">Loading...</span>
        </div>
      </SidebarMenuButton>
    )
  }

  if (!user) {
    return (
      <SidebarMenuButton size="lg" className="w-full justify-start">
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          <Settings className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate text-muted-foreground">Not logged in</span>
        </div>
      </SidebarMenuButton>
    )
  }

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const handleProfileSettings = () => {
    navigate(ROUTES.PROFILE)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton 
          size="lg" 
          className="w-full justify-start data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(displayName || user?.email || 'User')}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{displayName}</span>
            <span className="truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56" 
        align="end" 
        alignOffset={-4}
        side="top"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfileSettings} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}