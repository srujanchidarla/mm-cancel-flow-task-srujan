import { useState, useCallback } from 'react'
import { FlowState, FlowStep } from '@/types/cancellation'

const INITIAL_STATE: FlowState = {
  currentStep: 'job_question',
  foundJob: null,
  needsJobHelp: null,
  cancellationReason: null,
  downsellVariant: null,
  acceptedDownsell: null,
}

export const useCancellationFlow = () => {
  const [state, setState] = useState<FlowState>(INITIAL_STATE)

  const updateState = useCallback((updates: Partial<FlowState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  const goToStep = useCallback((step: FlowStep) => {
    updateState({ currentStep: step })
  }, [updateState])

  const handleJobResponse = useCallback((foundJob: boolean) => {
    const nextStep = foundJob ? 'found_job' : 'still_looking'
    updateState({ 
      foundJob, 
      currentStep: nextStep,
      cancellationReason: foundJob ? 'found_job' : 'still_looking'
    })
  }, [updateState])

  const handleJobHelpResponse = useCallback((needsHelp: boolean) => {
    updateState({ 
      needsJobHelp: needsHelp,
      currentStep: 'downsell_offer'
    })
  }, [updateState])

  const handleDownsellResponse = useCallback((accepted: boolean) => {
    updateState({ 
      acceptedDownsell: accepted,
      currentStep: accepted ? 'confirmation' : 'success'
    })
  }, [updateState])

  const reset = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  return {
    state,
    updateState,
    goToStep,
    handleJobResponse,
    handleJobHelpResponse,
    handleDownsellResponse,
    reset,
  }
}