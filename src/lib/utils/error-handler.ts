/**
 * Shared error handling utilities
 */

export interface ErrorResult {
  success: false
  error: string
}

/**
 * Generic error handler that converts unknown errors to a standardized format
 * @param error - The error to handle (can be Error, string, or unknown)
 * @returns Standardized error result object
 */
export const handleError = (error: unknown): ErrorResult => ({
  success: false,
  error: error instanceof Error ? error.message : 'Unknown error',
})

/**
 * Extract error message from various error types
 * @param error - The error to extract message from
 * @returns Error message string
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'Unknown error'
}
