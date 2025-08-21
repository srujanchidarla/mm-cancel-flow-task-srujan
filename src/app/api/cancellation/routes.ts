/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'

interface CancellationRequest {
  userId: string
  subscriptionId: string
  downsellVariant: 'A' | 'B'
  reason: string
  acceptedDownsell: boolean
}

const validateCancellationRequest = (data: any): data is CancellationRequest => {
  return (
    typeof data.userId === 'string' &&
    typeof data.subscriptionId === 'string' &&
    ['A', 'B'].includes(data.downsellVariant) &&
    typeof data.reason === 'string' &&
    typeof data.acceptedDownsell === 'boolean'
  )
}

const sanitizeString = (str: string): string => {
  return str.replace(/[<>]/g, '').trim().slice(0, 500)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!validateCancellationRequest(body)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    const { userId, subscriptionId, downsellVariant, reason, acceptedDownsell } = body
    const sanitizedReason = sanitizeString(reason)

    // Mock successful response
    const cancellation = {
      id: crypto.randomUUID(),
      user_id: userId,
      subscription_id: subscriptionId,
      downsell_variant: downsellVariant,
      reason: sanitizedReason,
      accepted_downsell: acceptedDownsell,
      created_at: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      cancellation,
      message: acceptedDownsell 
        ? 'Subscription updated with discount'
        : 'Cancellation processed successfully'
    })

  } catch (error) {
    console.error('Cancellation API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}