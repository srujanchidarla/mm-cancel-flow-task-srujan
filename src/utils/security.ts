/* eslint-disable @typescript-eslint/no-explicit-any */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Basic XSS protection
    .trim()
    .slice(0, 500) // Limit length
}

export const validateFlowData = (data: any): boolean => {
  if (typeof data.foundJob !== 'boolean' && data.foundJob !== null) return false
  if (typeof data.needsJobHelp !== 'boolean' && data.needsJobHelp !== null) return false
  if (data.cancellationReason && typeof data.cancellationReason !== 'string') return false
  
  return true
}

export const generateCSRFToken = (): string => {
  return crypto.randomUUID()
}