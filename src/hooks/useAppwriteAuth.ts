/**
 * @deprecated This file has been moved to @/features/auth/hooks/useAuth
 * Please import from '@/features/auth' instead.
 * 
 * This facade maintains backwards compatibility during the migration.
 */

export { useAuth as useAppwriteAuth, type UseAuthReturn } from '@/features/auth/hooks/useAuth'

// Re-export for convenience
export { useAuth } from '@/features/auth/hooks/useAuth'

// Re-export types
export type { AppwriteUser } from '@/features/auth/types/auth.types'
