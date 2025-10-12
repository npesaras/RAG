import { Settings, LogOut, User } from "lucide-react"
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

export function UserAccountDropdown() {
  const { user, signOut, loading, isAuthenticated } = useAppwriteAuth()

  // Debug: Always show something to help troubleshoot
  console.log('UserAccountDropdown - Debug:', { user, loading, isAuthenticated })

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
          <User className="h-4 w-4 text-muted-foreground" />
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
    // Navigate to profile settings page
    console.log("Navigate to profile settings")
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
              {getInitials(user.name || user.email)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name || 'User'}</span>
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
            <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfileSettings} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>My Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleProfileSettings} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Profile Settings</span>
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