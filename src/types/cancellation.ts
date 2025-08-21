export interface User {
  id: string
  email: string
}

export interface Subscription {
  id: string
  user_id: string
  monthly_price: number
  status: 'active' | 'pending_cancellation' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Cancellation {
  id?: string
  user_id: string
  subscription_id: string
  downsell_variant: 'A' | 'B'
  reason?: string
  accepted_downsell: boolean
  created_at?: string
}

export type FlowStep = 
  | 'job_question'
  | 'found_job'
  | 'still_looking'
  | 'job_help'
  | 'downsell_offer'
  | 'confirmation'
  | 'success'

export interface FlowState {
  currentStep: FlowStep
  foundJob: boolean | null
  needsJobHelp: boolean | null
  cancellationReason: string | null
  downsellVariant: 'A' | 'B' | null
  acceptedDownsell: boolean | null
}

export interface DownsellOffer {
  variant: 'A' | 'B'
  originalPrice: number
  discountedPrice: number
  discount: number
}